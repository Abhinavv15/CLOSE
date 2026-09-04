import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "CLOSE AI Finance Controller"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("APP_ENV", "development") == "development"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/close"
    )

    # Authentication & JWT Session Management
    SECRET_KEY: str = os.getenv("SECRET_KEY", "close_production_secret_key_2026_987a65c43b21")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days session

    # AI Controller
    AI_MODE: str = os.getenv("AI_MODE", "mock")  # 'mock' or 'live'
    LLM_API_KEY: Optional[str] = os.getenv("LLM_API_KEY", None)
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-pro")

    # Thresholds (Section 24)
    CONFIDENCE_THRESHOLD_AUTO_RESOLVE: float = float(os.getenv("CONFIDENCE_THRESHOLD_AUTO_RESOLVE", "0.95"))
    CONFIDENCE_THRESHOLD_RECOMMEND: float = float(os.getenv("CONFIDENCE_THRESHOLD_RECOMMEND", "0.85"))
    CONFIDENCE_THRESHOLD_REVIEW: float = float(os.getenv("CONFIDENCE_THRESHOLD_REVIEW", "0.60"))

    # Server
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()
