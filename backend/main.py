from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from database.session import SessionLocal
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.devices import router as devices_router
from services.auth_service import ensure_default_admin

import models.user
import models.device
import models.user_device
import models.sensor_reading
import models.alert
from models.password_reset import PasswordReset

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.on_event("startup")
def seed_default_admin():
    db = SessionLocal()
    try:
        ensure_default_admin(db)
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(devices_router)

@app.get("/")
def root():
    return {"message": "Backend working"}