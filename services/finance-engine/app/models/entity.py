import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Company(Base, TimestampMixin):
    """Company entity representing an organization closing its books."""
    __tablename__ = "companies"

    id = Column(String(64), primary_key=True, default=lambda: f"comp_{uuid.uuid4().hex[:12]}")
    name = Column(String(255), nullable=False)
    default_currency = Column(String(3), default="INR", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    bank_accounts = relationship("BankAccount", back_populates="company", cascade="all, delete-orphan")
    batches = relationship("ReconciliationBatch", back_populates="company", cascade="all, delete-orphan")
    bank_transactions = relationship("BankTransaction", back_populates="company", cascade="all, delete-orphan")
    processor_transactions = relationship("ProcessorTransaction", back_populates="company", cascade="all, delete-orphan")
    ledger_entries = relationship("LedgerEntry", back_populates="company", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="company", cascade="all, delete-orphan")
    cash_forecasts = relationship("CashForecast", back_populates="company", cascade="all, delete-orphan")


class User(Base, TimestampMixin):
    """User accounts (finance officers, controllers, auditors)."""
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(64), default="CONTROLLER", nullable=False)  # CONTROLLER, AUDITOR, ADMIN
    title = Column(String(255), default="Senior Financial Controller", nullable=False)
    avatar = Column(String(8), default="AV", nullable=False)
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="users")


class BankAccount(Base, TimestampMixin):
    """Registered corporate bank accounts."""
    __tablename__ = "bank_accounts"

    id = Column(String(64), primary_key=True, default=lambda: f"ba_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    bank_name = Column(String(255), nullable=False)
    account_number_mask = Column(String(32), nullable=False)
    currency = Column(String(3), default="INR", nullable=False)
    current_balance = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)

    # Relationships
    company = relationship("Company", back_populates="bank_accounts")
