"""
Servicio para generar datos simulados de sensores basados en los valores estáticos actuales del frontend.
Este servicio inserta datos en la tabla lecturas_sensores para el dispositivo simulado.
"""

import random
from datetime import datetime
from sqlalchemy.orm import Session
from database.session import SessionLocal
from models.sensor_reading import SensorReading
from simulated_device import get_simulated_device

# Valores base basados en datos estáticos del frontend (userMonitoring.jsx y userReports.jsx)
# Estos son los valores seed y rangos observados en el frontend
BASE_VALUES = {
    "mq2": {
        "min": 100,
        "max": 400,
        "warn_at": 250,
        "alert_at": 300,
        "seed": 185  # Valor inicial de Sensor Sala A en userMonitoring.jsx
    },
    "mq4": {
        "min": 120,
        "max": 500,
        "warn_at": 300,
        "alert_at": 380,
        "seed": 220  # Valor inicial de Sensor Sala A en userMonitoring.jsx
    },
    "mq7": {
        "min": 80,
        "max": 350,
        "warn_at": 200,
        "alert_at": 250,
        "seed": 140  # Valor inicial similar a mq3 del frontend
    },
    "temperatura": {
        "min": 18.0,
        "max": 32.0,
        "seed": 24.5  # Temperatura ambiente típica
    },
    "humedad": {
        "min": 30.0,
        "max": 80.0,
        "seed": 55.0  # Humedad ambiente típica
    }
}

# Estado actual de los valores para simular variaciones en el tiempo
current_values = {
    "mq2": BASE_VALUES["mq2"]["seed"],
    "mq4": BASE_VALUES["mq4"]["seed"],
    "mq7": BASE_VALUES["mq7"]["seed"],
    "temperatura": BASE_VALUES["temperatura"]["seed"],
    "humedad": BASE_VALUES["humedad"]["seed"]
}

def next_value(sensor_key: str) -> float:
    """
    Genera el siguiente valor para un sensor, simulando variaciones naturales.
    Basado en la lógica del frontend (userMonitoring.jsx línea 269-276).
    
    Args:
        sensor_key: Clave del sensor (mq2, mq4, mq7, temperatura, humedad)
    
    Returns:
        float: Siguiente valor simulado
    """
    global current_values
    
    config = BASE_VALUES[sensor_key]
    current = current_values[sensor_key]
    
    # Variación aleatoria similar al frontend
    drift = (random.random() - 0.49) * 28
    next_val = current + drift
    
    # Mantener dentro de los límites
    if next_val < config["min"]:
        next_val = config["min"] + random.random() * 30
    if next_val > config["max"]:
        next_val = config["max"] - random.random() * 30
    
    # Ocasionalmente saltar a un valor aleatorio (4% de probabilidad)
    if random.random() < 0.04:
        next_val = config["min"] + random.random() * (config["max"] - config["min"])
    
    # Actualizar estado actual
    current_values[sensor_key] = round(next_val, 2)
    
    return current_values[sensor_key]

def insert_sensor_reading(db: Session = None) -> SensorReading | None:
    """
    Inserta una lectura de sensores para el dispositivo simulado.
    
    Args:
        db: Sesión de base de datos (opcional, se crea una si no se proporciona)
    
    Returns:
        SensorReading | None: La lectura creada o None si hay error
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    
    try:
        # Obtener dispositivo simulado
        device = get_simulated_device(db)
        if not device:
            print("Error: Dispositivo simulado no encontrado")
            return None
        
        # Generar valores simulados
        reading = SensorReading(
            dispositivo_id=device.id,
            mq2=next_value("mq2"),
            mq4=next_value("mq4"),
            mq7=next_value("mq7"),
            temperatura=next_value("temperatura"),
            humedad=next_value("humedad"),
            created_at=datetime.utcnow()
        )
        
        db.add(reading)
        db.commit()
        db.refresh(reading)
        
        print(f"Lectura insertada: MQ2={reading.mq2:.1f}, MQ4={reading.mq4:.1f}, MQ7={reading.mq7:.1f}, "
              f"Temp={reading.temperatura:.1f}°C, Hum={reading.humedad:.1f}%")
        
        return reading
        
    except Exception as e:
        db.rollback()
        print(f"Error al insertar lectura: {e}")
        return None
    finally:
        if close_db:
            db.close()

def insert_multiple_readings(count: int = 30, interval_seconds: int = 2) -> list[SensorReading]:
    """
    Inserta múltiples lecturas simuladas con un intervalo de tiempo.
    Útil para generar historial inicial de datos.
    
    Args:
        count: Número de lecturas a insertar
        interval_seconds: Intervalo en segundos entre lecturas
    
    Returns:
        list[SensorReading]: Lista de lecturas creadas
    """
    import time
    
    readings = []
    print(f"Insertando {count} lecturas con intervalo de {interval_seconds}s...")
    
    for i in range(count):
        reading = insert_sensor_reading()
        if reading:
            readings.append(reading)
        
        if i < count - 1:  # No esperar después de la última lectura
            time.sleep(interval_seconds)
    
    print(f"Completado: {len(readings)} lecturas insertadas")
    return readings

if __name__ == "__main__":
    # Ejecutar prueba: insertar 5 lecturas
    print("Prueba de servicio de sensores simulados...")
    readings = insert_multiple_readings(count=5, interval_seconds=1)
    print(f"Lecturas creadas: {len(readings)}")
