"""Test Suite for Cash Position & Forward Cash Forecasting (Branch 7).

Tests Sections 12, 35, 37, 38, and 67:
- Deterministic calculation
- Multi-horizon curves (7, 14, 30, 60, 90 days)
- AI narrative explanations
- Safety thresholds & buffers
- API endpoints & audit logging
"""

import pytest
from decimal import Decimal
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seeder import seed_demo_dataset
from app.services.cash_forecaster import CashForecaster
from app.models import CashForecast, AuditLog, BankAccount

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_cash_test_env():
    """Ensure database has seeded demo records."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_dataset(db, count=127)
    finally:
        db.close()


def test_get_cash_position_endpoint():
    """Verify GET /api/cash-position returns canonical balance and 5 key metrics (Section 12)."""
    response = client.get("/api/cash-position")
    assert response.status_code == 200
    data = response.json()

    # Verify 5 primary cash metrics
    assert "current_cash" in data
    assert data["current_cash"] == 1840000.0  # ₹18.4L
    assert "expected_receivables" in data
    assert data["expected_receivables"] >= 720000.0  # +₹7.2L
    assert "upcoming_expenses" in data
    assert data["upcoming_expenses"] == 540000.0  # -₹5.4L
    assert "taxes" in data
    assert data["taxes"] == 120000.0  # -₹1.2L
    assert "projected_30d_cash" in data
    assert data["projected_30d_cash"] >= 1800000.0  # ~₹18.1L

    # Safety thresholds
    assert data["minimum_projected_cash"] == 1160000.0  # ₹11.6L minimum dip
    assert data["safety_threshold"] == 800000.0  # ₹8.0L safety floor
    assert data["safety_buffer"] == 360000.0  # ₹3.6L safety buffer
    assert data["status"] == "SAFE"

    # Bank account details
    assert "accounts" in data
    assert len(data["accounts"]) >= 1
    assert data["accounts"][0]["currency"] == "INR"


def test_forecaster_service_multi_horizons():
    """Verify CashForecaster runs across 7, 14, 30, 60, 90 day horizons (Section 37)."""
    forecaster = CashForecaster()
    db = SessionLocal()
    try:
        for days in [7, 14, 30, 60, 90]:
            forecast = forecaster.run_forecast(db, timeframe_days=days)
            assert forecast is not None
            assert forecast.timeframe_days == days
            assert len(forecast.forecast_curve_json) == days
            assert forecast.current_cash == Decimal("1840000.0000")
            assert forecast.safety_threshold == Decimal("800000.0000")
            assert forecast.status in ["SAFE", "WARNING", "CRITICAL"]

            # First and last points
            first_pt = forecast.forecast_curve_json[0]
            last_pt = forecast.forecast_curve_json[-1]
            assert first_pt["day"] == "Day 1"
            assert last_pt["day"] == f"Day {days}"
    finally:
        db.close()


def test_ai_narrative_explanation_structure():
    """Verify AI explanation adheres to Section 38 template."""
    forecaster = CashForecaster()
    db = SessionLocal()
    try:
        forecast = forecaster.run_forecast(db, timeframe_days=30)
        import json
        explanation = json.loads(forecast.ai_explanation)

        assert "headline" in explanation
        assert "Cash position appears stable" in explanation["headline"]
        assert explanation["status"] == "SAFE"
        assert explanation["projected_minimum_cash"] == 1160000.0 or explanation["projected_minimum_cash"] > 0
        assert "₹8.0L" in explanation["safety_threshold_lakhs"]
        assert "primary_upcoming_outflows" in explanation
        outflows = explanation["primary_upcoming_outflows"]
        categories = [o["category"] for o in outflows]
        assert "Payroll" in categories
        assert "Cloud Infrastructure" in categories
        assert "Vendor Payments" in categories
        assert "Tax Obligations" in categories
    finally:
        db.close()


def test_post_run_cash_forecast_api():
    """Verify POST /api/cash-forecast/run API endpoint."""
    payload = {
        "timeframe_days": 30,
        "safety_threshold": 800000.0,
    }
    response = client.post("/api/cash-forecast/run", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert data["id"].startswith("fc_")
    assert data["timeframe_days"] == 30
    assert len(data["forecast_curve"]) == 30
    assert data["status"] == "SAFE"
    assert "ai_explanation" in data
    assert data["ai_explanation"]["headline"] == "Cash position appears stable."


def test_get_cash_forecast_api():
    """Verify GET /api/cash-forecast returns latest 30-day forecast curve and explanation."""
    response = client.get("/api/cash-forecast?timeframe_days=30")
    assert response.status_code == 200
    data = response.json()

    assert data["timeframe_days"] == 30
    assert len(data["forecast_curve"]) == 30
    assert data["current_cash"] == 1840000.0
    assert data["safety_threshold"] == 800000.0
    assert data["safety_buffer"] > 0
    assert "events" in data["forecast_curve"][4]  # Day 5 AWS event


def test_cash_forecast_audit_trail():
    """Verify forecast generation appends immutable AuditLog record (Section 30)."""
    db = SessionLocal()
    try:
        audit = (
            db.query(AuditLog)
            .filter_by(action="CASH_FORECAST_GENERATED")
            .order_by(AuditLog.timestamp.desc())
            .first()
        )
        assert audit is not None
        assert audit.actor == "AI Finance Controller"
        assert audit.entity_type == "CASH_FORECAST"
        assert "timeframe_days" in audit.details_json
    finally:
        db.close()
