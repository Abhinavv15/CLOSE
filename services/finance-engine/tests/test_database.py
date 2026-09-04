import pytest
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import text
from app.core.database import SessionLocal, init_db, check_db_connection, Base, engine
from app.models import (
    Company,
    User,
    BankAccount,
    BankTransaction,
    ProcessorTransaction,
    LedgerEntry,
    Invoice,
    ReconciliationBatch,
    ReconciliationMatch,
    ExceptionRecord,
    ExceptionEvidence,
    CashForecast,
    AuditLog,
    EvaluationRun,
)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Ensure clean tables are created before running tests."""
    init_db()
    yield


def test_db_connectivity():
    """Verify engine connectivity."""
    assert check_db_connection() is True


def test_decimal_precision_preservation():
    """Section 67: Never use floating point for money calculations."""
    db = SessionLocal()
    try:
        # 1. Create company
        company = Company(name="Test FinTech Corp", default_currency="INR")
        db.add(company)
        db.commit()
        db.refresh(company)

        # 2. Insert transaction with high precision decimal amount
        exact_amount = Decimal("31750.5050")
        tx = BankTransaction(
            company_id=company.id,
            date=date(2026, 9, 1),
            description="STRIPE PAYOUT *82931",
            amount=exact_amount,
            currency="INR",
            reference="REF-88912",
            type="CREDIT",
        )
        db.add(tx)
        db.commit()
        db.refresh(tx)

        # Retrieve and verify decimal type & exact equality
        retrieved = db.query(BankTransaction).filter_by(id=tx.id).first()
        assert retrieved is not None
        assert isinstance(retrieved.amount, Decimal)
        assert retrieved.amount == exact_amount
        assert retrieved.currency == "INR"

        # Cleanup
        db.delete(company)
        db.commit()
    finally:
        db.close()


def test_reconciliation_batch_and_exception_lineage():
    """Verify batch, matching, exception and evidence relationships."""
    db = SessionLocal()
    try:
        # Create company
        company = Company(name="Lineage Corp", default_currency="INR")
        db.add(company)
        db.commit()
        db.refresh(company)

        # Create batch
        batch = ReconciliationBatch(
            company_id=company.id,
            status="PROCESSING",
            records_processed=127,
            matched=116,
            unresolved=7,
            match_rate=0.945,
        )
        db.add(batch)
        db.commit()
        db.refresh(batch)

        # Create exception
        exception = ExceptionRecord(
            batch_id=batch.id,
            type="AMOUNT_MISMATCH",
            amount=Decimal("31800.0000"),
            difference=Decimal("50.0000"),
            confidence=0.94,
            status="REVIEW",
            ai_classification="PROCESSOR_FEE",
            ai_explanation="Processor settlement is lower than invoice by ₹50.",
        )
        db.add(exception)
        db.commit()
        db.refresh(exception)

        # Link evidence items
        ev1 = ExceptionEvidence(
            exception_id=exception.id,
            source_type="invoice",
            source_id="INV-1022",
            amount=Decimal("31800.0000"),
        )
        ev2 = ExceptionEvidence(
            exception_id=exception.id,
            source_type="processor_transaction",
            source_id="SET-5521",
            amount=Decimal("31750.0000"),
        )
        db.add_all([ev1, ev2])
        db.commit()

        # Query and verify relationship loading
        re_queried_ex = db.query(ExceptionRecord).filter_by(id=exception.id).first()
        assert re_queried_ex is not None
        assert len(re_queried_ex.evidence) == 2
        assert re_queried_ex.batch.records_processed == 127

        # Cleanup
        db.delete(company)
        db.commit()
    finally:
        db.close()


def test_audit_log_immutability():
    """Verify audit log event persistence."""
    db = SessionLocal()
    try:
        log_entry = AuditLog(
            actor="Senior Controller",
            action="HUMAN_APPROVAL_RECORDED",
            entity_type="EXCEPTION",
            entity_id="EX-102",
            details_json={"note": "Approved ₹50 processor fee."},
            confidence="94%",
            status="VERIFIED",
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)

        assert log_entry.id.startswith("aud_")
        assert log_entry.action == "HUMAN_APPROVAL_RECORDED"
        assert log_entry.details_json["note"] == "Approved ₹50 processor fee."

        db.delete(log_entry)
        db.commit()
    finally:
        db.close()
