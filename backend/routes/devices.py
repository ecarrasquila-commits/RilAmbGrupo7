from collections import Counter

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from datetime import datetime

from database.session import get_db
from utils.jwt_handler import verify_token
from models.user import User
from models.device import Device
from models.user_device import UserDevice
from models.sensor_reading import SensorReading
from models.alert import Alert
from models.enums import DeviceStatus
from schemas.device_schema import DeviceLinkRequest, DeviceLinkResponse, DeviceResponse, ReportSummaryResponse, SensorDataResponse

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)

DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]


def get_token_from_header(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Formato de token inválido. Use: Bearer <token>"
        )
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    return payload


def get_current_user(
    token_payload: dict = Depends(get_token_from_header),
    db: Session = Depends(get_db)
):
    user = db.execute(
        select(User).where(User.correo == token_payload.get("sub"))
    ).scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    return user


@router.post("/link", response_model=DeviceLinkResponse)
def link_device(
    request: DeviceLinkRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Vincula un dispositivo a la sesión del usuario usando el código de vinculación.
    Un dispositivo solo puede estar vinculado a una sesión a la vez.
    """
    # Buscar dispositivo por código de vinculación
    device = db.execute(
        select(Device).where(Device.pairing_code == request.pairing_code)
    ).scalar_one_or_none()
    
    if not device:
        raise HTTPException(
            status_code=404,
            detail="Dispositivo no encontrado con el código de vinculación proporcionado"
        )
    
    # Verificar si el dispositivo ya está vinculado a otro usuario
    existing_link = db.execute(
        select(UserDevice).where(
            UserDevice.dispositivo_id == device.id,
            UserDevice.is_active == True
        )
    ).scalar_one_or_none()
    
    if existing_link:
        # Si ya está vinculado al mismo usuario, retornar el enlace existente
        if existing_link.usuario_id == current_user.cedula:
            if request.alias is not None and request.alias != existing_link.alias:
                existing_link.alias = request.alias
                try:
                    db.commit()
                    db.refresh(existing_link)
                except Exception as e:
                    db.rollback()
                    raise HTTPException(
                        status_code=400,
                        detail=f"Error al actualizar alias del dispositivo: {str(e)}"
                    )
            return existing_link
        
        # Si está vinculado a otro usuario, error
        raise HTTPException(
            status_code=400,
            detail="Este dispositivo ya está vinculado a otra sesión"
        )
    
    # Crear nuevo vínculo
    user_device = UserDevice(
        usuario_id=current_user.cedula,
        dispositivo_id=device.id,
        alias=request.alias or f"Dispositivo {device.pairing_code}",
        is_active=True
    )
    
    try:
        db.add(user_device)
        db.commit()
        db.refresh(user_device)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al vincular dispositivo: {str(e)}"
        )
    
    return user_device


@router.get("/my-devices", response_model=list[DeviceResponse])
def get_my_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de dispositivos vinculados al usuario actual.
    """
    # Buscar dispositivos vinculados al usuario
    user_devices = db.execute(
        select(UserDevice).where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True
        )
    ).scalars().all()
    
    device_ids = [ud.dispositivo_id for ud in user_devices]
    
    if not device_ids:
        return []
    
    # Obtener detalles de los dispositivos junto con el alias guardado en el vínculo
    device_rows = db.execute(
        select(Device, UserDevice).where(
            Device.id == UserDevice.dispositivo_id,
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True,
        )
    ).all()

    return [
        {
            "id": device.id,
            "mac_address": device.mac_address,
            "pairing_code": device.pairing_code,
            "firmware_version": device.firmware_version,
            "estado": device.estado,
            "last_seen": device.last_seen,
            "created_at": device.created_at,
            "alias": user_device.alias,
        }
        for device, user_device in device_rows
    ]


