from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import init_db, check_db_connection, get_db

# Setup logging (Section 60)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("close.finance_engine")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    logger.info("Initializing database tables...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}", exc_info=True)
    yield
    logger.info("Shutting down CLOSE finance engine...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Deterministic Financial Reconciliation & AI Finance Controller Engine",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
from app.api.endpoints.data import router as data_router
from app.api.endpoints.reconciliation import router as reconciliation_router

app.include_router(data_router)
app.include_router(reconciliation_router)


# Request timing and structured audit logging middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    logger.info(f"{request.method} {request.url.path} completed in {process_time:.4f}s with status {response.status_code}")
    return response


# Global error handler with structured error schema (Section 43)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing the financial records.",
            },
        },
    )


@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
async def health_check():
    db_ok = check_db_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "service": "close-finance-engine",
        "version": "0.1.0",
        "ai_mode": settings.AI_MODE,
        "database": {
            "engine": settings.DATABASE_URL.split(":")[0],
            "connected": db_ok,
        },
    }


@app.get("/api/status", tags=["System"])
async def system_status(db: Session = Depends(get_db)):
    db_ok = check_db_connection()
    return {
        "status": "ready" if db_ok else "degraded",
        "batch_engine": "online",
        "ai_controller": "online" if settings.AI_MODE == "live" else "mock_fallback",
        "database": {
            "status": "connected" if db_ok else "disconnected",
            "type": settings.DATABASE_URL.split(":")[0],
        },
        "confidence_thresholds": {
            "auto_resolve": settings.CONFIDENCE_THRESHOLD_AUTO_RESOLVE,
            "recommend": settings.CONFIDENCE_THRESHOLD_RECOMMEND,
            "review": settings.CONFIDENCE_THRESHOLD_REVIEW,
        },
    }
