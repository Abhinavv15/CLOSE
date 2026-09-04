import pytest
from decimal import Decimal
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.reconciliation_engine import ReconciliationEngine
from app.services.ai_tools import ControllerTools
from app.services.ai_controller import AIControllerService
from app.models import ExceptionRecord, AuditLog
from app.schemas.contracts import ExceptionInvestigationResponse

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_ai_test_environment():
    """Ensure database has seeded demo records and completed reconciliation pass."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
        engine = ReconciliationEngine()
        engine.run_reconciliation(db, batch_id="batch_close_2026_09")
    finally:
        db.close()


def test_controller_tools():
    """Verify deterministic tools callable by the AI agent (Section 21)."""
    db = SessionLocal()
    try:
        # 1. Search bank transactions
        bank_results = ControllerTools.search_bank_transactions(db, amount=Decimal("72400.0000"))
        assert len(bank_results) >= 1
        assert bank_results[0]["amount"] == 72400.0

        # 2. Search processor settlements
        proc_results = ControllerTools.search_processor_transactions(db, reference="STRIPE-82931")
        assert len(proc_results) >= 1
        assert proc_results[0]["fee"] == 50.0

        # 3. Calculate difference
        diff_calc = ControllerTools.calculate_difference(Decimal("31800.0000"), Decimal("31750.0000"))
        assert diff_calc["difference"] == 50.0
    finally:
        db.close()


def test_ai_investigation_processor_fee():
    """Section 23 & 27: Verify AI investigation of fee discrepancy returns structured Pydantic schema."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).filter_by(type="AMOUNT_MISMATCH").first()
        assert ex is not None

        service = AIControllerService()
        response = service.investigate_exception(db, exception_id=ex.id)

        # 1. Verify schema type
        assert isinstance(response, ExceptionInvestigationResponse)
        assert response.exception_id == ex.id
        assert response.classification == "PROCESSOR_FEE"
        assert response.confidence == 0.94
        assert response.status == "REVIEW"
        assert "processor fee" in response.recommended_action.lower()

        # 2. Verify evidence citations (Section 28)
        assert len(response.evidence) >= 2
        evidence_types = [e.type for e in response.evidence]
        assert "processor_transaction" in evidence_types
        assert "bank_transaction" in evidence_types

        # 3. Verify audit log creation (Section 30)
        audit_entry = db.query(AuditLog).filter_by(
            entity_id=ex.id, action="RECOMMENDATION_GENERATED"
        ).first()
        assert audit_entry is not None
        assert audit_entry.actor == "AI Controller Agent"
        assert audit_entry.confidence == "94%"
    finally:
        db.close()


def test_ai_investigation_unresolved_honesty():
    """Section 1, 28, 45: Verify AI explicitly refuses to decide without evidence."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).filter_by(status="UNRESOLVED").first()
        assert ex is not None

        service = AIControllerService()
        response = service.investigate_exception(db, exception_id=ex.id)

        # Verification of honest escalation
        assert response.status == "UNRESOLVED"
        assert response.confidence <= 0.60
        assert "unable to resolve" in response.recommended_action.lower()
        assert "human review required" in response.recommended_action.lower()
    finally:
        db.close()


def test_ai_investigation_api_endpoint():
    """Verify POST /api/exceptions/{id}/investigate endpoint."""
    db = SessionLocal()
    try:
        ex = db.query(ExceptionRecord).first()
        assert ex is not None
        ex_id = ex.id
    finally:
        db.close()

    res = client.post(f"/api/exceptions/{ex_id}/investigate")
    assert res.status_code == 200
    data = res.json()
    assert data["exception_id"] == ex_id
    assert "classification" in data
    assert "confidence" in data
    assert "evidence" in data
    assert "recommended_action" in data
