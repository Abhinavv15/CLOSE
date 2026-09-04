"""AI Agent Schema Validation, Malformed Contract Defense & Guardrail Tests (Section 58)."""

import pytest
from pydantic import ValidationError
from datetime import datetime, timezone
from decimal import Decimal
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.ai_controller import AIControllerService
from app.schemas.contracts import ExceptionInvestigationResponse, EvidenceItem
from app.models import ExceptionRecord

@pytest.fixture(scope="module", autouse=True)
def ensure_db():
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
    finally:
        db.close()

def test_valid_evidence_item_schema():
    """Ensure EvidenceItem accepts valid supported financial sources."""
    item = EvidenceItem(
        type="bank_transaction",
        id="bt_123",
        description="Stripe payout settlement",
        amount=Decimal("31750.00"),
        date="2026-09-04"
    )
    assert item.type == "bank_transaction"
    assert item.amount == Decimal("31750.00")

def test_invalid_evidence_source_rejected():
    """Ensure unsupported random sources are rejected by Pydantic literal."""
    with pytest.raises(ValidationError):
        EvidenceItem(
            type="unsupported_crypto_wallet", # Invalid literal
            id="crypto_999",
            amount=Decimal("100.00")
        )

def test_confidence_boundary_validation():
    """Ensure confidence out of [0.0, 1.0] range raises ValidationError."""
    with pytest.raises(ValidationError):
        ExceptionInvestigationResponse(
            exception_id="EX-102",
            classification="PROCESSOR_FEE",
            confidence=1.5, # Out of range
            status="REVIEW",
            explanation="Test",
            recommended_action="Action",
            evidence=[]
        )

def test_ai_controller_fee_variance_investigation():
    """Verify AIControllerService generates high confidence explanation for fee variances."""
    db = SessionLocal()
    try:
        service = AIControllerService(mode="mock")
        # Find EX-102 or any fee variance exception
        ex = db.query(ExceptionRecord).filter(ExceptionRecord.difference == Decimal("50.0000")).first()
        if ex:
            res = service.investigate_exception(db, ex.id)
            assert res.classification == "PROCESSOR_FEE"
            assert res.confidence >= 0.90
            assert "Stripe" in res.explanation or "fee" in res.explanation.lower()
            assert "ledger" in res.recommended_action.lower() or "approve" in res.recommended_action.lower()
    finally:
        db.close()

def test_ai_controller_unresolved_missing_record_honesty():
    """Verify AIControllerService refuses to invent records for missing records."""
    db = SessionLocal()
    try:
        service = AIControllerService(mode="mock")
        ex = db.query(ExceptionRecord).filter(ExceptionRecord.type == "MISSING_RECORD").first()
        if ex:
            res = service.investigate_exception(db, ex.id)
            assert res.status == "UNRESOLVED"
            assert res.confidence <= 0.40
            assert "human" in res.recommended_action.lower()
    finally:
        db.close()
