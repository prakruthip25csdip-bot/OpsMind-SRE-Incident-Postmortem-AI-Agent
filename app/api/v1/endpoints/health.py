"""Health check and system diagnostics endpoints."""

from typing import Annotated, Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.hindsight_engine import hindsight_engine
from app.ai.llm_client import llm_client
from app.api.deps import get_db
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health & Status"])


@router.get("")
async def health_check(db: Annotated[AsyncSession, Depends(get_db)]) -> Dict[str, Any]:
    """Comprehensive readiness probe checking database, Hindsight service, and LLM configuration."""
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {exc}"

    hindsight_status = await hindsight_engine.health_check()

    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": db_status,
            "url_scheme": settings.DATABASE_URL.split(":")[0]
        },
        "hindsight": hindsight_status,
        "llm": {
            "provider": "Groq",
            "model": settings.GROQ_MODEL,
            "configured": bool(settings.GROQ_API_KEY)
        }
    }

