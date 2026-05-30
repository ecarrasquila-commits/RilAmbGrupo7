import uuid

from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database.db import Base

class UserDevice(Base):
    __tablename__ = "usuarios_dispositivos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    usuario_id = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id"),
        nullable=False
    )

    dispositivo_id = Column(
        UUID(as_uuid=True),
        ForeignKey("dispositivos.id"),
        nullable=False
    )

    alias = Column(String(100))

    is_active = Column(Boolean, default=True)

    linked_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    unlinked_at = Column(TIMESTAMP(timezone=True))