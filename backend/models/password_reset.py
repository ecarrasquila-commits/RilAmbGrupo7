import uuid

from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database.db import Base
from utils.security import hash_password


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    usuario_id = Column(
        String(20),
        ForeignKey("usuarios.cedula"),
        nullable=False
    )

    code_hash = Column(String, nullable=False)

    is_used = Column(Boolean, default=False, nullable=False)

    expires_at = Column(TIMESTAMP(timezone=True), nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    @classmethod
    def create(cls, usuario_id, code, expires_at):
        return cls(
            usuario_id=usuario_id,
            code_hash=hash_password(code),
            expires_at=expires_at
        )
