#!/usr/bin/env python3
"""CLI seeder script for CLOSE Finance Controller.

Usage:
    python scripts/seed.py
    python scripts/seed.py --count 250
"""
import sys
import os
import argparse

# Add finance-engine to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "services", "finance-engine"))

from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset, export_fixtures_to_disk


def main():
    parser = argparse.ArgumentParser(description="Seed synthetic financial records into CLOSE")
    parser.add_argument("--count", type=int, default=127, help="Number of records to generate (default: 127)")
    args = parser.parse_args()

    print("=====================================================")
    print("   CLOSE — AI Finance Controller Database Seeder     ")
    print("=====================================================")

    print(f"1. Initializing database schema...")
    init_db()

    print(f"2. Generating and seeding {args.count} records with ground truth...")
    db = SessionLocal()
    try:
        res = seed_demo_dataset(db, count=args.count)
        print(f"   ✓ Company: {res['company_id']}")
        print(f"   ✓ Batch: {res['batch_id']}")
        print(f"   ✓ Invoices: {res['counts']['invoices']}")
        print(f"   ✓ Processor Settlements: {res['counts']['processor_transactions']}")
        print(f"   ✓ Bank Transactions: {res['counts']['bank_transactions']}")
        print(f"   ✓ General Ledger Entries: {res['counts']['ledger_entries']}")
    finally:
        db.close()

    print(f"3. Exporting CSV fixtures to data/fixtures/ and data/synthetic/...")
    export_fixtures_to_disk(base_dir=os.path.join(os.path.dirname(__file__), "..", "data"))
    print("✓ Dataset seed completed successfully!")


if __name__ == "__main__":
    main()
