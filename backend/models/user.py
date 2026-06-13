from sqlalchemy import Column, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy import Enum

from database.db import Base
from models.enums import UserRole

class User(Base):
    __tablename__ = "usuarios"

    cedula = Column(String(20), primary_key=True, nullable=False)

    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
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