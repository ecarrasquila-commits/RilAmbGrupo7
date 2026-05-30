from sqlalchemy import Column, Float, TIMESTAMP, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database.db import Base

class SensorReading(Base):
    __tablename__ = "lecturas_sensores"

    id = Column(BigInteger, primary_key=True, index=True)

    dispositivo_id = Column(
        UUID(as_uuid=True),
        ForeignKey("dispositivos.id"),
        nullable=False
    )

    mq2 = Column(Float)
    mq4 = Column(Float)
    mq7 = Column(Float)

    temperatura = Column(Float)

    humedad = Column(Float)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )