from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "close-finance-engine"
    assert "ai_mode" in data

def test_system_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert "confidence_thresholds" in data

def test_healthz_check():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

