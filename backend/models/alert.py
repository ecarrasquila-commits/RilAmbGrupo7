import uuid

from sqlalchemy import Column, String, Boolean, Float
from sqlalchemy import TIMESTAMP, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database.db import Base
from models.enums import AlertSeverity

class Alert(Base):
    __tablename__ = "alertas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    dispositivo_id = Column(
        UUID(as_uuid=True),
        ForeignKey("dispositivos.id"),
        nullable=False
    )

    tipo = Column(String, nullable=False)

    severidad = Column(
        Enum(AlertSeverity),
        nullable=False
    )

    mensaje = Column(String)

    valor_detectado = Column(Float)

    is_read = Column(Boolean, default=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )