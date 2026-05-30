from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from routes.auth import router as auth_router

import models.user
import models.device
import models.user_device
import models.sensor_reading
import models.alert

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Backend working"}