from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, Any
import csv
import io
from decimal import Decimal
from datetime import datetime, date

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


@router.post("/upload/{source_type}", response_model=Dict[str, Any])
async def upload_source_csv(
    source_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload and parse a real CSV financial statement for a given source."""
    valid_sources = ["bank", "processor", "ledger", "invoices"]
    if source_type not in valid_sources:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source type '{source_type}'. Must be one of: {', '.join(valid_sources)}"
        )

    # Ensure demo company exists
    company = db.query(Company).filter_by(name="Demo Technologies Pvt Ltd").first()
    if not company:
        company = Company(
            id="comp_demo_001",
            name="Demo Technologies Pvt Ltd",
            default_currency="INR",
            is_active=True,
        )
        db.add(company)
        db.flush()

    # Ensure batch exists
    batch = db.query(ReconciliationBatch).filter_by(id="batch_close_2026_09").first()
    if not batch:
        batch = ReconciliationBatch(
            id="batch_close_2026_09",
            company_id=company.id,
            status="PENDING",
            records_processed=0,
            matched=0,
            ai_matched=0,
            review_required=0,
            unresolved=0,
            match_rate=0.0,
        )
        db.add(batch)
        db.flush()

    try:
        content = await file.read()
        text = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        rows = list(reader)
        if not rows:
            raise HTTPException(status_code=400, detail="CSV file is empty or missing headers.")

        inserted_count = 0

        if source_type == "bank":
            for row in rows:
                tx_date = datetime.strptime(row["date"].strip(), "%Y-%m-%d").date() if "date" in row else date.today()
                db.add(BankTransaction(
                    company_id=company.id,
                    batch_id=batch.id,
                    date=tx_date,
                    description=row.get("description", "Unknown"),
                    amount=Decimal(str(row.get("amount", "0"))),
                    currency=row.get("currency", "INR"),
                    reference=row.get("reference"),
                    type=row.get("type", "CREDIT"),
                ))
                inserted_count += 1

        elif source_type == "processor":
            for row in rows:
                s_date = datetime.strptime(row["settlement_date"].strip(), "%Y-%m-%d").date() if "settlement_date" in row else date.today()
                db.add(ProcessorTransaction(
                    company_id=company.id,
                    batch_id=batch.id,
                    settlement_date=s_date,
                    processor=row.get("processor", "Stripe"),
                    transaction_id=row.get("transaction_id", f"txn_{inserted_count}"),
                    gross_amount=Decimal(str(row.get("gross_amount", "0"))),
                    fee=Decimal(str(row.get("fee", "0"))),
                    net_amount=Decimal(str(row.get("net_amount", "0"))),
                    currency=row.get("currency", "INR"),
                    status=row.get("status", "SETTLED"),
                    reference=row.get("reference"),
                ))
                inserted_count += 1

        elif source_type == "ledger":
            for row in rows:
                l_date = datetime.strptime(row["date"].strip(), "%Y-%m-%d").date() if "date" in row else date.today()
                db.add(LedgerEntry(
                    company_id=company.id,
                    batch_id=batch.id,
                    date=l_date,
                    account=row.get("account", "Accounts Receivable"),
                    description=row.get("description", "Journal Entry"),
                    debit=Decimal(str(row.get("debit", "0"))),
                    credit=Decimal(str(row.get("credit", "0"))),
                    reference=row.get("reference"),
                ))
                inserted_count += 1

        elif source_type == "invoices":
            for row in rows:
                inv_date = datetime.strptime(row["invoice_date"].strip(), "%Y-%m-%d").date() if "invoice_date" in row else date.today()
                due_date = datetime.strptime(row["due_date"].strip(), "%Y-%m-%d").date() if "due_date" in row else date.today()
                db.add(Invoice(
                    company_id=company.id,
                    batch_id=batch.id,
                    invoice_number=row.get("invoice_number", f"INV-{inserted_count}"),
                    customer=row.get("customer", "Demo Customer"),
                    invoice_date=inv_date,
                    due_date=due_date,
                    amount=Decimal(str(row.get("amount", "0"))),
                    currency=row.get("currency", "INR"),
                    status=row.get("status", "PAID"),
                ))
                inserted_count += 1

        # Update batch record count
        batch.records_processed = (batch.records_processed or 0) + inserted_count
        db.commit()

        return {
            "success": True,
            "message": f"Successfully uploaded and ingested {inserted_count} records for {source_type}.",
            "source_type": source_type,
            "rows_ingested": inserted_count,
            "batch_id": batch.id,
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

