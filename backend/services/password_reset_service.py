import random
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from models.user import User
from models.password_reset import PasswordReset
from utils.security import hash_password, verify_password
from utils.email_sender import send_reset_email


def generate_reset_code() -> str:
    """Genera un código numérico aleatorio de 6 dígitos."""
    return f"{random.randint(0, 999999):06d}"


def _get_latest_reset(db: Session, user_id):
    return (
        db.query(PasswordReset)
        .filter(PasswordReset.usuario_id == user_id)
        .order_by(PasswordReset.created_at.desc())
        .first()
    )


async def request_password_reset(db: Session, correo: str):
    user = db.query(User).filter(User.correo == correo).first()
    if not user:
        raise ValueError("Usuario no encontrado")

    code = generate_reset_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    password_reset = PasswordReset(
        usuario_id=user.cedula,
        code_hash=hash_password(code),
        expires_at=expires_at
    )

    db.add(password_reset)
    db.commit()
    db.refresh(password_reset)

    try:
        await send_reset_email(user.correo, code)
    except Exception as e:
        # En desarrollo, permitir que el flujo continúe aunque el email falle
        # El código se genera y almacena correctamente
        print(f"Warning: Email sending failed: {e}")

    return {
        "success": True,
        "message": "Código de recuperación generado"
    }


def verify_reset_code(db: Session, correo: str, code: str):
    user = db.query(User).filter(User.correo == correo).first()
    if not user:
        raise ValueError("Usuario no encontrado")

    password_reset = _get_latest_reset(db, user.cedula)
    if not password_reset:
        raise ValueError("No existe una solicitud de recuperación")

    if password_reset.is_used:
        raise ValueError("El código ya fue utilizado")

    if password_reset.expires_at < datetime.now(timezone.utc):
        raise ValueError("El código ha expirado")

    if not verify_password(code, password_reset.code_hash):
        raise ValueError("Código inválido")

    return {
        "success": True,
        "message": "Código válido"
    }


def reset_password(db: Session, correo: str, code: str, new_password: str):
    user = db.query(User).filter(User.correo == correo).first()
    if not user:
        raise ValueError("Usuario no encontrado")

    password_reset = _get_latest_reset(db, user.cedula)
    if not password_reset:
        raise ValueError("No existe una solicitud de recuperación")

    if password_reset.is_used:
        raise ValueError("El código ya fue utilizado")

    if password_reset.expires_at < datetime.now(timezone.utc):
        raise ValueError("El código ha expirado")

    if not verify_password(code, password_reset.code_hash):
        raise ValueError("Código inválido")

    user.password_hash = hash_password(new_password)
    password_reset.is_used = True

    db.add(user)
    db.add(password_reset)
    db.commit()

    return {
        "success": True,
        "message": "Contraseña actualizada correctamente"
    }
