import uuid
from datetime import datetime, timezone, date
from decimal import Decimal
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Date,
    Numeric,
    Float,
    Integer,
    ForeignKey,
    Index,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class CashForecast(Base, TimestampMixin):
    """30-day forward cash position forecasts (Section 37 & 38)."""
    __tablename__ = "cash_forecasts"

    id = Column(String(64), primary_key=True, default=lambda: f"fc_{uuid.uuid4().hex[:12]}")
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)

    as_of_date = Column(Date, default=date.today, nullable=False, index=True)
    timeframe_days = Column(Integer, default=30, nullable=False)

    current_cash = Column(Numeric(18, 4), nullable=False)
    expected_receivables = Column(Numeric(18, 4), nullable=False)
    upcoming_expenses = Column(Numeric(18, 4), nullable=False)
    payroll = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    taxes = Column(Numeric(18, 4), default=Decimal("0.0000"), nullable=False)
    projected_cash = Column(Numeric(18, 4), nullable=False)

    minimum_projected_cash = Column(Numeric(18, 4), nullable=False)
    safety_threshold = Column(Numeric(18, 4), default=Decimal("800000.0000"), nullable=False)  # ₹8.0L
    status = Column(String(32), default="SAFE", nullable=False)  # SAFE, WARNING, CRITICAL

    forecast_curve_json = Column(JSON, nullable=False)  # Day-by-day trajectory data
    ai_explanation = Column(Text, nullable=True)  # AI narrative analysis

    # Relationships
    company = relationship("Company", back_populates="cash_forecasts")


class AuditLog(Base):
    """Append-only immutable audit trail (Section 30)."""
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=lambda: f"aud_{uuid.uuid4().hex[:12]}")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    actor = Column(String(255), nullable=False)  # System, AI Agent, Controller Name
    action = Column(String(128), nullable=False, index=True)  # INVESTIGATION_STARTED, HUMAN_APPROVAL_RECORDED, etc.
    entity_type = Column(String(64), nullable=False)  # EXCEPTION, BATCH, TRANSACTION
    entity_id = Column(String(64), nullable=False, index=True)
    details_json = Column(JSON, nullable=True)
    confidence = Column(String(32), nullable=True)
    status = Column(String(32), default="LOGGED", nullable=False)

    __table_args__ = (
        Index("ix_audit_entity_time", "entity_id", "timestamp"),
    )


class EvaluationRun(Base, TimestampMixin):
    """Ground-truth evaluation benchmarks (Section 39 & 40)."""
    __tablename__ = "evaluation_runs"

    id = Column(String(64), primary_key=True, default=lambda: f"eval_{uuid.uuid4().hex[:12]}")
    batch_id = Column(String(64), ForeignKey("reconciliation_batches.id", ondelete="CASCADE"), nullable=False, index=True)

    records_processed = Column(Integer, nullable=False)
    correct_matches = Column(Integer, nullable=False)
    incorrect_matches = Column(Integer, nullable=False)
    unresolved_count = Column(Integer, nullable=False)

    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    match_rate = Column(Float, nullable=False)
    auto_resolution_precision = Column(Float, nullable=False)
    false_resolution_rate = Column(Float, nullable=False)
    average_processing_time_seconds = Column(Float, nullable=False)

    honest_breakdown_json = Column(JSON, nullable=False)  # Count of missing, duplicates, ambiguous

    # Relationships
    batch = relationship("ReconciliationBatch", back_populates="evaluation_runs")
