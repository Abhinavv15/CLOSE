import time
import pytest
from decimal import Decimal
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.reconciliation_engine import ReconciliationEngine
from app.models import ReconciliationBatch, ReconciliationMatch, ExceptionRecord

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_reconciliation_data():
    """Ensure database has 127 demo records loaded."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
    finally:
        db.close()


def test_reconciliation_execution_and_speed():
    """Verify reconciliation runs in < 1.5s for 127 records (Sections 39 & 61)."""
    db = SessionLocal()
    try:
        engine = ReconciliationEngine()
        start_time = time.time()
        result = engine.run_reconciliation(db, batch_id="batch_close_2026_09")
        elapsed = time.time() - start_time

        # Performance verification
        assert elapsed < 1.5, f"Reconciliation took {elapsed:.2f}s, expected < 1.5s"

        # Verification of results structure
        assert result["status"] == "COMPLETED"
        assert result["records_processed"] == 127
        assert result["matched"] >= 110
        assert result["match_rate"] >= 0.90
        assert result["unresolved"] >= 1
    finally:
        db.close()


def test_processor_fee_anomaly_detection():
    """Verify EX-102 (₹50 fee difference) is accurately categorized."""
    db = SessionLocal()
    try:
        fee_match = db.query(ReconciliationMatch).filter(
            ReconciliationMatch.difference == Decimal("50.0000")
        ).first()

        assert fee_match is not None
        assert fee_match.method == "AI"
        assert fee_match.confidence == 0.94
        assert fee_match.status == "REVIEW"

        # Check linked exception record
        ex = db.query(ExceptionRecord).filter_by(type="AMOUNT_MISMATCH").first()
        assert ex is not None
        assert ex.difference == Decimal("50.0000")
        assert ex.ai_classification == "PROCESSOR_FEE"
        assert len(ex.evidence) >= 2
    finally:
        db.close()


def test_duplicate_anomaly_detection():
    """Verify EX-111 (duplicate transaction) is accurately detected."""
    db = SessionLocal()
    try:
        dup_ex = db.query(ExceptionRecord).filter_by(type="DUPLICATE").first()
        assert dup_ex is not None
        assert dup_ex.confidence == 0.97
        assert dup_ex.status == "REVIEW"
        assert "duplicate" in dup_ex.ai_explanation.lower()
    finally:
        db.close()


def test_unresolved_missing_record_detection():
    """Verify EX-108 (unbacked transaction) is honestly escalated as UNRESOLVED."""
    db = SessionLocal()
    try:
        unresolved_match = db.query(ReconciliationMatch).filter_by(status="UNRESOLVED").first()
        assert unresolved_match is not None
        assert unresolved_match.method == "HUMAN"
        assert unresolved_match.confidence <= 0.60

        unresolved_ex = db.query(ExceptionRecord).filter_by(status="UNRESOLVED").first()
        assert unresolved_ex is not None
        assert "unable to resolve" in unresolved_ex.ai_recommended_action.lower()
    finally:
        db.close()


def test_reconciliation_api_endpoints():
    """Verify FastAPI reconciliation endpoints."""
    # 1. Run reconciliation
    res_run = client.post("/api/reconciliation/run?batch_id=batch_close_2026_09")
    assert res_run.status_code == 200
    data_run = res_run.json()
    assert data_run["success"] is True
    assert data_run["data"]["records_processed"] == 127

    # 2. Get batch summary
    res_summary = client.get("/api/reconciliation/batch_close_2026_09")
    assert res_summary.status_code == 200
    data_summary = res_summary.json()
    assert data_summary["match_rate"] >= 0.90

    # 3. Get results matrix
    res_results = client.get("/api/reconciliation/batch_close_2026_09/results")
    assert res_results.status_code == 200
    data_results = res_results.json()
    assert data_results["count"] > 100
    sample = data_results["results"][0]
    assert "method" in sample
    assert "confidence" in sample
    assert "difference" in sample
