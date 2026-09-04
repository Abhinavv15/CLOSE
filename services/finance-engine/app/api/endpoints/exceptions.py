from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.models import (
    ExceptionRecord,
    ExceptionEvidence,
    ReconciliationMatch,
    AuditLog,
)
from app.services.ai_controller import AIControllerService
from app.schemas.contracts import ExceptionInvestigationResponse

router = APIRouter(prefix="/api/exceptions", tags=["Exception Center"])


class DecisionPayload(BaseModel):
    user: str = Field(default="Senior Controller", description="Name of the finance officer making the decision")
    note: Optional[str] = Field(default=None, description="Optional explanation or audit rationale for the decision")


@router.get("", response_model=Dict[str, Any])
def list_exceptions(
    batch_id: Optional[str] = Query(None, description="Filter by reconciliation batch"),
    status: Optional[str] = Query(None, description="Filter by status (REVIEW, UNRESOLVED, APPROVED, REJECTED, AUTO_RESOLVED)"),
    type: Optional[str] = Query(None, description="Filter by anomaly type (AMOUNT_MISMATCH, MISSING_RECORD, DUPLICATE, etc.)"),
    search: Optional[str] = Query(None, description="Search by ID or explanation"),
    db: Session = Depends(get_db),
):
    """Retrieve filtered list of reconciliation exceptions (Section 25)."""
    query = db.query(ExceptionRecord)

    if batch_id:
        query = query.filter(ExceptionRecord.batch_id == batch_id)
    if status and status.upper() != "ALL":
        if status.upper() == "CRITICAL":
            query = query.filter(or_(ExceptionRecord.status == "UNRESOLVED", ExceptionRecord.type == "MISSING_RECORD"))
        else:
            query = query.filter(ExceptionRecord.status == status.upper())
    if type and type.upper() != "ALL":
        query = query.filter(ExceptionRecord.type == type.upper())
    if search:
        query = query.filter(
            or_(
                ExceptionRecord.id.ilike(f"%{search}%"),
                ExceptionRecord.ai_explanation.ilike(f"%{search}%"),
                ExceptionRecord.ai_classification.ilike(f"%{search}%"),
            )
        )

    exceptions = query.order_by(desc(ExceptionRecord.created_at)).all()

    # Calculate status counts for dashboard filters
    total = db.query(ExceptionRecord).count()
    critical_count = db.query(ExceptionRecord).filter(or_(ExceptionRecord.status == "UNRESOLVED", ExceptionRecord.type == "MISSING_RECORD")).count()
    review_count = db.query(ExceptionRecord).filter_by(status="REVIEW").count()
    unresolved_count = db.query(ExceptionRecord).filter_by(status="UNRESOLVED").count()
    approved_count = db.query(ExceptionRecord).filter_by(status="APPROVED").count()

    results = []
    for ex in exceptions:
        results.append({
            "id": ex.id,
            "batch_id": ex.batch_id,
            "type": ex.type,
            "amount": float(ex.amount),
            "difference": float(ex.difference),
            "confidence": ex.confidence,
            "status": ex.status,
            "ai_classification": ex.ai_classification,
            "summary": ex.ai_explanation or f"Exception {ex.id}: {ex.type} discrepancy of {ex.difference}",
            "created_at": ex.created_at.isoformat() if ex.created_at else None,
            "resolved_by": ex.resolved_by,
            "resolved_at": ex.resolved_at.isoformat() if ex.resolved_at else None,
        })

    return {
        "counts": {
            "total": total,
            "critical": critical_count,
            "review": review_count,
            "unresolved": unresolved_count,
            "approved": approved_count,
        },
        "count": len(results),
        "exceptions": results,
    }


