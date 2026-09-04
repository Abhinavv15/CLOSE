import pytest
from decimal import Decimal
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.synthetic_generator import SyntheticDataGenerator
from app.services.seeder import seed_demo_dataset
from app.models import BankTransaction, ProcessorTransaction, Invoice, LedgerEntry

client = TestClient(app)


def test_generator_volume_and_distribution():
    """Verify generator outputs expected 127 records and anomalies."""
    gen = SyntheticDataGenerator(seed=42)
    dataset = gen.generate_batch(count=127)

    # 1. Total records
    assert len(dataset["bank_transactions"]) == 127
    assert len(dataset["processor_transactions"]) >= 120
    assert len(dataset["invoices"]) >= 120
    assert len(dataset["ledger_entries"]) >= 200

    # 2. Check for canonical anomalies
    # EX-102: Processor fee variance of ₹50
    fee_cases = [p for p in dataset["processor_transactions"] if p.get("ground_truth_exception_type") == "PROCESSOR_FEE"]
    assert len(fee_cases) >= 1
    assert fee_cases[0]["fee"] == Decimal("50.0000")

    # EX-108: Missing record with ₹72,400
    missing_cases = [b for b in dataset["bank_transactions"] if b.get("ground_truth_exception_type") == "MISSING_RECORD"]
    assert len(missing_cases) >= 1
    assert any(b["amount"] == Decimal("72400.0000") for b in missing_cases)

    # EX-111: Duplicate transaction of ₹25,000
    duplicate_cases = [p for p in dataset["processor_transactions"] if p.get("ground_truth_exception_type") == "DUPLICATE"]
    assert len(duplicate_cases) >= 1
    assert any(p["gross_amount"] == Decimal("25000.0000") for p in duplicate_cases)


def test_seed_demo_dataset_to_db():
    """Verify database seeder populates tables with ground-truth linkage."""
    db = SessionLocal()
    try:
        res = seed_demo_dataset(db, count=127)
        assert res["batch_id"] == "batch_close_2026_09"
        assert res["counts"]["bank_transactions"] == 127

        # Query database directly
        db_bank_count = db.query(BankTransaction).filter_by(batch_id="batch_close_2026_09").count()
        assert db_bank_count == 127

        # Verify ground truth metadata is preserved in database
        fee_tx = db.query(BankTransaction).filter_by(ground_truth_exception_type="PROCESSOR_FEE").first()
        assert fee_tx is not None
        assert fee_tx.amount == Decimal("31750.0000")
        assert fee_tx.currency == "INR"
    finally:
        db.close()


def test_api_load_demo_endpoint():
    """Verify /api/data/load-demo API endpoint."""
    response = client.post("/api/data/load-demo")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["batch_id"] == "batch_close_2026_09"
    assert data["counts"]["bank_transactions"] == 127


def test_api_sources_summary_endpoint():
    """Verify /api/data/sources/summary API endpoint."""
    response = client.get("/api/data/sources/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["bank_transactions"] >= 127
    assert data["processor_transactions"] >= 120
    assert data["invoices"] >= 120
    assert data["ledger_entries"] >= 200
