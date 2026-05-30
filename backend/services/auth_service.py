from sqlalchemy.orm import Session

from models.user import User

from schemas.user_schema import UserCreate

from utils.security import (
    hash_password,
    verify_password
)

from utils.jwt_handler import create_access_token

def create_user(
    db: Session,
    user_data: UserCreate
):

    existing_user = db.query(User).filter(
        User.correo == user_data.correo
    ).first()

    if existing_user:
        return None

    user = User(
        nombre=user_data.nombres,
        apellidos=user_data.apellidos,
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
        "sub": str(user.id),
        "correo": user.correo
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }