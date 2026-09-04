from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.models import ExceptionRecord, ExceptionEvidence
from app.schemas.contracts import ExceptionInvestigationResponse, EvidenceItem
from app.services.ai_controller import AIControllerService

router = APIRouter(prefix="/api/exceptions", tags=["AI Investigation Agent"])


@router.post("/{exception_id}/investigate", response_model=ExceptionInvestigationResponse)
def investigate_exception_endpoint(
    exception_id: str,
    db: Session = Depends(get_db),
):
    """Trigger the AI controller agent to investigate an exception and produce structured evidence."""
    service = AIControllerService()
    try:
        response = service.investigate_exception(db, exception_id=exception_id)
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI investigation error: {str(e)}")


@router.get("/{exception_id}/investigation", response_model=Dict[str, Any])
def get_exception_investigation(
    exception_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve existing AI diagnosis, confidence, and linked evidence items."""
    ex = db.query(ExceptionRecord).filter_by(id=exception_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Exception {exception_id} not found")

    evidence = db.query(ExceptionEvidence).filter_by(exception_id=exception_id).all()

    return {
        "exception_id": ex.id,
        "type": ex.type,
        "amount": float(ex.amount),
        "difference": float(ex.difference),
        "confidence": ex.confidence,
        "status": ex.status,
        "ai_classification": ex.ai_classification,
        "ai_explanation": ex.ai_explanation,
        "ai_recommended_action": ex.ai_recommended_action,
        "ai_investigated_at": ex.ai_investigated_at,
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
