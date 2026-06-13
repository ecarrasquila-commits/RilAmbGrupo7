from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    correo: EmailStr


class VerifyCodeRequest(BaseModel):
    correo: EmailStr
    code: str


class ResetPasswordRequest(BaseModel):
    correo: EmailStr
    code: str
    new_password: str
