from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    nombres: str
    apellidos: str
    telefono: str
    correo: EmailStr
    password: str

class UserLogin(BaseModel):
    correo: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    nombre: str
    apellidos: str
    telefono: str
    correo: EmailStr
    rol: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True