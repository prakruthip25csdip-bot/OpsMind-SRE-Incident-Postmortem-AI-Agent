"""FastAPI application entry point for OpsMind SRE Agent Backend."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.logging import logger
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and graceful shutdown."""
    logger.info("Initializing OpsMind application database and services...")
    # Auto-create tables for development/sqlite readiness
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database schemas verified.")
    yield
    logger.info("OpsMind application shutting down...")
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
### OpsMind — SRE & Incident Postmortem AI Agent
Built for **HackWithHyderabad 3.0** (Theme: *AI Agents That Learn Using Hindsight*).

#### Core Capabilities:
- **Persistent AI Memory**: Integrated directly with **Vectorize Hindsight SDK** (`retain`, `recall`, `reflect`).
- **Real-time Incident Copilot**: Correlates live error logs and traces against historical postmortems.
- **Continuous Learning Loop**: Retains validated resolutions and postmortems to prevent repeat outages.
- **Groq LLM Reasoning**: Fast inference powered by Groq Llama 3.3.
- **Enterprise SRE Workflows**: Incident tracking, runbook execution, blameless postmortem generation.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Centralized Exception Handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Centralized handler for all custom domain exceptions."""
    logger.warning(f"Domain exception on {request.method} {request.url.path}: {exc.message} ({exc.error_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details
        }
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unexpected runtime exceptions."""
    logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected internal server error occurred.",
            "details": str(exc) if settings.DEBUG else None
        }
    )


# Mount main API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
async def root():
    """Service metadata and API documentation entry points."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "theme": "AI Agents That Learn Using Hindsight",
        "docs_url": "/docs",
        "health_url": f"{settings.API_V1_STR}/health",
        "api_v1": settings.API_V1_STR
    }

