import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_audit_logs():
    response = client.get("/api/audit/logs")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "chain_intact" in data
    assert data["chain_intact"] is True
    assert "logs" in data
    assert isinstance(data["logs"], list)

def test_verify_hash_chain():
    response = client.get("/api/audit/verify-chain")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED"
    assert "root_chain_hash" in data
    assert data["integrity"] == "CRYPTOGRAPHICALLY_SOUND"

def test_export_audit_logs_csv():
    response = client.get("/api/audit/export")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "Log_ID,Timestamp,Actor,Action" in response.text
