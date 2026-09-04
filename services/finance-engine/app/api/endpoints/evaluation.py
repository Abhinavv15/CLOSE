"""Ground-Truth Evaluation Endpoints (Sections 16, 31, 32, 35, 39, 40, 41)."""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.evaluation_engine import EvaluationEngine

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation"])
eval_engine = EvaluationEngine()


class RunEvaluationRequest(BaseModel):
    batch_id: Optional[str] = Field(default="batch_close_2026_09", description="Reconciliation batch ID to evaluate")


@router.post("/run")
def run_evaluation(
    request: RunEvaluationRequest = RunEvaluationRequest(),
    db: Session = Depends(get_db),
):
    """Execute ground-truth evaluation benchmark against hidden synthetic labels (Section 39).

    Calculates precision, recall, F1 score, auto-resolution precision, and false resolution rate.
    """
    try:
        eval_run = eval_engine.run_evaluation(db, batch_id=request.batch_id)
        return {
            "id": eval_run.id,
            "batch_id": eval_run.batch_id,
            "records_processed": eval_run.records_processed,
            "correct_matches": eval_run.correct_matches,
            "incorrect_matches": eval_run.incorrect_matches,
            "unresolved_count": eval_run.unresolved_count,
            "precision": eval_run.precision,
            "recall": eval_run.recall,
            "f1_score": eval_run.f1_score,
            "match_rate": eval_run.match_rate,
            "auto_resolution_precision": eval_run.auto_resolution_precision,
            "false_resolution_rate": eval_run.false_resolution_rate,
            "average_processing_time_seconds": eval_run.average_processing_time_seconds,
            "honest_breakdown": eval_run.honest_breakdown_json,
            "created_at": eval_run.created_at.isoformat() if eval_run.created_at else None,
        }
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@router.get("/latest")
@router.get("")
def get_latest_evaluation(
    batch_id: Optional[str] = Query(None, description="Optional batch ID filter"),
    db: Session = Depends(get_db),
):
    """Retrieve the latest ground-truth evaluation scorecard."""
    try:
        eval_run = eval_engine.get_latest_evaluation(db, batch_id=batch_id)
        return {
            "id": eval_run.id,
            "batch_id": eval_run.batch_id,
            "records_processed": eval_run.records_processed,
            "correct_matches": eval_run.correct_matches,
            "incorrect_matches": eval_run.incorrect_matches,
            "unresolved_count": eval_run.unresolved_count,
            "precision": eval_run.precision,
            "recall": eval_run.recall,
            "f1_score": eval_run.f1_score,
            "match_rate": eval_run.match_rate,
            "auto_resolution_precision": eval_run.auto_resolution_precision,
            "false_resolution_rate": eval_run.false_resolution_rate,
            "average_processing_time_seconds": eval_run.average_processing_time_seconds,
            "honest_breakdown": eval_run.honest_breakdown_json,
            "created_at": eval_run.created_at.isoformat() if eval_run.created_at else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch evaluation: {str(e)}")


@router.get("/{eval_id}")
def get_evaluation(
    eval_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve an evaluation scorecard by evaluation run ID."""
    eval_run = eval_engine.get_evaluation(db, eval_id)
    if not eval_run:
        raise HTTPException(status_code=404, detail=f"Evaluation run '{eval_id}' not found")

    return {
        "id": eval_run.id,
        "batch_id": eval_run.batch_id,
        "records_processed": eval_run.records_processed,
        "correct_matches": eval_run.correct_matches,
        "incorrect_matches": eval_run.incorrect_matches,
        "unresolved_count": eval_run.unresolved_count,
        "precision": eval_run.precision,
        "recall": eval_run.recall,
        "f1_score": eval_run.f1_score,
        "match_rate": eval_run.match_rate,
        "auto_resolution_precision": eval_run.auto_resolution_precision,
        "false_resolution_rate": eval_run.false_resolution_rate,
        "average_processing_time_seconds": eval_run.average_processing_time_seconds,
        "honest_breakdown": eval_run.honest_breakdown_json,
        "created_at": eval_run.created_at.isoformat() if eval_run.created_at else None,
    }


@router.get("/{eval_id}/results")
def get_evaluation_results(
    eval_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve detailed honest unresolved breakdown and misclassification report (Section 41)."""
    eval_run = eval_engine.get_evaluation(db, eval_id)
    if not eval_run:
        raise HTTPException(status_code=404, detail=f"Evaluation run '{eval_id}' not found")

    return {
        "id": eval_run.id,
        "batch_id": eval_run.batch_id,
        "metrics": {
            "precision": eval_run.precision,
            "recall": eval_run.recall,
            "f1_score": eval_run.f1_score,
            "match_rate": eval_run.match_rate,
            "auto_resolution_precision": eval_run.auto_resolution_precision,
            "false_resolution_rate": eval_run.false_resolution_rate,
        },
        "confusion": {
            "correct_matches": eval_run.correct_matches,
            "incorrect_matches": eval_run.incorrect_matches,
            "unresolved_records": eval_run.unresolved_count,
            "records_processed": eval_run.records_processed,
        },
        "honest_breakdown": eval_run.honest_breakdown_json,
    }
