import pytest
from decimal import Decimal
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.reconciliation_engine import ReconciliationEngine
from app.models import ExceptionRecord, AuditLog

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_exception_test_env():
    """Ensure database has seeded demo records and completed reconciliation pass."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
        engine = ReconciliationEngine()
        engine.run_reconciliation(db, batch_id="batch_close_2026_09")
    finally:
        db.close()


def test_list_exceptions_and_counts():
    """Verify GET /api/exceptions returns filtered list and category counts (Section 25)."""
    response = client.get("/api/exceptions")
    assert response.status_code == 200
    data = response.json()

    assert "counts" in data
    assert data["counts"]["total"] >= 1
    assert data["counts"]["review"] >= 1
    assert len(data["exceptions"]) >= 1

    sample = data["exceptions"][0]
    assert "id" in sample
    assert "type" in sample
    assert "amount" in sample
    assert "difference" in sample
    assert "confidence" in sample
    assert "status" in sample


def test_get_exception_detail_and_evidence():
    """Verify GET /api/exceptions/{id} returns expected vs actual and 3-tier evidence (Section 26 & 28)."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).filter_by(type="AMOUNT_MISMATCH").first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    response = client.get(f"/api/exceptions/{ex_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["exception_id"] == ex_id
    assert "amounts" in data
    assert data["amounts"]["expected"] == float(ex.amount)
    assert data["amounts"]["difference"] == float(ex.difference)
    assert "evidence" in data
    assert len(data["evidence"]) >= 1


def test_human_approval_workflow():
    """Section 29 & 30: Verify human approval updates status and records audit event."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).filter_by(status="REVIEW").first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    # Approve exception
    approval_payload = {
        "user": "Controller Abhinav",
        "note": "Verified against Stripe payout #5521. Approved as gateway fee.",
    }
    response = client.post(f"/api/exceptions/{ex_id}/approve", json=approval_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "APPROVED"

    # Verify database persistence
    db = SessionLocal()
    try:
        updated_ex = db.query(ExceptionRecord).filter_by(id=ex_id).first()
        assert updated_ex.status == "APPROVED"
        assert updated_ex.resolved_by == "Controller Abhinav"

        # Verify audit log entry
        audit = db.query(AuditLog).filter_by(
            entity_id=ex_id, action="HUMAN_APPROVAL_RECORDED"
        ).first()
        assert audit is not None
        assert audit.actor == "Controller Abhinav"
        assert audit.status == "VERIFIED"
    finally:
        db.close()


def test_human_rejection_workflow():
    """Section 29: Verify human rejection workflow."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).filter_by(status="REVIEW").first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    payload = {
        "user": "Controller Abhinav",
        "note": "Rejected. Gateway statement contradicts fee percentage.",
    }
    response = client.post(f"/api/exceptions/{ex_id}/reject", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "REJECTED"


def test_mark_unresolved_workflow():
    """Section 29: Verify mark unresolved workflow."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    payload = {
        "user": "Senior Auditor",
        "note": "Escalated for offline bank clarification.",
    }
    response = client.post(f"/api/exceptions/{ex_id}/unresolve", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "UNRESOLVED"


def test_get_exception_audit_trail():
    """Section 30: Verify audit trail retrieval for an exception."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    response = client.get(f"/api/exceptions/{ex_id}/audit")
    assert response.status_code == 200
    data = response.json()
    assert data["exception_id"] == ex_id
    assert "events" in data
    assert isinstance(data["events"], list)
