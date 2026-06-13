from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class DeviceLinkRequest(BaseModel):
    pairing_code: str
    alias: str | None = None

class DeviceLinkResponse(BaseModel):
    id: UUID
    dispositivo_id: UUID
    usuario_id: str
    alias: str | None
    is_active: bool
    linked_at: datetime
    
    class Config:
        from_attributes = True

class DeviceResponse(BaseModel):
    id: UUID
    mac_address: str
    pairing_code: str
    firmware_version: str | None
    estado: str
    last_seen: datetime | None
    created_at: datetime
    alias: str | None = None
    
    class Config:
        from_attributes = True

class SensorReadingResponse(BaseModel):
    id: int
    dispositivo_id: UUID
    mq2: float | None
    mq4: float | None
    mq7: float | None
    temperatura: float | None
    humedad: float | None
    created_at: datetime
    
    class Config:
        from_attributes = True

class SensorDataResponse(BaseModel):
    has_device: bool
    mq2: float | None
    mq4: float | None
    mq7: float | None
    temperatura: float | None
    humedad: float | None
    timestamp: datetime | None

class ReportSummaryResponse(BaseModel):
    linked_devices_count: int
    total_alerts_count: int
    top_device_label: str | None
    top_device_alerts: int
    top_day_label: str | None
    top_day_alerts: int