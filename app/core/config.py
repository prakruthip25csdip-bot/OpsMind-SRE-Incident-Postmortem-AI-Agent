"""Application configuration module using Pydantic Settings."""

from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = (BASE_DIR / "opsmind.db").as_posix()


class Settings(BaseSettings):
    PROJECT_NAME: str = "OpsMind SRE & Incident Postmortem AI Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_flag(cls, v: Union[str, bool, int, None]) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.strip().lower() in ("true", "1", "yes", "on", "debug", "dev", "development")
        return bool(v) if v is not None else True

    # Security & JWT
    SECRET_KEY: str = "hackwithhyderabad-opsmind-super-secure-secret-key-3.0"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{DEFAULT_DB_PATH}"
    DB_ECHO: bool = False

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def resolve_sqlite_path(cls, v: str) -> str:
        if v.startswith("sqlite+aiosqlite:///./"):
            rel_name = v.replace("sqlite+aiosqlite:///./", "")
            return f"sqlite+aiosqlite:///{(BASE_DIR / rel_name).as_posix()}"
        return v

    # LLM Settings (Groq)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_FALLBACK_MODEL: str = "llama-3.1-8b-instant"
    GROQ_TEMPERATURE: float = 0.2
    GROQ_MAX_TOKENS: int = 2048
    GROQ_TIMEOUT_SECONDS: float = 30.0

    # Hindsight Persistent Memory Settings
    HINDSIGHT_API_URL: str = "http://localhost:8888"
    HINDSIGHT_API_KEY: str = ""
    HINDSIGHT_TIMEOUT_SECONDS: float = 30.0
    HINDSIGHT_BANK_PREFIX: str = "opsmind"
    HINDSIGHT_AUTO_RETAIN: bool = True

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

