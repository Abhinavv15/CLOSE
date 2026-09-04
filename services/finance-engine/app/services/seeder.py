import os
import csv
from decimal import Decimal
from datetime import date
from typing import Dict, Any
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, init_db
from app.models import (
    Company,
    User,
    BankAccount,
    BankTransaction,
    ProcessorTransaction,
    LedgerEntry,
    Invoice,
    ReconciliationBatch,
)
from app.core.security import hash_password
from app.services.synthetic_generator import SyntheticDataGenerator


def seed_demo_dataset(db: Session, count: int = 127) -> Dict[str, Any]:
    """Seed demo company, accounts, users, and 127 synthetic financial records into PostgreSQL."""
    init_db()

    # 1. Demo Company
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

    # 2. Demo Users with Real Cryptographic Passwords
    users_to_seed = [
        {
            "id": "usr_controller_01",
            "email": "abhinav@democorp.internal",
            "full_name": "Abhinav V",
            "role": "CONTROLLER",
            "title": "Senior Financial Controller",
            "avatar": "AV",
            "password": "Abhinav@2026!",
        },
        {
            "id": "usr_auditor_02",
            "email": "sarah.auditor@kpmg-audit.internal",
            "full_name": "Sarah Jenkins",
            "role": "AUDITOR",
            "title": "Lead Statutory Auditor",
            "avatar": "SJ",
            "password": "Auditor@2026!",
        },
        {
            "id": "usr_admin_03",
            "email": "admin@democorp.internal",
            "full_name": "Vikram Malhotra",
            "role": "ADMIN",
            "title": "VP Finance Operations",
            "avatar": "VM",
            "password": "Admin@2026!",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter_by(email=u_data["email"]).first()
        if not existing:
            db.add(User(
                id=u_data["id"],
                company_id=company.id,
                email=u_data["email"],
                full_name=u_data["full_name"],
                role=u_data["role"],
                title=u_data["title"],
                avatar=u_data["avatar"],
                hashed_password=hash_password(u_data["password"]),
                is_active=True,
            ))
        else:
            existing.full_name = u_data["full_name"]
            existing.role = u_data["role"]
            existing.title = u_data["title"]
            existing.avatar = u_data["avatar"]
            existing.hashed_password = hash_password(u_data["password"])
    db.flush()

    # 3. Bank Account
    account = db.query(BankAccount).filter_by(company_id=company.id).first()
    if not account:
        account = BankAccount(
            id="ba_demo_001",
            company_id=company.id,
            bank_name="HDFC Current Operating Account",
            account_number_mask="•••• 9012",
            currency="INR",
            current_balance=Decimal("1840000.0000"),  # ₹18.4L (Section 10)
        )
        db.add(account)

    # 4. Reconciliation Batch
    batch = ReconciliationBatch(
        id="batch_close_2026_09",
        company_id=company.id,
        status="COMPLETED",
        records_processed=count,
        matched=116,
        ai_matched=4,
        review_required=4,
        unresolved=7,
        match_rate=0.945,
    )
    # Check if batch already exists, remove or replace
    existing_batch = db.query(ReconciliationBatch).filter_by(id=batch.id).first()
    if existing_batch:
        db.delete(existing_batch)
        db.flush()
    db.add(batch)
    db.flush()

    # 5. Generate synthetic dataset
    gen = SyntheticDataGenerator(seed=42)
    dataset = gen.generate_batch(count=count)

    # Insert Invoices
    for inv in dataset["invoices"]:
        db.add(Invoice(
            company_id=company.id,
            batch_id=batch.id,
            invoice_number=inv["invoice_number"],
            customer=inv["customer"],
            invoice_date=inv["invoice_date"],
            due_date=inv["due_date"],
            amount=inv["amount"],
            currency=inv["currency"],
            status=inv["status"],
            ground_truth_match_id=inv.get("ground_truth_match_id"),
            ground_truth_status=inv.get("ground_truth_status"),
        ))

    # Insert Processor Settlements
    for pt in dataset["processor_transactions"]:
        db.add(ProcessorTransaction(
            company_id=company.id,
            batch_id=batch.id,
            settlement_date=pt["settlement_date"],
            processor=pt["processor"],
            transaction_id=pt["transaction_id"],
            gross_amount=pt["gross_amount"],
            fee=pt["fee"],
            net_amount=pt["net_amount"],
            currency=pt["currency"],
            status=pt["status"],
            reference=pt.get("reference"),
            ground_truth_match_id=pt.get("ground_truth_match_id"),
            ground_truth_status=pt.get("ground_truth_status"),
            ground_truth_exception_type=pt.get("ground_truth_exception_type"),
        ))

    # Insert Bank Transactions
    for bt in dataset["bank_transactions"]:
        db.add(BankTransaction(
            company_id=company.id,
            batch_id=batch.id,
            date=bt["date"],
            description=bt["description"],
            amount=bt["amount"],
            currency=bt["currency"],
            reference=bt.get("reference"),
            type=bt["type"],
            ground_truth_match_id=bt.get("ground_truth_match_id"),
            ground_truth_status=bt.get("ground_truth_status"),
            ground_truth_exception_type=bt.get("ground_truth_exception_type"),
        ))

    # Insert General Ledger
    for gl in dataset["ledger_entries"]:
        db.add(LedgerEntry(
            company_id=company.id,
            batch_id=batch.id,
            date=gl["date"],
            account=gl["account"],
            description=gl["description"],
            debit=gl["debit"],
            credit=gl["credit"],
            reference=gl.get("reference"),
            ground_truth_match_id=gl.get("ground_truth_match_id"),
            ground_truth_status=gl.get("ground_truth_status"),
        ))

    db.commit()

    return {
        "company_id": company.id,
        "batch_id": batch.id,
        "counts": {
            "invoices": len(dataset["invoices"]),
            "processor_transactions": len(dataset["processor_transactions"]),
            "bank_transactions": len(dataset["bank_transactions"]),
            "ledger_entries": len(dataset["ledger_entries"]),
        },
    }


def export_fixtures_to_disk(base_dir: str = "data"):
    """Export generated datasets as standalone CSV fixtures for manual upload or testing."""
    gen = SyntheticDataGenerator(seed=42)
    dataset = gen.generate_batch(count=127)

    fixtures_dir = os.path.join(base_dir, "fixtures")
    synthetic_dir = os.path.join(base_dir, "synthetic")
    os.makedirs(fixtures_dir, exist_ok=True)
    os.makedirs(synthetic_dir, exist_ok=True)

    for target_dir in [fixtures_dir, synthetic_dir]:
        # 1. Bank
        bank_file = os.path.join(target_dir, "bank_transactions.csv")
        with open(bank_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["date", "description", "amount", "currency", "reference", "type"])
            writer.writeheader()
            for row in dataset["bank_transactions"]:
                writer.writerow({k: row[k] for k in ["date", "description", "amount", "currency", "reference", "type"]})

        # 2. Processor
        proc_file = os.path.join(target_dir, "processor_settlements.csv")
        with open(proc_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["settlement_date", "processor", "transaction_id", "gross_amount", "fee", "net_amount", "currency", "status", "reference"])
            writer.writeheader()
            for row in dataset["processor_transactions"]:
                writer.writerow({k: row[k] for k in ["settlement_date", "processor", "transaction_id", "gross_amount", "fee", "net_amount", "currency", "status", "reference"]})

        # 3. Ledger
        ledger_file = os.path.join(target_dir, "ledger_entries.csv")
        with open(ledger_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["date", "account", "description", "debit", "credit", "reference"])
            writer.writeheader()
            for row in dataset["ledger_entries"]:
                writer.writerow({k: row[k] for k in ["date", "account", "description", "debit", "credit", "reference"]})

        # 4. Invoices
        inv_file = os.path.join(target_dir, "invoices.csv")
        with open(inv_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["invoice_number", "customer", "invoice_date", "due_date", "amount", "currency", "status"])
            writer.writeheader()
            for row in dataset["invoices"]:
                writer.writerow({k: row[k] for k in ["invoice_number", "customer", "invoice_date", "due_date", "amount", "currency", "status"]})

    print(f"Exported fixture CSVs to {fixtures_dir} and {synthetic_dir}")
