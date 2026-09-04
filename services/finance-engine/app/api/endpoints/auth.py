from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, decode_access_token, hash_password
from app.models.entity import User, Company

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Standard permissions mapped by role
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "CONTROLLER": [
        "reconciliation:run",
        "reconciliation:view",
        "exceptions:triage",
        "exceptions:approve",
        "exceptions:reject",
        "exceptions:investigate",
        "cash:view",
        "cash:forecast",
        "audit:view",
        "audit:export",
        "evaluation:view",
        "batches:manage",
    ],
    "AUDITOR": [
        "reconciliation:view",
        "exceptions:view",
        "cash:view",
        "audit:view",
        "audit:export",
        "evaluation:view",
    ],
    "ADMIN": [
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
        "data:seed",
        "batches:manage",
    ],
}

PERSONAS = {
    "controller": {
        "id": "usr_controller_01",
        "name": "Abhinav V",
        "email": "abhinav@democorp.internal",
        "role": "CONTROLLER",
        "title": "Senior Financial Controller",
        "avatar": "AV",
        "company": "Demo Technologies Pvt Ltd",
        "company_id": "cmp_demo_001",
        "permissions": ROLE_PERMISSIONS["CONTROLLER"],
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
        "permissions": ROLE_PERMISSIONS["AUDITOR"],
    },
    "admin": {
        "id": "usr_admin_03",
        "name": "Vikram Malhotra",
        "email": "admin@democorp.internal",
        "role": "ADMIN",
        "title": "VP of Finance Operations & Systems",
        "avatar": "VM",
        "company": "Demo Technologies Pvt Ltd",
        "company_id": "cmp_demo_001",
        "permissions": ROLE_PERMISSIONS["ADMIN"],
    },
}


class LoginRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    persona_key: Optional[str] = None


def format_user_profile(user: User, company_name: str = "Demo Technologies Pvt Ltd") -> Dict[str, Any]:
    perms = ROLE_PERMISSIONS.get(user.role.upper(), ROLE_PERMISSIONS["CONTROLLER"])
    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "title": user.title or "Financial Controller",
        "avatar": user.avatar or "AV",
        "company": company_name,
        "company_id": user.company_id,
        "permissions": perms,
    }


@router.get("/personas")
def list_personas():
    return list(PERSONAS.values())


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user against PostgreSQL database or preset persona, returning JWT session token."""
    # 1. Direct Email + Password authentication against PostgreSQL
    if req.email and req.password:
        user = db.query(User).filter(User.email.ilike(req.email.strip())).first()
        if user:
            # Check password if user has hash
            if user.hashed_password and not verify_password(req.password, user.hashed_password):
                raise HTTPException(status_code=401, detail="Invalid corporate credentials.")
            
            company = db.query(Company).filter_by(id=user.company_id).first()
            company_name = company.name if company else "Demo Technologies Pvt Ltd"
            user_profile = format_user_profile(user, company_name)
            
            token = create_access_token({
                "sub": user.id,
                "email": user.email,
                "role": user.role,
                "name": user.full_name,
                "company_id": user.company_id,
            })
            return {
                "success": True,
                "token": token,
                "access_token": token,
                "token_type": "bearer",
                "user": user_profile,
            }

    # 2. Preset Persona selection
    key = (req.persona_key or "controller").lower()
    if key in PERSONAS:
        persona = PERSONAS[key]
        # Look up or ensure in PostgreSQL
        user = db.query(User).filter(User.email.ilike(persona["email"])).first()
        user_id = user.id if user else persona["id"]
        company_id = user.company_id if user else persona["company_id"]
        
        token = create_access_token({
            "sub": user_id,
            "email": persona["email"],
            "role": persona["role"],
            "name": persona["name"],
            "company_id": company_id,
        })
        return {
            "success": True,
            "token": token,
            "access_token": token,
            "token_type": "bearer",
            "user": persona,
        }

    # 3. Fallback to controller for seamless compatibility
    persona = PERSONAS["controller"]
    token = create_access_token({
        "sub": persona["id"],
        "email": persona["email"],
        "role": persona["role"],
        "name": persona["name"],
        "company_id": persona["company_id"],
    })
    return {
        "success": True,
        "token": token,
        "access_token": token,
        "token_type": "bearer",
        "user": persona,
    }


@router.get("/me")
def get_current_user(
    authorization: Optional[str] = Header(None),
    persona_key: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve active session user from verified JWT Bearer token or fallback persona."""
    # 1. Bearer Token Verification
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
        payload = decode_access_token(token)
        if payload and "email" in payload:
            user = db.query(User).filter(User.email.ilike(payload["email"])).first()
            if user:
                company = db.query(Company).filter_by(id=user.company_id).first()
                company_name = company.name if company else "Demo Technologies Pvt Ltd"
                return format_user_profile(user, company_name)
            
            # Fallback to payload claims
            role = payload.get("role", "CONTROLLER")
            return {
                "id": payload.get("sub", "usr_controller_01"),
                "name": payload.get("name", "Abhinav V"),
                "email": payload["email"],
                "role": role,
                "title": "Senior Financial Controller" if role == "CONTROLLER" else "Financial User",
                "avatar": "AV",
                "company": "Demo Technologies Pvt Ltd",
                "company_id": payload.get("company_id", "cmp_demo_001"),
                "permissions": ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["CONTROLLER"]),
            }

    # 2. Persona Query parameter fallback (for test backward compatibility)
    key = (persona_key or "controller").lower()
    if key in PERSONAS:
        return PERSONAS[key]
    return PERSONAS["controller"]


@router.post("/logout")
def logout():
    """Invalidate session and sign out."""
    return {"success": True, "message": "Successfully signed out of session."}

