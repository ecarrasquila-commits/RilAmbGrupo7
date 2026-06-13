from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from database.session import get_db
from utils.jwt_handler import verify_token
from models.alert import Alert
from models.device import Device
from models.user_device import UserDevice

from schemas.user_schema import (
    UserResponse,
    UserUpdate
)
from schemas.alert_schema import AlertNotificationResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


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
    from models.user import User
    from sqlalchemy import select
    
    user = db.execute(
        select(User).where(User.correo == token_payload.get("sub"))
    ).scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    return user


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user = Depends(get_current_user)
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields
    current_user.nombre = user_update.nombre
    current_user.apellido = user_update.apellido
    current_user.telefono = user_update.telefono
    current_user.correo = user_update.correo
    
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar usuario: {str(e)}"
        )
    
    return current_user


def _severity_to_type(severity: str | None) -> str:
    if severity in {"high", "critical"}:
        return "alarm"
    if severity in {"medium", "low"}:
        return "caution"
    return "device"


@router.get("/me/notifications", response_model=list[AlertNotificationResponse])
def get_current_user_notifications(
    limit: int = 20,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.execute(
        select(Alert, Device, UserDevice)
        .join(Device, Alert.dispositivo_id == Device.id)
        .join(UserDevice, UserDevice.dispositivo_id == Device.id)
        .where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True,
        )
        .order_by(desc(Alert.created_at))
        .limit(limit)
    ).all()

    notifications = []
    for alert, device, user_device in alerts:
        severity = alert.severidad.value if alert.severidad else ""
        notifications.append({
            "id": str(alert.id),
            "type": _severity_to_type(severity),
            "severity": severity,
            "title": alert.tipo or "Alerta",
            "device_name": user_device.alias or device.pairing_code or "Dispositivo vinculado",
            "device_code": device.pairing_code,
            "description": alert.mensaje or (f"Valor detectado: {alert.valor_detectado}" if alert.valor_detectado is not None else None),
            "unread": not alert.is_read,
            "created_at": alert.created_at,
        })

    return notifications


@router.post("/me/notifications/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from uuid import UUID

    try:
        notification_uuid = UUID(notification_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="ID de notificación inválido"
        )

    alert = db.execute(
        select(Alert)
        .join(Device, Alert.dispositivo_id == Device.id)
        .join(UserDevice, UserDevice.dispositivo_id == Device.id)
        .where(
            Alert.id == notification_uuid,
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True,
        )
    ).scalar_one_or_none()

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Notificación no encontrada"
        )

    alert.is_read = True

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al marcar notificación como leída: {str(e)}"
        )

    return {"message": "Notificación marcada como leída"}


@router.post("/me/notifications/read-all")
def mark_all_notifications_as_read(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.execute(
        select(Alert)
        .join(Device, Alert.dispositivo_id == Device.id)
        .join(UserDevice, UserDevice.dispositivo_id == Device.id)
        .where(
            UserDevice.usuario_id == current_user.cedula,
            UserDevice.is_active == True,
            Alert.is_read == False,
        )
    ).scalars().all()

    for alert in alerts:
        alert.is_read = True

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al marcar notificaciones como leídas: {str(e)}"
        )

    return {"message": "Notificaciones marcadas como leídas"}
