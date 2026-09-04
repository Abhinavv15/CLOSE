import uuid
from decimal import Decimal
from sqlalchemy import (
    Column,
    String,
    Date,
    Numeric,
    ForeignKey,
    Index,
    Text,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class BankTransaction(Base, TimestampMixin):
    """Bank statement records (Source 1)."""
    __tablename__ = "bank_transactions"

    id = Column(String(64), primary_key=True, default=lambda: f"bt_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="SET NULL"), nullable=True, index=True)

    date = Column(Date, nullable=False, index=True)
    description = Column(String(500), nullable=False)
    amount = Column(Numeric(18, 4), nullable=False, index=True)  # Decimal money precision
    currency = Column(String(3), default="INR", nullable=False)
    reference = Column(String(255), nullable=True, index=True)
    type = Column(String(32), nullable=False)  # CREDIT, DEBIT

    # Hidden Ground Truth for Evaluation (Section 16)
    ground_truth_match_id = Column(String(64), nullable=True, index=True)
    ground_truth_status = Column(String(64), nullable=True)
    ground_truth_exception_type = Column(String(64), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="bank_transactions")
    batch = relationship("ReconciliationBatch", back_populates="bank_transactions")

    __table_args__ = (
        Index("ix_bank_tx_company_date", "company_id", "date"),
        Index("ix_bank_tx_amount_ref", "amount", "reference"),
    )


class ProcessorTransaction(Base, TimestampMixin):
    """Payment gateway/processor settlements (Source 2, e.g. Stripe, Razorpay)."""
    __tablename__ = "processor_transactions"

    id = Column(String(64), primary_key=True, default=lambda: f"pt_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="SET NULL"), nullable=True, index=True)

    settlement_date = Column(Date, nullable=False, index=True)
    processor = Column(String(64), nullable=False)  # Stripe, Razorpay, etc.
    transaction_id = Column(String(255), nullable=False, index=True)
    gross_amount = Column(Numeric(18, 4), nullable=False)
    fee = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    net_amount = Column(Numeric(18, 4), nullable=False, index=True)
    currency = Column(String(3), default="INR", nullable=False)
    status = Column(String(32), default="SETTLED", nullable=False)  # SETTLED, PENDING, FAILED
    reference = Column(String(255), nullable=True, index=True)

    # Hidden Ground Truth for Evaluation
    ground_truth_match_id = Column(String(64), nullable=True, index=True)
    ground_truth_status = Column(String(64), nullable=True)
    ground_truth_exception_type = Column(String(64), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="processor_transactions")
    batch = relationship("ReconciliationBatch", back_populates="processor_transactions")

    __table_args__ = (
        Index("ix_proc_tx_company_date", "company_id", "settlement_date"),
        Index("ix_proc_tx_net_ref", "net_amount", "reference"),
    )


class LedgerEntry(Base, TimestampMixin):
    """General Ledger journal entries (Source 3)."""
    __tablename__ = "ledger_entries"

    id = Column(String(64), primary_key=True, default=lambda: f"gl_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="SET NULL"), nullable=True, index=True)

    date = Column(Date, nullable=False, index=True)
    account = Column(String(128), nullable=False)  # Accounts Receivable, Bank, Revenue, etc.
    description = Column(String(500), nullable=False)
    debit = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    credit = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    reference = Column(String(255), nullable=True, index=True)

    # Hidden Ground Truth for Evaluation
    ground_truth_match_id = Column(String(64), nullable=True, index=True)
    ground_truth_status = Column(String(64), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="ledger_entries")
    batch = relationship("ReconciliationBatch", back_populates="ledger_entries")

    __table_args__ = (
        Index("ix_ledger_company_date", "company_id", "date"),
        Index("ix_ledger_ref", "reference"),
    )


class Invoice(Base, TimestampMixin):
    """Customer invoices & billings (Source 4)."""
    __tablename__ = "invoices"

    id = Column(String(64), primary_key=True, default=lambda: f"inv_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="SET NULL"), nullable=True, index=True)

    invoice_number = Column(String(128), nullable=False, index=True)
    customer = Column(String(255), nullable=False)
    invoice_date = Column(Date, nullable=False, index=True)
    due_date = Column(Date, nullable=False)
    amount = Column(Numeric(18, 4), nullable=False, index=True)
    currency = Column(String(3), default="INR", nullable=False)
    status = Column(String(32), default="ISSUED", nullable=False)  # ISSUED, PAID, PARTIAL, OVERDUE

    # Hidden Ground Truth for Evaluation
    ground_truth_match_id = Column(String(64), nullable=True, index=True)
    ground_truth_status = Column(String(64), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="invoices")
    batch = relationship("ReconciliationBatch", back_populates="invoices")

    __table_args__ = (
        Index("ix_invoice_company_date", "company_id", "invoice_date"),
        Index("ix_invoice_num_amount", "invoice_number", "amount"),
    )