@router.get("/{exception_id}", response_model=Dict[str, Any])
def get_exception_detail(
    exception_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve full exception detail including 3-tier connected evidence graph (Section 26 & 28)."""
    ex = db.query(ExceptionRecord).filter_by(id=exception_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Exception {exception_id} not found")

    evidence = db.query(ExceptionEvidence).filter_by(exception_id=exception_id).all()

    # Calculate Expected vs Actual
    expected_amt = float(ex.amount)
    diff_amt = float(ex.difference)
    actual_amt = expected_amt - diff_amt if ex.type == "AMOUNT_MISMATCH" else expected_amt

    return {
        "exception_id": ex.id,
        "batch_id": ex.batch_id,
        "type": ex.type,
        "amounts": {
            "expected": expected_amt,
            "actual": actual_amt,
            "difference": diff_amt,
        },
        "confidence": ex.confidence,
        "status": ex.status,
        "ai_conclusion": {
            "classification": ex.ai_classification,
            "explanation": ex.ai_explanation,
            "recommended_action": ex.ai_recommended_action,
            "investigated_at": ex.ai_investigated_at.isoformat() if ex.ai_investigated_at else None,
        },
        "resolution": {
            "resolved_by": ex.resolved_by,
            "resolution_note": ex.resolution_note,
            "resolved_at": ex.resolved_at.isoformat() if ex.resolved_at else None,
        },
        "evidence": [
            {
                "type": ev.source_type,
                "id": ev.source_id,
                "description": ev.description,
                "amount": float(ev.amount) if ev.amount else None,
            }
            for ev in evidence
        ],
    }


@router.post("/{exception_id}/approve", response_model=Dict[str, Any])
def approve_exception_resolution(
    exception_id: str,
    payload: DecisionPayload = DecisionPayload(),
    db: Session = Depends(get_db),
):
    """Record human approval of an AI recommendation (Section 29)."""
    ex = db.query(ExceptionRecord).filter_by(id=exception_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Exception {exception_id} not found")

    now = datetime.now(timezone.utc)
    ex.status = "APPROVED"
    ex.resolved_by = payload.user
    ex.resolution_note = payload.note or "Approved AI classification."
    ex.resolved_at = now

    # Also update associated match if exists
    match = db.query(ReconciliationMatch).filter_by(batch_id=ex.batch_id, difference=ex.difference).first()
    if match:
        match.status = "RECONCILED"

    # Append-only audit trail logging (Section 30)
    audit_entry = AuditLog(
        actor=payload.user,
        action="HUMAN_APPROVAL_RECORDED",
        entity_type="EXCEPTION",
        entity_id=ex.id,
        details_json={
            "decision": "APPROVED",
            "note": ex.resolution_note,
            "ai_classification": ex.ai_classification,
            "difference": float(ex.difference),
        },
        confidence=f"{int(ex.confidence * 100)}%",
        status="VERIFIED",
    )
    db.add(audit_entry)
    db.commit()

    return {
        "success": True,
        "message": f"Exception {exception_id} resolution approved by {payload.user}.",
        "exception_id": ex.id,
        "status": ex.status,
        "resolved_at": ex.resolved_at.isoformat(),
    }


@router.post("/{exception_id}/reject", response_model=Dict[str, Any])
def reject_exception_resolution(
    exception_id: str,
    payload: DecisionPayload = DecisionPayload(),
    db: Session = Depends(get_db),
):
    """Record human rejection of an AI recommendation with audit rationale (Section 29)."""
    ex = db.query(ExceptionRecord).filter_by(id=exception_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Exception {exception_id} not found")

    now = datetime.now(timezone.utc)
    ex.status = "REJECTED"
    ex.resolved_by = payload.user
    ex.resolution_note = payload.note or "AI recommendation rejected. Flagged for manual audit."
    ex.resolved_at = now

    # Append audit trail
    audit_entry = AuditLog(
        actor=payload.user,
        action="HUMAN_REJECTION_RECORDED",
        entity_type="EXCEPTION",
        entity_id=ex.id,
        details_json={
            "decision": "REJECTED",
            "reason": ex.resolution_note,
        },
        confidence=f"{int(ex.confidence * 100)}%",
        status="REJECTED",
    )
    db.add(audit_entry)
    db.commit()

    return {
        "success": True,
        "message": f"Exception {exception_id} recommendation rejected by {payload.user}.",
        "exception_id": ex.id,
        "status": ex.status,
    }


@router.post("/{exception_id}/unresolve", response_model=Dict[str, Any])
def mark_exception_unresolved(
    exception_id: str,
    payload: DecisionPayload = DecisionPayload(),
    db: Session = Depends(get_db),
):
    """Escalate transaction as unresolvable pending third-party audit (Section 29)."""
    ex = db.query(ExceptionRecord).filter_by(id=exception_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Exception {exception_id} not found")

    now = datetime.now(timezone.utc)
    ex.status = "UNRESOLVED"
    ex.resolved_by = payload.user
    ex.resolution_note = payload.note or "Marked unresolved — requires bank treasury verification."
    ex.resolved_at = now

    # Append audit trail
    audit_entry = AuditLog(
        actor=payload.user,
        action="MARKED_UNRESOLVED",
        entity_type="EXCEPTION",
        entity_id=ex.id,
        details_json={
            "decision": "UNRESOLVED",
            "note": ex.resolution_note,
        },
        confidence="0%",
        status="UNRESOLVED",
    )
    db.add(audit_entry)
    db.commit()

    return {
        "success": True,
        "message": f"Exception {exception_id} marked unresolved.",
        "exception_id": ex.id,
        "status": ex.status,
    }


@router.get("/{exception_id}/audit", response_model=Dict[str, Any])
def get_exception_audit_trail(
    exception_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve complete audit history for a specific exception (Section 30)."""
    events = (
        db.query(AuditLog)
        .filter_by(entity_id=exception_id)
        .order_by(AuditLog.timestamp)
        .all()
    )
    return {
        "exception_id": exception_id,
        "events_count": len(events),
        "events": [
            {
                "id": ev.id,
                "timestamp": ev.timestamp.isoformat(),
                "actor": ev.actor,
                "action": ev.action,
                "details": ev.details_json,
                "confidence": ev.confidence,
                "status": ev.status,
            }
            for ev in events
        ],
    }
