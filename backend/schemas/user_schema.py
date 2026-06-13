from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    cedula: str
    nombre: str
    apellido: str
    telefono: str
    correo: EmailStr
    password: str

class UserLogin(BaseModel):
    correo: EmailStr
    password: str

class UserUpdate(BaseModel):
    nombre: str
    apellido: str
    telefono: str
    correo: EmailStr

class UserResponse(BaseModel):
    cedula: str
    nombre: str
    apellido: str
    telefono: str
    correo: EmailStr
    rol: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True