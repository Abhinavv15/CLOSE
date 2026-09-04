from decimal import Decimal
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.models import (
    BankTransaction,
    ProcessorTransaction,
    LedgerEntry,
    Invoice,
)


class ControllerTools:
    """Deterministic financial tools callable by the AI controller agent (Section 21)."""

    @staticmethod
    def search_bank_transactions(
        db: Session,
        amount: Optional[Decimal] = None,
        reference: Optional[str] = None,
        target_date: Optional[date] = None,
        date_tolerance_days: int = 3,
    ) -> List[Dict[str, Any]]:
        """Search bank statement transactions by amount, reference key, or date range."""
        query = db.query(BankTransaction)
        filters = []

        if amount is not None:
            filters.append(BankTransaction.amount == amount)
        if reference is not None:
            filters.append(BankTransaction.reference.ilike(f"%{reference}%"))
        if target_date is not None:
            start = target_date - timedelta(days=date_tolerance_days)
            end = target_date + timedelta(days=date_tolerance_days)
            filters.append(and_(BankTransaction.date >= start, BankTransaction.date <= end))

        if filters:
            query = query.filter(or_(*filters))

        results = query.limit(10).all()
        return [
            {
                "id": bt.id,
                "date": str(bt.date),
                "description": bt.description,
                "amount": float(bt.amount),
                "currency": bt.currency,
                "reference": bt.reference,
                "type": bt.type,
            }
            for bt in results
        ]

    @staticmethod
    def search_processor_transactions(
        db: Session,
        amount: Optional[Decimal] = None,
        reference: Optional[str] = None,
        transaction_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Search payment gateway settlements (Stripe, Razorpay, BillDesk)."""
        query = db.query(ProcessorTransaction)
        filters = []

        if amount is not None:
            filters.append(or_(
                ProcessorTransaction.gross_amount == amount,
                ProcessorTransaction.net_amount == amount,
            ))
        if reference is not None:
            filters.append(ProcessorTransaction.reference.ilike(f"%{reference}%"))
        if transaction_id is not None:
            filters.append(ProcessorTransaction.transaction_id.ilike(f"%{transaction_id}%"))

        if filters:
            query = query.filter(or_(*filters))

        results = query.limit(10).all()
        return [
            {
                "id": pt.id,
                "settlement_date": str(pt.settlement_date),
                "processor": pt.processor,
                "transaction_id": pt.transaction_id,
                "gross_amount": float(pt.gross_amount),
                "fee": float(pt.fee),
                "net_amount": float(pt.net_amount),
                "currency": pt.currency,
                "reference": pt.reference,
                "status": pt.status,
            }
            for pt in results
        ]

    @staticmethod
    def search_invoices(
        db: Session,
        amount: Optional[Decimal] = None,
        invoice_number: Optional[str] = None,
        customer: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Search customer invoices by number, amount, or customer name."""
        query = db.query(Invoice)
        filters = []

        if amount is not None:
            filters.append(Invoice.amount == amount)
        if invoice_number is not None:
            filters.append(Invoice.invoice_number.ilike(f"%{invoice_number}%"))
        if customer is not None:
            filters.append(Invoice.customer.ilike(f"%{customer}%"))

        if filters:
            query = query.filter(or_(*filters))

        results = query.limit(10).all()
        return [
            {
                "id": inv.id,
                "invoice_number": inv.invoice_number,
                "customer": inv.customer,
                "invoice_date": str(inv.invoice_date),
                "due_date": str(inv.due_date),
                "amount": float(inv.amount),
                "currency": inv.currency,
                "status": inv.status,
            }
            for inv in results
        ]

    @staticmethod
    def search_ledger_entries(
        db: Session,
        account: Optional[str] = None,
        reference: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Search General Ledger journal entries."""
        query = db.query(LedgerEntry)
        if account:
            query = query.filter(LedgerEntry.account.ilike(f"%{account}%"))
        if reference:
            query = query.filter(LedgerEntry.reference.ilike(f"%{reference}%"))

        results = query.limit(10).all()
        return [
            {
                "id": gl.id,
                "date": str(gl.date),
                "account": gl.account,
                "description": gl.description,
                "debit": float(gl.debit),
                "credit": float(gl.credit),
                "reference": gl.reference,
            }
            for gl in results
        ]

    @staticmethod
    def find_duplicates(
        db: Session,
        amount: Decimal,
        tolerance_days: int = 2,
    ) -> List[Dict[str, Any]]:
        """Detect identical amount transactions posted within close succession."""
        results = (
            db.query(BankTransaction)
            .filter(BankTransaction.amount == amount)
            .order_by(BankTransaction.date)
            .all()
        )
        return [
            {
                "id": bt.id,
                "date": str(bt.date),
                "description": bt.description,
                "amount": float(bt.amount),
                "reference": bt.reference,
            }
            for bt in results
        ]

    @staticmethod
    def calculate_difference(amount_a: Decimal, amount_b: Decimal) -> Dict[str, Any]:
        """Perform strict decimal discrepancy arithmetic."""
        diff = amount_a - amount_b
        pct = (diff / amount_a * 100) if amount_a != Decimal("0") else Decimal("0")
        return {
            "amount_a": float(amount_a),
            "amount_b": float(amount_b),
            "difference": float(diff),
            "difference_percentage": float(pct),
        }
