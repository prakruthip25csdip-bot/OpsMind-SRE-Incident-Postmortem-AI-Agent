"""Main API v1 router compiling all domain endpoints."""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    agent,
    auth,
    conversations,
    feedback,
    health,
    hindsight,
    incidents,
    users
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(incidents.router)
api_router.include_router(conversations.router)
api_router.include_router(agent.router)
api_router.include_router(hindsight.router)
api_router.include_router(feedback.router)
api_router.include_router(health.router)

