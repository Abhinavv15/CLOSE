import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.database import SessionLocal
from app.models.entity import User, Company

client = TestClient(app)


def test_password_hashing_and_verification():
    """Verify bcrypt salt hashing and password checking."""
    password = "SuperSecretPassword123!"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_creation_and_decoding():
    """Verify JWT access token generation and cryptographic payload decoding."""
    data = {"sub": "usr_test_123", "email": "test@domain.com", "role": "CONTROLLER"}
    token = create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 20

    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "usr_test_123"
    assert payload["email"] == "test@domain.com"
    assert payload["role"] == "CONTROLLER"
    assert "exp" in payload


def test_real_login_and_me_bearer_flow():
    """Test end-to-end login with credentials and /api/auth/me with Bearer token."""
    # 1. Successful Controller login
    res = client.post("/api/auth/login", json={
        "email": "abhinav@democorp.internal",
        "password": "Abhinav@2026!"
    })
    assert res.status_code == 200
    body = res.json()
    assert "token" in body
    assert body["user"]["name"] == "Abhinav V"
    assert body["user"]["role"] == "CONTROLLER"
    token = body["token"]

    # 2. Access /api/auth/me using Bearer token header
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["name"] == "Abhinav V"
    assert me_data["email"] == "abhinav@democorp.internal"
    assert "reconciliation:run" in me_data["permissions"]

    # 3. Invalid credentials rejection
    fail_res = client.post("/api/auth/login", json={
        "email": "abhinav@democorp.internal",
        "password": "InvalidPassword123!"
    })
    assert fail_res.status_code == 401
