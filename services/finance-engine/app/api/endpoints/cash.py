"""Cash Position & Forward Forecasting Endpoints (Sections 12, 35, 37, 38)."""

import json
from decimal import Decimal
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.cash_forecaster import CashForecaster

router = APIRouter(prefix="/api", tags=["Cash & Forecasting"])
forecaster = CashForecaster()


class RunForecastRequest(BaseModel):
    company_id: Optional[str] = None
    timeframe_days: int = Field(default=30, ge=7, le=90, description="Forecast horizon in days (7, 14, 30, 60, 90)")
    safety_threshold: Optional[float] = Field(default=800000.0, description="Minimum safe cash balance in INR")


@router.get("/cash-position")
def get_current_cash_position(
    company_id: Optional[str] = Query(None, description="Company ID"),
    db: Session = Depends(get_db),
):
    """Retrieve current consolidated cash position, open receivables, and statutory liabilities.

    Formula: Current Cash + Expected Receivables - Upcoming Expenses - Taxes = Projected 30-Day Cash.
    """
    try:
        position = forecaster.get_cash_position(db, company_id=company_id)
        return position
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate cash position: {str(e)}")


@router.post("/cash-forecast/run")
def run_cash_forecast(
    request: RunForecastRequest = RunForecastRequest(),
    db: Session = Depends(get_db),
):
    """Run deterministic cash forecasting engine across specified time horizon (7, 14, 30, 60, 90 days).

    Generates forward liquidity trajectory curve, safety buffer evaluation, and AI narrative explanation.
    """
    try:
        threshold = Decimal(str(request.safety_threshold)) if request.safety_threshold else None
        record = forecaster.run_forecast(
            db=db,
            company_id=request.company_id,
            timeframe_days=request.timeframe_days,
            safety_threshold=threshold,
        )

        ai_exp = record.ai_explanation
        if isinstance(ai_exp, str):
            try:
                ai_exp = json.loads(ai_exp)
            except Exception:
                pass

        return {
            "id": record.id,
            "company_id": record.company_id,
            "as_of_date": record.as_of_date.isoformat(),
            "timeframe_days": record.timeframe_days,
            "current_cash": float(record.current_cash),
            "expected_receivables": float(record.expected_receivables),
            "upcoming_expenses": float(record.upcoming_expenses),
            "payroll": float(record.payroll),
            "taxes": float(record.taxes),
            "projected_cash": float(record.projected_cash),
            "minimum_projected_cash": float(record.minimum_projected_cash),
            "safety_threshold": float(record.safety_threshold),
            "safety_buffer": float(record.minimum_projected_cash - record.safety_threshold),
            "status": record.status,
            "forecast_curve": record.forecast_curve_json,
            "ai_explanation": ai_exp,
            "created_at": record.created_at.isoformat() if record.created_at else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run cash forecast: {str(e)}")


@router.get("/cash-forecast")
def get_cash_forecast(
    timeframe_days: int = Query(30, ge=7, le=90, description="Forecast horizon in days (7, 14, 30, 60, 90)"),
    company_id: Optional[str] = Query(None, description="Company ID"),
    db: Session = Depends(get_db),
):
    """Retrieve latest forward cash forecast or generate one on-demand."""
    try:
        record = forecaster.get_latest_forecast(
            db=db,
            company_id=company_id,
            timeframe_days=timeframe_days,
        )

        ai_exp = record.ai_explanation
        if isinstance(ai_exp, str):
            try:
                ai_exp = json.loads(ai_exp)
            except Exception:
                pass

        return {
            "id": record.id,
            "company_id": record.company_id,
            "as_of_date": record.as_of_date.isoformat(),
            "timeframe_days": record.timeframe_days,
            "current_cash": float(record.current_cash),
            "expected_receivables": float(record.expected_receivables),
            "upcoming_expenses": float(record.upcoming_expenses),
            "payroll": float(record.payroll),
            "taxes": float(record.taxes),
            "projected_cash": float(record.projected_cash),
            "minimum_projected_cash": float(record.minimum_projected_cash),
            "safety_threshold": float(record.safety_threshold),
            "safety_buffer": float(record.minimum_projected_cash - record.safety_threshold),
            "status": record.status,
            "forecast_curve": record.forecast_curve_json,
            "ai_explanation": ai_exp,
            "created_at": record.created_at.isoformat() if record.created_at else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch cash forecast: {str(e)}")
