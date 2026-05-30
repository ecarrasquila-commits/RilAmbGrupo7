import uuid

from sqlalchemy import Column, String, TIMESTAMP, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database.db import Base
from models.enums import DeviceStatus

class Device(Base):
    __tablename__ = "dispositivos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    mac_address = Column(String, unique=True, nullable=False)

    pairing_code = Column(String, nullable=False)

    pairing_expires_at = Column(TIMESTAMP(timezone=True))

    api_key_hash = Column(String)

    firmware_version = Column(String)

    estado = Column(
        Enum(DeviceStatus),
        default=DeviceStatus.offline
    )

    last_seen = Column(TIMESTAMP(timezone=True))

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )