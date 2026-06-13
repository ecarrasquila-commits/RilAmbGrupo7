import os

from sqlalchemy.orm import Session

from models.user import User
from models.enums import UserRole

from schemas.user_schema import UserCreate

from utils.security import (
    hash_password,
    verify_password
)

from utils.jwt_handler import create_access_token

DEFAULT_ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@rilamb.xyz")
DEFAULT_ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Rilamb2005.")
DEFAULT_ADMIN_NAME = os.getenv("ADMIN_NAME", "Administrador")
DEFAULT_ADMIN_LASTNAME = os.getenv("ADMIN_LASTNAME", "Sistema")
DEFAULT_ADMIN_PHONE = os.getenv("ADMIN_PHONE", "0000000000")


def ensure_default_admin(db: Session):
    admin_user = db.query(User).filter(
        User.correo == DEFAULT_ADMIN_EMAIL
    ).first()

    admin_password_hash = hash_password(DEFAULT_ADMIN_PASSWORD)

    if admin_user:
        admin_user.nombre = DEFAULT_ADMIN_NAME
        admin_user.apellido = DEFAULT_ADMIN_LASTNAME
        admin_user.telefono = DEFAULT_ADMIN_PHONE
        admin_user.password_hash = admin_password_hash
        admin_user.rol = UserRole.admin
        admin_user.is_active = True
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        return admin_user

    admin_user = User(
        cedula="1",
        nombre=DEFAULT_ADMIN_NAME,
        apellido=DEFAULT_ADMIN_LASTNAME,
        telefono=DEFAULT_ADMIN_PHONE,
        correo=DEFAULT_ADMIN_EMAIL,
        password_hash=admin_password_hash,
        rol=UserRole.admin,
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    return admin_user

def create_user(
    db: Session,
    user_data: UserCreate
):

    existing_user = db.query(User).filter(
        User.correo == user_data.correo
    ).first()

    if existing_user:
        return None

    existing_cedula = db.query(User).filter(
        User.cedula == user_data.cedula
    ).first()

    if existing_cedula:
        raise ValueError("Cédula ya registrada")

    user = User(
        cedula=user_data.cedula,
        nombre=user_data.nombre,
        apellido=user_data.apellido,
        telefono=user_data.telefono,
        correo=user_data.correo,
        password_hash=hash_password(
            user_data.password
        )
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user


def login_user(
    db: Session,
    correo: str,
    password: str
):

    user = db.query(User).filter(
        User.correo == correo
    ).first()

    if not user:
        return None

    valid_password = verify_password(
        password,
        user.password_hash
    )

    if not valid_password:
        return None

    token = create_access_token({
        "sub": user.correo,
        "correo": user.correo,
        "rol": user.rol.value
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user.rol.value
    }


def delete_user_by_email(
    db: Session,
    correo: str
):
    user = db.query(User).filter(
        User.correo == correo
    ).first()

    if not user:
        return False

    db.delete(user)
    db.commit()

    return True