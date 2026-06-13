from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from database.session import SessionLocal
from models.alert import Alert
from models.device import Device
from models.enums import AlertSeverity
from models.sensor_reading import SensorReading
from models.user_device import UserDevice


def get_target_link(db):
    return db.execute(
        select(UserDevice)
        .where(UserDevice.is_active == True)
        .order_by(UserDevice.linked_at.asc())
    ).scalars().first()


def make_timestamp(days_ago: int, hour: int, minute: int = 0) -> datetime:
    base_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    return base_day - timedelta(days=days_ago) + timedelta(hours=hour, minutes=minute)


def build_reading_values(days_ago: int, slot: int) -> dict[str, float]:
    cycle = days_ago % 7
    trend = (6 - cycle) * 5
    spike = 18 if days_ago in {4, 11} else 0
    slot_offset = 6 if slot == 1 else 0

    return {
        "mq2": round(138 + trend + spike + slot_offset + cycle * 2.5, 2),
        "mq4": round(198 + trend * 0.9 + spike * 0.8 + slot_offset * 0.8 + cycle * 3.2, 2),
        "mq7": round(112 + trend * 0.75 + spike * 0.6 + slot_offset * 0.6 + cycle * 2.1, 2),
        "temperatura": round(22.4 + (cycle % 4) * 0.45 + slot * 0.35, 2),
        "humedad": round(48.0 + (cycle % 5) * 1.8 + slot * 1.4, 2),
    }


def seed_report_history() -> None:
    db = SessionLocal()
    try:
        target_link = get_target_link(db)
        if not target_link:
            print("No se encontró un dispositivo activo vinculado. No se insertaron datos.")
            return

        device_id = target_link.dispositivo_id
        alias = target_link.alias or "Dispositivo vinculado"

        db.query(SensorReading).filter(SensorReading.dispositivo_id == device_id).delete(synchronize_session=False)
        db.query(Alert).filter(Alert.dispositivo_id == device_id).delete(synchronize_session=False)
        db.commit()

        readings_inserted = 0
        for days_ago in range(14, 0, -1):
            morning_values = build_reading_values(days_ago, 0)
            evening_values = build_reading_values(days_ago, 1)

            db.add(
                SensorReading(
                    dispositivo_id=device_id,
                    created_at=make_timestamp(days_ago, 9, 30),
                    **morning_values,
                )
            )
            db.add(
                SensorReading(
                    dispositivo_id=device_id,
                    created_at=make_timestamp(days_ago, 17, 45),
                    **evening_values,
                )
            )
            readings_inserted += 2

        alert_plan = [
            (13, 11, "Gases elevados", AlertSeverity.medium, 262.0),
            (12, 10, "Humo detectado", AlertSeverity.high, 298.0),
            (12, 16, "Pico de gas", AlertSeverity.medium, 271.0),
            (11, 9, "Ventilación requerida", AlertSeverity.high, 315.0),
            (11, 15, "Pico adicional", AlertSeverity.medium, 284.0),
            (10, 14, "Lectura fuera de rango", AlertSeverity.low, 241.0),
            (9, 13, "Temperatura elevada", AlertSeverity.medium, 252.0),
            (8, 18, "Monitoreo preventivo", AlertSeverity.low, 230.0),
            (4, 8, "Alerta crítica", AlertSeverity.critical, 336.0),
            (1, 12, "Seguimiento de riesgo", AlertSeverity.medium, 279.0),
        ]

        alerts_inserted = 0
        for days_ago, hour, tipo, severity, value in alert_plan:
            db.add(
                Alert(
                    dispositivo_id=device_id,
                    tipo=tipo,
                    severidad=severity,
                    mensaje=f"{tipo} para {alias}",
                    valor_detectado=value,
                    is_read=False,
                    created_at=make_timestamp(days_ago, hour, 0),
                )
            )
            alerts_inserted += 1

        db.commit()
        print(f"Historico generado para '{alias}' ({device_id})")
        print(f"Lecturas insertadas: {readings_inserted}")
        print(f"Alertas insertadas: {alerts_inserted}")
        print("Distribucion de alertas: martes = 3, total = 10")
    except Exception as exc:
        db.rollback()
        print(f"Error al generar el historico: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_report_history()