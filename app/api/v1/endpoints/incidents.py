"""Incident management endpoints."""

from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.incident import (
    IncidentCreate,
    IncidentListResponse,
    IncidentResolve,
    IncidentResponse,
    IncidentUpdate
)
from app.schemas.runbook import RunbookActionCreate, RunbookActionResponse
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    incident_in: IncidentCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Create a new SRE incident and associate it with a team Hindsight memory bank."""
    service = IncidentService(db)
    return await service.create_incident(incident_in, current_user)


@router.get("", response_model=IncidentListResponse)
async def list_incidents(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    service_name: Optional[str] = Query(None, description="Filter by service name"),
    severity: Optional[str] = Query(None, description="Filter by severity (P1-P4)"),
    status: Optional[str] = Query(None, description="Filter by status (open, investigating, resolved)"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """List SRE incidents with pagination and filters."""
    service = IncidentService(db)
    skip = (page - 1) * page_size
    items, total = await service.list_incidents(
        service_name=service_name,
        severity=severity,
        status=status,
        skip=skip,
        limit=page_size
    )
    return IncidentListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Retrieve details of a single incident."""
    service = IncidentService(db)
    return await service.get_incident(incident_id)


@router.patch("/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: str,
    incident_update: IncidentUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Update incident metadata, triage notes, or status."""
    service = IncidentService(db)
    return await service.update_incident(incident_id, incident_update)


@router.post("/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: str,
    resolve_in: IncidentResolve,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Mark incident resolved and automatically persist the verified postmortem to Hindsight."""
    service = IncidentService(db)
    return await service.resolve_incident(incident_id, resolve_in, current_user)


@router.post("/{incident_id}/runbooks", response_model=RunbookActionResponse, status_code=status.HTTP_201_CREATED)
async def add_runbook_action(
    incident_id: str,
    action_in: RunbookActionCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Record an operational runbook action executed during incident triage."""
    service = IncidentService(db)
    return await service.add_runbook_action(incident_id, action_in, current_user)


@router.get("/{incident_id}/runbooks", response_model=List[RunbookActionResponse])
async def list_runbook_actions(
    incident_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """List all runbook actions executed for an incident."""
    service = IncidentService(db)
    return await service.get_runbook_actions(incident_id)

