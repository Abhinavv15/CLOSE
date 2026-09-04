import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_personas():
    response = client.get("/api/auth/personas")
    assert response.status_code == 200
    personas = response.json()
    assert len(personas) == 3
    roles = [p["role"] for p in personas]
    assert "CONTROLLER" in roles
    assert "AUDITOR" in roles
    assert "ADMIN" in roles

def test_get_current_user_controller():
    response = client.get("/api/auth/me?persona_key=controller")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "CONTROLLER"
    assert data["name"] == "Abhinav V"
    assert "reconciliation:run" in data["permissions"]

def test_get_current_user_auditor():
    response = client.get("/api/auth/me?persona_key=auditor")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "AUDITOR"
    assert data["name"] == "Sarah Jenkins"
    # Auditor cannot run reconciliation or approve exceptions
    assert "reconciliation:run" not in data["permissions"]
    assert "exceptions:approve" not in data["permissions"]
    assert "audit:view" in data["permissions"]

def test_login_persona():
    response = client.post("/api/auth/login", json={"persona_key": "auditor"})
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["role"] == "AUDITOR"
