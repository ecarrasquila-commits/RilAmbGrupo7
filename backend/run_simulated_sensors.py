"""
Script para ejecutar el servicio de sensores simulados continuamente.
Inserta datos de sensores cada 2 segundos.
"""

import time
from services.simulated_sensor_service import insert_sensor_reading

print("Iniciando servicio de sensores simulados...")
print("Insertando datos cada 2 segundos. Presiona Ctrl+C para detener.")

try:
    while True:
        reading = insert_sensor_reading()
        if reading:
            print(f"✓ Datos insertados: MQ2={reading.mq2:.1f}, MQ4={reading.mq4:.1f}, MQ7={reading.mq7:.1f}")
        time.sleep(2)
except KeyboardInterrupt:
    print("\nServicio detenido por el usuario.")
