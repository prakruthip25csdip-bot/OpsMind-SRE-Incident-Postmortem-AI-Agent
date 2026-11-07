"""
config.py - Central configuration management for IncidentIQ AI Agent.
Loads configuration and API credentials using python-dotenv and Pydantic Settings / os environment.
"""

import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Search and load .env from current directory, parent directory, and workspace root
env_paths = [
    Path.cwd() / ".env",
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
]

for p in env_paths:
    if p.exists():
        load_dotenv(dotenv_path=p, override=False)

# Also generic load_dotenv for any current environment location
load_dotenv()

class Settings:
    """Settings container for Groq and Hindsight integrations."""

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

    # Hindsight Configuration
    HINDSIGHT_API_KEY: Optional[str] = os.getenv("HINDSIGHT_API_KEY") or None
    HINDSIGHT_BASE_URL: str = (
        os.getenv("HINDSIGHT_BASE_URL")
        or ("https://api.hindsight.vectorize.io" if HINDSIGHT_API_KEY else "http://127.0.0.1:8888")
    ).rstrip("/")
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "incidentiq-bank")
    HINDSIGHT_TIMEOUT: float = float(os.getenv("HINDSIGHT_TIMEOUT", "60.0"))
    HINDSIGHT_MAX_ATTEMPTS: int = int(os.getenv("HINDSIGHT_MAX_ATTEMPTS", "3"))

    def validate(self) -> dict:
        """Validate critical environment configuration and return status dictionary."""
        return {
            "groq_configured": bool(self.GROQ_API_KEY),
            "groq_model": self.GROQ_MODEL,
            "hindsight_base_url": self.HINDSIGHT_BASE_URL,
            "hindsight_api_key_configured": bool(self.HINDSIGHT_API_KEY),
            "hindsight_bank_id": self.HINDSIGHT_BANK_ID,
        }

settings = Settings()
