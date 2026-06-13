import os
from fastapi_mail import ConnectionConfig, MessageSchema, MessageType
from pydantic import EmailStr

PROJECT_NAME = os.getenv("PROJECT_NAME", "RilAmb")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.example.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "user@example.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "password")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
RESET_CODE_EXPIRES_MINUTES = int(os.getenv("RESET_CODE_EXPIRES_MINUTES", "10"))

conf = ConnectionConfig(
    MAIL_USERNAME=SMTP_USER,
    MAIL_PASSWORD=SMTP_PASSWORD,
    MAIL_FROM=SMTP_FROM,
    MAIL_SERVER=SMTP_HOST,
    MAIL_PORT=SMTP_PORT,
    MAIL_SSL_TLS=SMTP_PORT == 465,
    MAIL_STARTTLS=SMTP_PORT == 587,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,  # Desactivar verificación de certificados para desarrollo con certificados autofirmados
)


def _build_reset_message(email: str, code: str) -> MessageSchema:
    body = (
        f"Hola,\n\n"
        f"Has solicitado recuperar tu contraseña en {PROJECT_NAME}.\n\n"
        f"Tu código de verificación es:\n\n"
        f"{code}\n\n"
        f"Este código expirará en {RESET_CODE_EXPIRES_MINUTES} minutos.\n\n"
        f"Nunca compartas este código con nadie. Si no realizaste esta solicitud, ignora este mensaje.\n\n"
        f"Saludos,\n"
        f"El equipo de {PROJECT_NAME}"
    )

    message = MessageSchema(
        subject=f"{PROJECT_NAME} - Código de recuperación",
        recipients=[email],
        body=body,
        subtype=MessageType.plain
    )
    return message


async def send_reset_email(email: str, code: str):
    """Enviar un correo de recuperación con el código OTP usando FastAPI-Mail.

    Requiere configuración SMTP en variables de entorno:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD y SMTP_FROM.
    """
    from fastapi_mail import FastMail

    message = _build_reset_message(email, code)
    fm = FastMail(conf)
    await fm.send_message(message)
