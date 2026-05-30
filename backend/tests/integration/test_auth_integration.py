from fastapi.testclient import TestClient
from main import app
from database.db import SessionLocal
from models.user import User

client = TestClient(app)
TEST_EMAIL = "integration_test@example.com"


def cleanup_test_user():
    with SessionLocal() as db:
        db.query(User).filter(User.correo == TEST_EMAIL).delete()
        db.commit()


def setup_module(module):
    cleanup_test_user()


def teardown_module(module):
    cleanup_test_user()


def test_register_and_login_flow():
    cleanup_test_user()

    register_payload = {
        "nombres": "Test",
        "apellidos": "Usuario",
        "telefono": "3001234567",
        "correo": TEST_EMAIL,
        "password": "Abc12345!",
    }

    register_response = client.post("/auth/register", json=register_payload)
    assert register_response.status_code == 200
    assert register_response.json()["correo"] == TEST_EMAIL

    login_payload = {
        "correo": TEST_EMAIL,
        "password": "Abc12345!",
    }

    login_response = client.post("/auth/login", json=login_payload)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    assert login_response.json()["token_type"] == "bearer"
