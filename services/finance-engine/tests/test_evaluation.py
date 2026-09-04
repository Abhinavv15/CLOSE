"""Test Suite for Ground-Truth Evaluation Engine (Branch 8).

Tests Sections 16, 31, 32, 35, 39, 40, 41:
- Ground-truth benchmark calculations
- Precision, Recall, F1 Score
- Auto-Resolution Precision & False Resolution Rate
- Honest Unresolved Breakdown ("What CLOSE Could Not Resolve")
- API endpoints & audit logging
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.reconciliation_engine import ReconciliationEngine
from app.services.evaluation_engine import EvaluationEngine
from app.models import EvaluationRun, AuditLog

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_eval_test_env():
    """Ensure database has seeded demo records and completed reconciliation batch."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
        engine = ReconciliationEngine()
        engine.run_reconciliation(db, batch_id="batch_close_2026_09")
    finally:
        db.close()


def test_evaluation_engine_metrics():
    """Verify EvaluationEngine calculates real precision, recall, and false resolution rate (Section 39)."""
    eval_engine = EvaluationEngine()
    db = SessionLocal()
    try:
        eval_run = eval_engine.run_evaluation(db, batch_id="batch_close_2026_09")

        assert eval_run is not None
        assert eval_run.batch_id == "batch_close_2026_09"
        assert eval_run.records_processed >= 120

        # Section 39 Institutional Safety Standards
        assert eval_run.precision >= 0.90, f"Expected Precision >= 90%, got {eval_run.precision}"
        assert eval_run.recall >= 0.90, f"Expected Recall >= 90%, got {eval_run.recall}"
        assert eval_run.f1_score >= 0.90
        assert eval_run.auto_resolution_precision >= 0.95
        assert eval_run.false_resolution_rate <= 0.05
        assert eval_run.average_processing_time_seconds < 2.0

        # Honest breakdown structure (Section 41)
        breakdown = eval_run.honest_breakdown_json
        assert "total_unresolved" in breakdown
        assert breakdown["total_unresolved"] >= 1
        assert "missing_source_records" in breakdown
        assert "ambiguous_transactions" in breakdown
        assert "suspected_duplicates" in breakdown
        assert "exceptions" in breakdown
        assert len(breakdown["exceptions"]) >= 1
    finally:
        db.close()


def test_post_run_evaluation_api():
    """Verify POST /api/evaluation/run executes benchmark and returns scorecard (Section 35)."""
    payload = {"batch_id": "batch_close_2026_09"}
    response = client.post("/api/evaluation/run", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert data["id"].startswith("eval_")
    assert data["batch_id"] == "batch_close_2026_09"
    assert "precision" in data
    assert "recall" in data
    assert "f1_score" in data
    assert "honest_breakdown" in data


def test_get_latest_evaluation_api():
    """Verify GET /api/evaluation returns latest evaluation scorecard."""
    response = client.get("/api/evaluation")
    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert data["precision"] >= 0.90
    assert data["recall"] >= 0.90
    assert "honest_breakdown" in data


def test_get_evaluation_detail_and_results_api():
    """Verify GET /api/evaluation/{id} and /api/evaluation/{id}/results (Section 41)."""
    # First get latest eval id
    latest_resp = client.get("/api/evaluation")
    eval_id = latest_resp.json()["id"]

    # Test detail
    detail_resp = client.get(f"/api/evaluation/{eval_id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert detail_data["id"] == eval_id
    assert "auto_resolution_precision" in detail_data

    # Test results
    results_resp = client.get(f"/api/evaluation/{eval_id}/results")
    assert results_resp.status_code == 200
    results_data = results_resp.json()
    assert "metrics" in results_data
    assert "confusion" in results_data
    assert "honest_breakdown" in results_data
    assert results_data["confusion"]["records_processed"] >= 120


def test_evaluation_audit_log():
    """Verify evaluation run appends immutable AuditLog record (Section 30)."""
    db = SessionLocal()
    try:
        audit = (
            db.query(AuditLog)
            .filter_by(action="EVALUATION_RUN_COMPLETED")
            .order_by(AuditLog.timestamp.desc())
            .first()
        )
        assert audit is not None
        assert audit.actor == "Evaluation Benchmark Engine"
        assert audit.entity_type == "EVALUATION_RUN"
        assert "precision" in audit.details_json
    finally:
        db.close()
