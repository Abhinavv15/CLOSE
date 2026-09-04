from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import date, datetime
from decimal import Decimal


# --- Common Evidence Schema (Section 23 & 28) ---
class EvidenceItem(BaseModel):
    type: Literal["invoice", "processor_transaction", "bank_transaction", "ledger_entry"]
    id: str
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    date: Optional[str] = None


# --- AI Investigation Output Schema (Section 23) ---
class ExceptionInvestigationResponse(BaseModel):
    exception_id: str
    classification: str = Field(..., description="E.g. PROCESSOR_FEE, TIMING_DIFFERENCE, MISSING_RECORD, DUPLICATE")
    confidence: float = Field(..., ge=0.0, le=1.0)
    status: Literal["AUTO_RESOLVED", "REVIEW", "UNRESOLVED"]
    explanation: str
    recommended_action: str
    evidence: List[EvidenceItem]
    investigated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Reconciliation Batch Response (Section 66) ---
class BatchResponse(BaseModel):
    batch_id: str
    status: Literal["pending", "processing", "completed", "failed"]
    records_processed: int
    matched: int
    ai_matched: int
    review_required: int
    unresolved: int
    match_rate: float
    created_at: datetime


# --- Cash Forecast Response (Section 12, 37, 38) ---
class CashBreakdown(BaseModel):
    current_cash: Decimal
    expected_receivables: Decimal
    upcoming_expenses: Decimal
    payroll: Decimal
    taxes: Decimal
    projected_cash: Decimal


class CashForecastPoint(BaseModel):
    day: int
    date: str
    projected_balance: Decimal
    inflow: Decimal
    outflow: Decimal


class CashForecastResponse(BaseModel):
    timeframe_days: int = 30
    breakdown: CashBreakdown
    forecast_curve: List[CashForecastPoint]
    minimum_projected_cash: Decimal
    safety_threshold: Decimal
    status: Literal["SAFE", "WARNING", "CRITICAL"]
    ai_explanation: str


# --- Ground-Truth Evaluation Metrics Response (Section 39, 40) ---
class EvaluationMetricsResponse(BaseModel):
    records_processed: int
    correct_matches: int
    incorrect_matches: int
    unresolved_count: int
    precision: float
    recall: float
    f1_score: float
    match_rate: float
    auto_resolution_precision: float
    false_resolution_rate: float
    average_processing_time_seconds: float
    honest_unresolved_breakdown: dict[str, int]
