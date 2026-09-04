from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.models import (
    Company,
    BankTransaction,
    ProcessorTransaction,
    LedgerEntry,
    Invoice,
    ReconciliationBatch,
)
from app.services.seeder import seed_demo_dataset

router = APIRouter(prefix="/api/data", tags=["Data & Synthetic Generation"])


@router.post("/load-demo", response_model=Dict[str, Any])
def load_demo_data(db: Session = Depends(get_db)):
    """Load the canonical 127-record September 2026 demo dataset with ground truth."""
    result = seed_demo_dataset(db, count=127)
    return {
        "success": True,
        "message": "Demo financial dataset successfully loaded into PostgreSQL.",
        "batch_id": result["batch_id"],
        "counts": result["counts"],
    }


@router.post("/generate", response_model=Dict[str, Any])
def generate_custom_dataset(
    count: int = Query(127, ge=50, le=1000, description="Target record count (50, 100, 127, 250, 500, 1000)"),
    db: Session = Depends(get_db),
):
    """Generate a custom volume synthetic financial dataset with hidden ground truth."""
    result = seed_demo_dataset(db, count=count)
    return {
        "success": True,
        "message": f"Generated {count} records across 4 financial sources.",
        "batch_id": result["batch_id"],
        "counts": result["counts"],
    }


@router.get("/sources/summary", response_model=Dict[str, Any])
def get_sources_summary(db: Session = Depends(get_db)):
    """Return database record counts across all four financial statement sources."""
    return {
        "bank_transactions": db.query(BankTransaction).count(),
        "processor_transactions": db.query(ProcessorTransaction).count(),
        "ledger_entries": db.query(LedgerEntry).count(),
        "invoices": db.query(Invoice).count(),
        "batches": db.query(ReconciliationBatch).count(),
    }