@router.post("/unlink/{device_id}")
def unlink_device(
    device_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Desvincula un dispositivo de la sesión del usuario.
    """
    from uuid import UUID
    
    try:
        device_uuid = UUID(device_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="ID de dispositivo inválido"
        )
    
    # Buscar el vínculo
    user_device = db.execute(
        select(UserDevice).where(
            UserDevice.dispositivo_id == device_uuid,
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True
        )
    ).scalar_one_or_none()
    
    if not user_device:
        raise HTTPException(
            status_code=404,
            detail="Vínculo de dispositivo no encontrado"
        )
    
    # Desactivar el vínculo
    user_device.is_active = False
    user_device.unlinked_at = datetime.utcnow()
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al desvincular dispositivo: {str(e)}"
        )
    
    return {"message": "Dispositivo desvinculado exitosamente"}


@router.get("/sensor-data", response_model=SensorDataResponse)
def get_sensor_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene los datos de sensores para la sesión actual.
    Si la sesión tiene un dispositivo vinculado, retorna los datos reales.
    Si no tiene dispositivo vinculado, retorna ceros.
    """
    # Buscar dispositivo vinculado al usuario
    user_device = db.execute(
        select(UserDevice).where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True
        )
    ).scalar_one_or_none()
    
    if not user_device:
        # No tiene dispositivo vinculado → retornar indicador sin datos
        return SensorDataResponse(
            has_device=False,
            mq2=None,
            mq4=None,
            mq7=None,
            temperatura=None,
            humedad=None,
            timestamp=None
        )
    
    # Tiene dispositivo vinculado → obtener última lectura
    latest_reading = db.execute(
        select(SensorReading)
        .where(SensorReading.dispositivo_id == user_device.dispositivo_id)
        .order_by(desc(SensorReading.created_at))
        .limit(1)
    ).scalar_one_or_none()
    
    if not latest_reading:
        # Dispositivo vinculado pero sin lecturas aún → retornar ceros
        return SensorDataResponse(
            has_device=True,
            mq2=0.0,
            mq4=0.0,
            mq7=0.0,
            temperatura=0.0,
            humedad=0.0,
            timestamp=datetime.utcnow()
        )
    
    # Retornar datos reales
    return SensorDataResponse(
        has_device=True,
        mq2=latest_reading.mq2 or 0.0,
        mq4=latest_reading.mq4 or 0.0,
        mq7=latest_reading.mq7 or 0.0,
        temperatura=latest_reading.temperatura or 0.0,
        humedad=latest_reading.humedad or 0.0,
        timestamp=latest_reading.created_at
    )


@router.get("/sensor-history")
def get_sensor_history(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial de lecturas de sensores para la sesión actual.
    Si no tiene dispositivo vinculado, retorna array vacío.
    """
    # Buscar dispositivo vinculado al usuario
    user_device = db.execute(
        select(UserDevice).where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True
        )
    ).scalar_one_or_none()
    
    if not user_device:
        return []
    
    # Obtener historial de lecturas
    readings = db.execute(
        select(SensorReading)
        .where(SensorReading.dispositivo_id == user_device.dispositivo_id)
        .order_by(desc(SensorReading.created_at))
        .limit(limit)
    ).scalars().all()
    
    # Convertir a formato de respuesta
    history = []
    for reading in reversed(readings):  # Orden cronológico
        history.append({
            "alias": user_device.alias,
            "device_id": str(user_device.dispositivo_id),
            "mq2": reading.mq2 or 0.0,
            "mq4": reading.mq4 or 0.0,
            "mq7": reading.mq7 or 0.0,
            "temperatura": reading.temperatura or 0.0,
            "humedad": reading.humedad or 0.0,
            "timestamp": reading.created_at.isoformat()
        })
    
    return history


@router.get("/report-summary", response_model=ReportSummaryResponse)
def get_report_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene las métricas globales del reporte para la sesión actual.
    Los datos se calculan a partir de los vínculos y alertas almacenados en la BD.
    """
    linked_devices = db.execute(
        select(UserDevice).where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True
        )
    ).scalars().all()

    linked_devices_count = len(linked_devices)

    if not linked_devices_count:
        return ReportSummaryResponse(
            linked_devices_count=0,
            total_alerts_count=0,
            top_device_label=None,
            top_device_alerts=0,
            top_day_label=None,
            top_day_alerts=0,
        )

    device_ids = [device.dispositivo_id for device in linked_devices]
    alerts = db.execute(
        select(Alert).where(Alert.dispositivo_id.in_(device_ids))
    ).scalars().all()

    if not alerts:
        return ReportSummaryResponse(
            linked_devices_count=linked_devices_count,
            total_alerts_count=0,
            top_device_label=None,
            top_device_alerts=0,
            top_day_label=None,
            top_day_alerts=0,
        )

    alert_counts_by_device = Counter(alert.dispositivo_id for alert in alerts)
    top_device_id, top_device_alerts = alert_counts_by_device.most_common(1)[0]

    device_alias_map = {
        linked_device.dispositivo_id: linked_device.alias
        for linked_device in linked_devices
    }

    alerts_by_day = Counter(alert.created_at.weekday() for alert in alerts if alert.created_at)
    top_day_index, top_day_alerts = alerts_by_day.most_common(1)[0]

    return ReportSummaryResponse(
        linked_devices_count=linked_devices_count,
        total_alerts_count=len(alerts),
        top_device_label=device_alias_map.get(top_device_id) or "Dispositivo vinculado",
        top_device_alerts=top_device_alerts,
        top_day_label=DAY_LABELS[top_day_index],
        top_day_alerts=top_day_alerts,
    )
