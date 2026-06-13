"""
Módulo separado para dispositivo simulado.
Este módulo crea y gestiona un dispositivo simulado que envía datos a la base de datos
para propósitos de prueba cuando no hay dispositivos físicos disponibles.
"""

import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database.session import SessionLocal
from models.device import Device
from models.enums import DeviceStatus

# Código de vinculación del dispositivo simulado
SIMULATED_PAIRING_CODE = "20036044@LK19"
SIMULATED_MAC_ADDRESS = "SIM:DEV:001:TEST"

def create_simulated_device(db: Session = None) -> Device:
    """
    Crea el dispositivo simulado en la base de datos si no existe.
    
    Args:
        db: Sesión de base de datos (opcional, se crea una si no se proporciona)
    
    Returns:
        Device: El dispositivo simulado creado o existente
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    
    try:
        # Verificar si ya existe el dispositivo simulado
        existing_device = db.query(Device).filter(
            Device.pairing_code == SIMULATED_PAIRING_CODE
        ).first()
        
        if existing_device:
            print(f"Dispositivo simulado ya existe: {existing_device.id}")
            return existing_device
        
        # Crear nuevo dispositivo simulado
        simulated_device = Device(
            id=uuid.uuid4(),
            mac_address=SIMULATED_MAC_ADDRESS,
            pairing_code=SIMULATED_PAIRING_CODE,
            pairing_expires_at=datetime.utcnow() + timedelta(days=365),  # Expira en 1 año
            api_key_hash=None,  # No necesita API key para simulación
            firmware_version="SIM-1.0.0",
            estado=DeviceStatus.online,  # Dispositivo simulado siempre online
            last_seen=datetime.utcnow(),
        )
        
        db.add(simulated_device)
        db.commit()
        db.refresh(simulated_device)
        
        print(f"Dispositivo simulado creado exitosamente: {simulated_device.id}")
        print(f"Código de vinculación: {SIMULATED_PAIRING_CODE}")
        
        return simulated_device
        
    except Exception as e:
        db.rollback()
        print(f"Error al crear dispositivo simulado: {e}")
        raise
    finally:
        if close_db:
            db.close()

def get_simulated_device(db: Session = None) -> Device | None:
    """
    Obtiene el dispositivo simulado de la base de datos.
    
    Args:
        db: Sesión de base de datos (opcional, se crea una si no se proporciona)
    
    Returns:
        Device | None: El dispositivo simulado o None si no existe
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    
    try:
        device = db.query(Device).filter(
            Device.pairing_code == SIMULATED_PAIRING_CODE
        ).first()
        return device
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    # Ejecutar script para crear dispositivo simulado
    print("Creando dispositivo simulado...")
    device = create_simulated_device()
    print(f"Dispositivo ID: {device.id}")
    print(f"Código de vinculación: {device.pairing_code}")
    print(f"Estado: {device.estado}")
