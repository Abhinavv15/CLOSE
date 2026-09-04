from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.core.database import get_db
from app.models import (
    ReconciliationBatch,
    ReconciliationMatch,
    ExceptionRecord,
    BankTransaction,
)
from app.services.reconciliation_engine import ReconciliationEngine

router = APIRouter(prefix="/api/reconciliation", tags=["Reconciliation Engine"])


@router.post("/run", response_model=Dict[str, Any])
def run_batch_reconciliation(
    batch_id: str = Query("batch_close_2026_09", description="Reconciliation batch ID"),
    db: Session = Depends(get_db),
):
    """Trigger the multi-pass deterministic reconciliation engine on a batch."""
    engine = ReconciliationEngine()
    try:
        result = engine.run_reconciliation(db, batch_id=batch_id)
        return {
            "success": True,
            "message": "Reconciliation pass completed successfully.",
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{batch_id}", response_model=Dict[str, Any])
def get_batch_summary(batch_id: str, db: Session = Depends(get_db)):
    """Retrieve reconciliation summary and health metrics for a batch."""
    batch = db.query(ReconciliationBatch).filter_by(id=batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch {batch_id} not found")

    return {
        "batch_id": batch.id,
        "status": batch.status,
        "records_processed": batch.records_processed,
        "matched": batch.matched,
        "ai_matched": batch.ai_matched,
        "review_required": batch.review_required,
        "unresolved": batch.unresolved,
        "match_rate": batch.match_rate,
        "completed_at": batch.completed_at,
    }


@router.get("/{batch_id}/results", response_model=Dict[str, Any])
def get_reconciliation_results(
    batch_id: str,
    method: str = Query(None, description="Filter by method: EXACT, RULE, FUZZY, AI, HUMAN"),
    status: str = Query(None, description="Filter by status: RECONCILED, REVIEW, UNRESOLVED"),
    db: Session = Depends(get_db),
):
    """Retrieve individual reconciliation matching records for table matrix display (Section 31)."""
    query = db.query(ReconciliationMatch).filter_by(batch_id=batch_id)
    if method:
        query = query.filter_by(method=method.upper())
    if status:
        query = query.filter_by(status=status.upper())

    matches = query.all()
    results = []
    for m in matches:
        bank_tx = m.bank_transaction
        proc_tx = m.processor_transaction
        inv = m.invoice
        ledger = m.ledger_entry

        matched_desc = "—"
        if proc_tx:
            matched_desc = f"{proc_tx.processor} #{proc_tx.transaction_id}"
            if inv:
                matched_desc += f" ({inv.invoice_number})"
        elif inv:
            matched_desc = f"{inv.invoice_number} ({inv.customer})"

        results.append({
            "id": m.id,
            "bank_tx_id": m.bank_tx_id,
            "description": bank_tx.description if bank_tx else "Unknown",
            "source": "Bank",
            "amount": float(bank_tx.amount) if bank_tx else 0.0,
            "matched_with": matched_desc,
            "difference": float(m.difference),
            "method": m.method,
            "confidence": m.confidence,
            "status": m.status,
        })

    return {
        "batch_id": batch_id,
        "count": len(results),
        "results": results,
    }
