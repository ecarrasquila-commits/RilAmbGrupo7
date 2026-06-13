from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from models.enums import UserRole
from database.session import get_db
from utils.jwt_handler import verify_token

from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse
)
from schemas.auth_schema import (
    ForgotPasswordRequest,
    VerifyCodeRequest,
    ResetPasswordRequest
)

from services.auth_service import (
    create_user,
    login_user,
    delete_user_by_email
)
from services.password_reset_service import (
    request_password_reset,
    verify_reset_code,
    reset_password
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


def get_token_from_header(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Formato de token inválido. Use: Bearer <token>"
        )
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    return payload

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    try:
        created_user = create_user(
            db,
            user
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    if not created_user:
        raise HTTPException(
            status_code=400,
            detail="Correo ya registrado"
        )

    return created_user


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    result = login_user(
        db,
        user.correo,
        user.password
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    return result


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        result = await request_password_reset(
            db,
            request.correo
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    return result


@router.post("/verify-reset-code")
def verify_reset_code_route(
    request: VerifyCodeRequest,
    db: Session = Depends(get_db)
):
    try:
        result = verify_reset_code(
            db,
            request.correo,
            request.code
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    return result


@router.post("/reset-password")
def reset_password_route(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        result = reset_password(
            db,
            request.correo,
            request.code,
            request.new_password
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    return result


@router.delete("/delete/{correo}")
def delete_user(
    correo: str,
    db: Session = Depends(get_db),
    token_payload: dict = Depends(get_token_from_header)
):
    if token_payload.get("rol") != UserRole.admin.value:
        raise HTTPException(
            status_code=403,
            detail="No autorizado"
        )

    deleted = delete_user_by_email(db, correo)
    
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    return {"message": "Usuario eliminado"}
