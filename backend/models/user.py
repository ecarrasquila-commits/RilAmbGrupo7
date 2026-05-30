import uuid

from sqlalchemy import Column, String, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import Enum

from database.db import Base
from models.enums import UserRole

class User(Base):
    __tablename__ = "usuarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    nombre = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(20))

    correo = Column(String, unique=True, nullable=False)

    password_hash = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    rol = Column(
        Enum(UserRole),
        default=UserRole.user,
        nullable=False
    )