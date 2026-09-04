import uuid
from decimal import Decimal
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Numeric,
    Float,
    Integer,
    ForeignKey,
    Index,
    Text,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class ReconciliationBatch(Base, TimestampMixin):
    """Reconciliation close batches."""
    __tablename__ = "reconciliation_batches"

    id = Column(String(64), primary_key=True, default=lambda: f"batch_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(String(32), default="PENDING", nullable=False, index=True)  # PENDING, PROCESSING, COMPLETED, FAILED
    records_processed = Column(Integer, default=0, nullable=False)
    matched = Column(Integer, default=0, nullable=False)
    ai_matched = Column(Integer, default=0, nullable=False)
    review_required = Column(Integer, default=0, nullable=False)
    unresolved = Column(Integer, default=0, nullable=False)
    match_rate = Column(Float, default=0.0, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    company = relationship("Company", back_populates="batches")
    bank_transactions = relationship("BankTransaction", back_populates="batch")
    processor_transactions = relationship("ProcessorTransaction", back_populates="batch")
    ledger_entries = relationship("LedgerEntry", back_populates="batch")
    invoices = relationship("Invoice", back_populates="batch")
    matches = relationship("ReconciliationMatch", back_populates="batch", cascade="all, delete-orphan")
    exceptions = relationship("ExceptionRecord", back_populates="batch", cascade="all, delete-orphan")
    evaluation_runs = relationship("EvaluationRun", back_populates="batch", cascade="all, delete-orphan")


class ReconciliationMatch(Base, TimestampMixin):
    """Reconciliation match pairings between multi-source records."""
    __tablename__ = "reconciliation_matches"

    id = Column(String(64), primary_key=True, default=lambda: f"match_{uuid.uuid4().hex[:12]}")
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="CASCADE"), nullable=False, index=True)

    bank_tx_id = Column(String(64), ForeignKey("bank_transactions.id", ondelete="SET NULL"), nullable=True, index=True)
    processor_tx_id = Column(String(64), ForeignKey("processor_transactions.id", ondelete="SET NULL"), nullable=True, index=True)
    ledger_entry_id = Column(String(64), ForeignKey("ledger_entries.id", ondelete="SET NULL"), nullable=True, index=True)
    invoice_id = Column(String(64), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True, index=True)

    method = Column(String(32), nullable=False)  # EXACT, RULE, FUZZY, AI, HUMAN
    confidence = Column(Float, nullable=False)
    difference = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    status = Column(String(32), default="RECONCILED", nullable=False)  # RECONCILED, REVIEW, UNRESOLVED

    # Relationships
    batch = relationship("ReconciliationBatch", back_populates="matches")
    bank_transaction = relationship("BankTransaction")
    processor_transaction = relationship("ProcessorTransaction")
    ledger_entry = relationship("LedgerEntry")
    invoice = relationship("Invoice")

    __table_args__ = (
        Index("ix_match_batch_status", "batch_id", "status"),
        Index("ix_match_method", "method"),
    )


class ExceptionRecord(Base, TimestampMixin):
    """Exceptions escalated for AI investigation or human review."""
    __tablename__ = "exceptions"

    id = Column(String(64), primary_key=True, default=lambda: f"EX-{uuid.uuid4().hex[:6].upper()}")
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="CASCADE"), nullable=False, index=True)

    type = Column(String(64), nullable=False, index=True)  # AMOUNT_MISMATCH, MISSING_RECORD, DUPLICATE, TIMING_DIFFERENCE, PARTIAL_SETTLEMENT
    amount = Column(Numeric(18, 4), nullable=False)
    difference = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    confidence = Column(Float, nullable=False)
    status = Column(String(32), default="REVIEW", nullable=False, index=True)  # REVIEW, AUTO_RESOLVED, UNRESOLVED, APPROVED, REJECTED

    # AI Investigation Outputs (Section 23)
    ai_classification = Column(String(64), nullable=True)
    ai_explanation = Column(Text, nullable=True)
    ai_recommended_action = Column(Text, nullable=True)
    ai_investigated_at = Column(DateTime, nullable=True)

    # Human Approval Trail (Section 29)
    resolved_by = Column(String(255), nullable=True)
    resolution_note = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    batch = relationship("ReconciliationBatch", back_populates="exceptions")
    evidence = relationship("ExceptionEvidence", back_populates="exception", cascade="all, delete-orphan")


class ExceptionEvidence(Base, TimestampMixin):
    """Connected records cited as evidence for an exception (Section 28)."""
    __tablename__ = "exception_evidence"

    id = Column(String(64), primary_key=True, default=lambda: f"ev_{uuid.uuid4().hex[:12]}")
    exception_id = Column(String(64), ForeignKey("exceptions.id", ondelete="CASCADE"), nullable=False, index=True)

    source_type = Column(String(32), nullable=False)  # invoice, processor_transaction, bank_transaction, ledger_entry
    source_id = Column(String(64), nullable=False, index=True)
    description = Column(String(500), nullable=True)
    amount = Column(Numeric(18, 4), nullable=True)

    # Relationships
    exception = relationship("ExceptionRecord", back_populates="evidence")
