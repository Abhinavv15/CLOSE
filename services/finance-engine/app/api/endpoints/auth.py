from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])

PERSONAS = {
    "controller": {
        "id": "usr_controller_01",
        "name": "Abhinav Verma",
        "email": "abhinav@democorp.internal",
        "role": "CONTROLLER",
        "title": "Senior Financial Controller",
        "avatar": "AV",
        "company": "Demo Technologies Pvt Ltd",
        "company_id": "cmp_demo_001",
        "permissions": [
            "reconciliation:run",
            "reconciliation:view",
            "exceptions:triage",
            "exceptions:approve",
            "exceptions:reject",
            "exceptions:investigate",
            "cash:view",
            "cash:forecast",
            "audit:view",
            "evaluation:view"
        ]
    },
    "auditor": {
        "id": "usr_auditor_02",
        "name": "Sarah Jenkins",
        "email": "sarah.auditor@kpmg-audit.internal",
        "role": "AUDITOR",
        "title": "Lead Statutory Auditor",
        "avatar": "SJ",
        "company": "KPMG Statutory Audit LLP",
        "company_id": "cmp_audit_001",
        "permissions": [
            "reconciliation:view",
            "exceptions:view",
            "cash:view",
            "audit:view",
            "audit:export",
            "evaluation:view"
        ]
    },
    "admin": {
        "id": "usr_admin_03",
        "name": "Vikram Malhotra",
        "email": "vikram.admin@democorp.internal",
        "role": "ADMIN",
        "title": "VP of Finance Operations & Systems",
        "avatar": "VM",
        "company": "Demo Technologies Pvt Ltd",
        "company_id": "cmp_demo_001",
        "permissions": [
            "reconciliation:run",
            "reconciliation:view",
            "exceptions:triage",
            "exceptions:approve",
            "exceptions:reject",
            "cash:view",
            "cash:forecast",
            "audit:view",
            "audit:export",
            "evaluation:view",
            "system:configure",
            "data:seed"
        ]
    }
}

class LoginRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    persona_key: Optional[str] = "controller"

@router.get("/personas")
def list_personas():
    return list(PERSONAS.values())

@router.get("/me")
def get_current_user(persona_key: str = "controller"):
    key = persona_key.lower()
    if key not in PERSONAS:
        key = "controller"
    return PERSONAS[key]

@router.post("/login")
def login(req: LoginRequest):
    key = (req.persona_key or "controller").lower()
    if key in PERSONAS:
        return {
            "token": f"jwt_mock_token_{key}",
            "user": PERSONAS[key]
        }
    # Match by email if persona_key not provided
    for persona in PERSONAS.values():
        if req.email and persona["email"].lower() == req.email.lower():
            return {
                "token": f"jwt_mock_token_{persona['role'].lower()}",
                "user": persona
            }
    # Fallback to controller
    return {
        "token": "jwt_mock_token_controller",
        "user": PERSONAS["controller"]
    }
