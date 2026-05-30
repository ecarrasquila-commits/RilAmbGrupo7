from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from database.session import get_db

from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse
)

from services.auth_service import (
    create_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

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
