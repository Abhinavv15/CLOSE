"""Comprehensive Edge Case Testing Suite for Reconciliation Engine (README Section 58).

Tests:
- exact match (Pass 1)
- fee difference (Pass 2)
- duplicate detection (Pass 3)
- date difference and fuzzy match (Pass 4)
- missing transaction & honest unresolved refusal (Pass 5)
- string cleaning and reference extraction
"""

import pytest
from datetime import date, datetime, timezone
from decimal import Decimal
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.reconciliation_engine import ReconciliationEngine
from app.models import (
    ReconciliationBatch,
    ReconciliationMatch,
    ExceptionRecord,
    BankTransaction,
    ProcessorTransaction,
)

@pytest.fixture(scope="module", autouse=True)
def ensure_db():
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
        engine = ReconciliationEngine()
        engine.run_reconciliation(db, batch_id="batch_close_2026_09")
    finally:
        db.close()

def test_string_cleaning_and_normalization():
    """Verify text cleaner removes special punctuation and normalizes casing."""
    raw = "Stripe Payout *INV-1022* (Net Amount: 31,750)"
    cleaned = ReconciliationEngine.clean_text(raw)
    assert "STRIPE PAYOUT" in cleaned
    assert "INV-1022" in cleaned
    assert "(" not in cleaned
    assert ")" not in cleaned

def test_reference_extraction_regex():
    """Verify regex correctly pulls invoice, UTR, and transaction references."""
    desc = "SETTLEMENT FOR INV-8821 AND UTR-99021 VIA STRIPE"
    refs = ReconciliationEngine.extract_references(desc)
    assert "INV-8821" in refs
    assert "99021" in refs or "UTR-99021" in refs

def test_fuzzy_similarity_threshold():
    """Verify Levenshtein/SequenceMatcher scoring."""
    engine = ReconciliationEngine()
    sim_identical = engine.fuzzy_similarity("STRIPE PAYOUT #1022", "STRIPE PAYOUT #1022")
    assert sim_identical == 1.0

    sim_partial = engine.fuzzy_similarity("STRIPE PAYOUT #1022", "STRIPE PAYOUT #1023")
    assert 0.8 < sim_partial < 1.0

    sim_different = engine.fuzzy_similarity("ACME CORP", "XYZ BANK CHARGES")
    assert sim_different < 0.4

def test_edge_case_exact_matches_pass1():
    """Verify 100% exact matches achieve 1.0 confidence and RECONCILED status."""
    db = SessionLocal()
    try:
        exact_matches = db.query(ReconciliationMatch).filter(
            ReconciliationMatch.batch_id == "batch_close_2026_09",
            ReconciliationMatch.method == "EXACT",
        ).all()
        assert len(exact_matches) > 50
        for m in exact_matches:
            assert m.confidence == 1.0
            assert m.status == "RECONCILED"
            assert m.difference == Decimal("0.0000")
    finally:
        db.close()

def test_edge_case_fee_difference_pass2():
    """Verify fee variance detection creates REVIEW status with difference matching fee."""
    db = SessionLocal()
    try:
        fee_match = db.query(ReconciliationMatch).filter(
            ReconciliationMatch.batch_id == "batch_close_2026_09",
            ReconciliationMatch.difference == Decimal("50.0000"),
        ).first()
        assert fee_match is not None
        assert fee_match.method == "AI"
        assert fee_match.status == "REVIEW"
        assert fee_match.confidence >= 0.90
    finally:
        db.close()

def test_edge_case_duplicate_detection_pass3():
    """Verify duplicate bank or processor settlements are isolated as DUPLICATE exceptions."""
    db = SessionLocal()
    try:
        dup_exceptions = db.query(ExceptionRecord).filter(
            ExceptionRecord.batch_id == "batch_close_2026_09",
            ExceptionRecord.type == "DUPLICATE",
        ).all()
        assert len(dup_exceptions) >= 1
        for ex in dup_exceptions:
            assert ex.status in ["REVIEW", "UNRESOLVED"]
            assert "DUPLICATE" in ex.ai_classification
    finally:
        db.close()

def test_edge_case_fuzzy_matching_logic():
    """Verify fuzzy similarity identifies close descriptions despite minor spacing variance."""
    engine = ReconciliationEngine()
    score = engine.fuzzy_similarity("STRIPE PAYOUT INV-1022", "STRIPE PAYOUT INV 1022")
    assert score >= 0.95


def test_edge_case_unresolved_missing_record_pass5():
    """Verify orphan transactions with no counterpart are flagged UNRESOLVED with low confidence."""
    db = SessionLocal()
    try:
        unresolved_match = db.query(ReconciliationMatch).filter(
            ReconciliationMatch.batch_id == "batch_close_2026_09",
            ReconciliationMatch.status == "UNRESOLVED",
        ).first()
        assert unresolved_match is not None
        assert unresolved_match.confidence <= 0.40

        unresolved_ex = db.query(ExceptionRecord).filter(
            ExceptionRecord.batch_id == "batch_close_2026_09",
            ExceptionRecord.status == "UNRESOLVED",
        ).first()
        assert unresolved_ex is not None
        assert unresolved_ex.type == "MISSING_RECORD"
        assert "Unable to resolve" in unresolved_ex.ai_recommended_action
    finally:
        db.close()

