import random
import uuid
from datetime import date, timedelta
from decimal import Decimal
from typing import Dict, List, Any, Tuple
import pandas as pd


class SyntheticDataGenerator:
    """Institutional synthetic financial dataset generator with hidden ground truth.
    
    Generates realistic multi-source financial records:
    1. Bank Statements
    2. Payment Processor Settlements
    3. General Ledger Journal Entries
    4. Customer Invoices
    
    Implements ground-truth labels and controlled adversarial anomalies:
    - Exact matches (55%)
    - Gateway fee variances (e.g. ₹50 fee discrepancy)
    - Description & string format variations
    - Settlement timing differences (1-3 days)
    - Duplicate transactions
    - Missing records (unrecognized inflows/outflows)
    - Partial settlement splits
    """

    DEFAULT_CURRENCY = "INR"

    CUSTOMERS = [
        "Acme Technologies Pvt Ltd",
        "Zeta Cloud Services",
        "Apex Logistics India",
        "Kaveri Enterprises",
        "Nexus Retail Solutions",
        "BlueStone Analytics",
        "Orbit Media Works",
        "Trident Infotech",
        "Zenith Health Systems",
        "Bharat FinServ",
    ]

    PROCESSORS = ["Stripe", "Razorpay", "BillDesk"]

    ACCOUNTS = [
        "1010 - Operating Bank Account",
        "1200 - Accounts Receivable",
        "4000 - Operating Software Revenue",
        "5050 - Payment Gateway Processing Fees",
        "2010 - Accounts Payable",
        "6100 - Cloud Infrastructure & Hosting",
    ]

    def __init__(self, seed: int = 42):
        self.random = random.Random(seed)

    def generate_batch(self, count: int = 127, start_date: date = date(2026, 9, 1)) -> Dict[str, Any]:
        """Generate a complete dataset of financial records with embedded ground truth."""
        records = {
            "invoices": [],
            "processor_transactions": [],
            "bank_transactions": [],
            "ledger_entries": [],
            "ground_truth_index": {},
        }

        # Distribution plan for 127 records (Sections 15 & 73)
        # Exact proven matches: ~55% (70 records)
        # Description variations: ~10% (13 records)
        # Processing fees: ~10% (13 records, e.g. EX-102 ₹50 fee)
        # Timing differences: ~10% (13 records)
        # Duplicates: ~4% (5 records, e.g. EX-111 ₹25,000 duplicate)
        # Partial settlements: ~4% (5 records)
        # Missing records / Unknown transactions: ~6% (8 records, e.g. EX-108 ₹72,400)

        match_id_counter = 1000

        # 1. Canonical Anchor Cases (Sections 11, 26, 73)
        # Case A: EX-102 — ₹50 Settlement Difference (Invoice ₹31,800, Net ₹31,750, Bank ₹31,750)
        self._inject_processor_fee_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            invoice_num="INV-1022",
            customer="Acme Technologies Pvt Ltd",
            gross_amount=Decimal("31800.0000"),
            fee=Decimal("50.0000"),
            invoice_date=start_date,
            settlement_date=start_date + timedelta(days=2),
            exception_id="EX-102",
        )
        match_id_counter += 1

        # Case B: EX-108 — Missing Record (₹72,400 bank deposit with no supporting invoice or processor record)
        self._inject_missing_record_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            amount=Decimal("72400.0000"),
            tx_date=start_date + timedelta(days=3),
            exception_id="EX-108",
        )
        match_id_counter += 1

        # Case C: EX-111 — Potential Duplicate (₹25,000 duplicate settlement transaction)
        self._inject_duplicate_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            customer="Nexus Retail Solutions",
            amount=Decimal("25000.0000"),
            tx_date=start_date + timedelta(days=4),
            exception_id="EX-111",
        )
        match_id_counter += 1

        # Case D: EX-114 — Timing Difference (Cleared 4 days later)
        self._inject_timing_difference_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            customer="Zeta Cloud Services",
            amount=Decimal("140000.0000"),
            invoice_date=start_date + timedelta(days=1),
            settlement_date=start_date + timedelta(days=5),
            exception_id="EX-114",
        )
        match_id_counter += 1

        # Case E: EX-119 — Partial Settlement (Invoice ₹100,000 paid in ₹60,000 and ₹40,000 installments)
        self._inject_partial_settlement_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            customer="Bharat FinServ",
            total_amount=Decimal("100000.0000"),
            split_a=Decimal("60000.0000"),
            split_b=Decimal("40000.0000"),
            invoice_date=start_date + timedelta(days=2),
            settlement_date=start_date + timedelta(days=4),
            exception_id="EX-119",
        )
        match_id_counter += 1

        # Case F: EX-122 — Unrecognized outflow debit (₹18,500)
        self._inject_unrecognized_debit_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            amount=Decimal("18500.0000"),
            tx_date=start_date + timedelta(days=6),
            exception_id="EX-122",
        )
        match_id_counter += 1

        # Case G: EX-125 — Foreign exchange / rounding variance (₹84,000 invoice, ₹83,760 net, ₹240 variance)
        self._inject_amount_variance_anomaly(
            records,
            match_id=f"GT-{match_id_counter}",
            customer="Orbit Media Works",
            gross_amount=Decimal("84000.0000"),
            variance=Decimal("240.0000"),
            invoice_date=start_date + timedelta(days=5),
            settlement_date=start_date + timedelta(days=7),
            exception_id="EX-125",
        )
        match_id_counter += 1

        # 2. Populate remainder of the target record count with realistic transactions
        remaining = count - len(records["bank_transactions"])
        for i in range(remaining):
            match_id_counter += 1
            match_id = f"GT-{match_id_counter}"
            cust = self.random.choice(self.CUSTOMERS)
            amt_int = self.random.choice([12500, 18200, 24500, 36000, 48000, 52000, 65000, 95000, 110000, 125000])
            amount = Decimal(f"{amt_int}.0000")
            day_offset = self.random.randint(1, 25)
            inv_date = start_date + timedelta(days=day_offset)
            ref_num = f"{self.random.randint(10000, 99999)}"
            inv_num = f"INV-{self.random.randint(2000, 9999)}"

            # 75% exact matches, 25% description variations
            has_desc_variance = self.random.random() < 0.25
            proc_name = self.random.choice(self.PROCESSORS)

            # Invoice
            records["invoices"].append({
                "invoice_number": inv_num,
                "customer": cust,
                "invoice_date": inv_date,
                "due_date": inv_date + timedelta(days=15),
                "amount": amount,
                "currency": self.DEFAULT_CURRENCY,
                "status": "PAID",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "MATCHED",
            })

            # Processor
            settle_date = inv_date + timedelta(days=1)
            records["processor_transactions"].append({
                "settlement_date": settle_date,
                "processor": proc_name,
                "transaction_id": f"SET-{self.random.randint(10000, 99999)}",
                "gross_amount": amount,
                "fee": Decimal("0.0000"),
                "net_amount": amount,
                "currency": self.DEFAULT_CURRENCY,
                "status": "SETTLED",
                "reference": f"REF-{ref_num}",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "MATCHED",
            })

            # Bank
            bank_desc = (
                f"{proc_name.upper()} PAYOUT {ref_num}"
                if not has_desc_variance
                else f"{proc_name} INC DISBURSEMENT #{ref_num} {cust[:8]}"
            )
            records["bank_transactions"].append({
                "date": settle_date,
                "description": bank_desc,
                "amount": amount,
                "currency": self.DEFAULT_CURRENCY,
                "reference": f"REF-{ref_num}",
                "type": "CREDIT",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "MATCHED",
            })

            # General Ledger
            records["ledger_entries"].append({
                "date": settle_date,
                "account": "1200 - Accounts Receivable",
                "description": f"Receipt against {inv_num} {cust}",
                "debit": Decimal("0.0000"),
                "credit": amount,
                "reference": f"REF-{ref_num}",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "MATCHED",
            })
            records["ledger_entries"].append({
                "date": settle_date,
                "account": "1010 - Operating Bank Account",
                "description": f"Bank deposit receipt {ref_num}",
                "debit": amount,
                "credit": Decimal("0.0000"),
                "reference": f"REF-{ref_num}",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "MATCHED",
            })

        return records

    # --- Anomaly Generators ---
    def _inject_processor_fee_anomaly(self, records, match_id, invoice_num, customer, gross_amount, fee, invoice_date, settlement_date, exception_id):
        net_amount = gross_amount - fee
        ref = "STRIPE-82931"

        records["invoices"].append({
            "invoice_number": invoice_num,
            "customer": customer,
            "invoice_date": invoice_date,
            "due_date": invoice_date + timedelta(days=14),
            "amount": gross_amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "PARTIAL",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_FEE",
            "ground_truth_exception_type": "PROCESSOR_FEE",
        })

        records["processor_transactions"].append({
            "settlement_date": settlement_date,
            "processor": "Stripe",
            "transaction_id": "SET-5521",
            "gross_amount": gross_amount,
            "fee": fee,
            "net_amount": net_amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "SETTLED",
            "reference": ref,
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_FEE",
            "ground_truth_exception_type": "PROCESSOR_FEE",
        })

        records["bank_transactions"].append({
            "date": settlement_date,
            "description": f"STRIPE PAYOUT {ref} #5521",
            "amount": net_amount,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "CREDIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_FEE",
            "ground_truth_exception_type": "PROCESSOR_FEE",
        })

        records["ledger_entries"].append({
            "date": settlement_date,
            "account": "1010 - Operating Bank Account",
            "description": f"Stripe Settlement {ref}",
            "debit": net_amount,
            "credit": Decimal("0.0000"),
            "reference": ref,
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_FEE",
        })

    def _inject_missing_record_anomaly(self, records, match_id, amount, tx_date, exception_id):
        # A credit appears in the bank with no invoice or processor record
        ref = "RTGS-99021-UNKNOWN"
        records["bank_transactions"].append({
            "date": tx_date,
            "description": "DIRECT RTGS INFLOW UNIDENTIFIED ORIGIN",
            "amount": amount,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "CREDIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "UNRESOLVED",
            "ground_truth_exception_type": "MISSING_RECORD",
        })

    def _inject_duplicate_anomaly(self, records, match_id, customer, amount, tx_date, exception_id):
        ref = "REF-TXN-9092"
        # Insert two processor and bank records with same amount and date
        for i in range(2):
            records["processor_transactions"].append({
                "settlement_date": tx_date,
                "processor": "Razorpay",
                "transaction_id": f"SET-9092-DUP{i+1}",
                "gross_amount": amount,
                "fee": Decimal("0.0000"),
                "net_amount": amount,
                "currency": self.DEFAULT_CURRENCY,
                "status": "SETTLED",
                "reference": ref,
                "ground_truth_match_id": match_id,
                "ground_truth_status": "EXCEPTION_DUPLICATE" if i > 0 else "MATCHED",
                "ground_truth_exception_type": "DUPLICATE",
            })
            records["bank_transactions"].append({
                "date": tx_date,
                "description": f"RAZORPAY SETTLEMENT {ref}",
                "amount": amount,
                "currency": self.DEFAULT_CURRENCY,
                "reference": ref,
                "type": "CREDIT",
                "ground_truth_match_id": match_id,
                "ground_truth_status": "EXCEPTION_DUPLICATE" if i > 0 else "MATCHED",
                "ground_truth_exception_type": "DUPLICATE",
            })

    def _inject_timing_difference_anomaly(self, records, match_id, customer, amount, invoice_date, settlement_date, exception_id):
        ref = "REF-TIMING-114"
        inv_num = "INV-3401"
        records["invoices"].append({
            "invoice_number": inv_num,
            "customer": customer,
            "invoice_date": invoice_date,
            "due_date": invoice_date + timedelta(days=30),
            "amount": amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "PAID",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_TIMING",
            "ground_truth_exception_type": "TIMING_DIFFERENCE",
        })
        records["processor_transactions"].append({
            "settlement_date": settlement_date,
            "processor": "Stripe",
            "transaction_id": "SET-9941-DELAY",
            "gross_amount": amount,
            "fee": Decimal("0.0000"),
            "net_amount": amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "SETTLED",
            "reference": ref,
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_TIMING",
            "ground_truth_exception_type": "TIMING_DIFFERENCE",
        })
        records["bank_transactions"].append({
            "date": settlement_date,
            "description": f"STRIPE TRANSFER {ref} DELAYED CLEARING",
            "amount": amount,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "CREDIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_TIMING",
            "ground_truth_exception_type": "TIMING_DIFFERENCE",
        })

    def _inject_partial_settlement_anomaly(self, records, match_id, customer, total_amount, split_a, split_b, invoice_date, settlement_date, exception_id):
        ref = "REF-SPLIT-119"
        inv_num = "INV-9901"
        records["invoices"].append({
            "invoice_number": inv_num,
            "customer": customer,
            "invoice_date": invoice_date,
            "due_date": invoice_date + timedelta(days=15),
            "amount": total_amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "PARTIAL",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_PARTIAL",
            "ground_truth_exception_type": "PARTIAL_SETTLEMENT",
        })
        records["processor_transactions"].append({
            "settlement_date": settlement_date,
            "processor": "BillDesk",
            "transaction_id": "SET-SPLIT-A",
            "gross_amount": split_a,
            "fee": Decimal("0.0000"),
            "net_amount": split_a,
            "currency": self.DEFAULT_CURRENCY,
            "status": "SETTLED",
            "reference": ref,
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_PARTIAL",
            "ground_truth_exception_type": "PARTIAL_SETTLEMENT",
        })
        records["bank_transactions"].append({
            "date": settlement_date,
            "description": f"BILLDESK PAYOUT PARTIAL {ref}",
            "amount": split_a,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "CREDIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_PARTIAL",
            "ground_truth_exception_type": "PARTIAL_SETTLEMENT",
        })

    def _inject_unrecognized_debit_anomaly(self, records, match_id, amount, tx_date, exception_id):
        ref = "ACH-DEBIT-UNKNOWN"
        records["bank_transactions"].append({
            "date": tx_date,
            "description": "UNRECOGNIZED MERCHANT DEBIT SAN FRANCISCO",
            "amount": amount,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "DEBIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "UNRESOLVED",
            "ground_truth_exception_type": "MISSING_RECORD",
        })

    def _inject_amount_variance_anomaly(self, records, match_id, customer, gross_amount, variance, invoice_date, settlement_date, exception_id):
        ref = "REF-FX-125"
        net_amount = gross_amount - variance
        records["invoices"].append({
            "invoice_number": "INV-7721",
            "customer": customer,
            "invoice_date": invoice_date,
            "due_date": invoice_date + timedelta(days=30),
            "amount": gross_amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "PAID",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_VARIANCE",
            "ground_truth_exception_type": "AMOUNT_MISMATCH",
        })
        records["processor_transactions"].append({
            "settlement_date": settlement_date,
            "processor": "Stripe",
            "transaction_id": "SET-FX-7721",
            "gross_amount": gross_amount,
            "fee": variance,
            "net_amount": net_amount,
            "currency": self.DEFAULT_CURRENCY,
            "status": "SETTLED",
            "reference": ref,
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_VARIANCE",
            "ground_truth_exception_type": "AMOUNT_MISMATCH",
        })
        records["bank_transactions"].append({
            "date": settlement_date,
            "description": f"STRIPE PAYOUT FX ADJUSTMENT {ref}",
            "amount": net_amount,
            "currency": self.DEFAULT_CURRENCY,
            "reference": ref,
            "type": "CREDIT",
            "ground_truth_match_id": match_id,
            "ground_truth_status": "EXCEPTION_VARIANCE",
            "ground_truth_exception_type": "AMOUNT_MISMATCH",
        })
