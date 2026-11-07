"""AI Agent endpoints for real-time incident diagnosis and Hindsight-grounded chat."""

from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agent_engine import agent_engine
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.agent import (
    AgentChatRequest,
    AgentChatResponse,
    DiagnoseIncidentRequest,
    DiagnoseIncidentResponse,
    GeneratePostmortemRequest,
    GeneratePostmortemResponse
)
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/agent", tags=["AI Agent Engine"])


@router.post("/chat", response_model=AgentChatResponse)
async def chat_with_agent(
    chat_in: AgentChatRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Interact with OpsMind SRE Agent. Retrieves relevant Hindsight memories to ground responses."""
    result = await agent_engine.chat(
        db=db,
        user=current_user,
        message_content=chat_in.message,
        conversation_id=chat_in.conversation_id,
        service_name=chat_in.service_name or "default",
        incident_id=chat_in.incident_id,
        include_reflection=chat_in.include_reflection,
        auto_retain=chat_in.auto_retain_learning
    )
    return AgentChatResponse(**result)


@router.post("/diagnose", response_model=DiagnoseIncidentResponse)
async def diagnose_incident(
    req: DiagnoseIncidentRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Diagnose an active incident by correlating error logs with historical Hindsight memories."""
    service_name = req.service_name or "default"
    error_logs = req.error_logs or ""
    symptoms = req.symptoms or ""
    severity = "P2"

    if req.incident_id:
        incident_service = IncidentService(db)
        incident = await incident_service.get_incident(req.incident_id)
        service_name = incident.service_name
        error_logs = incident.error_logs or incident.description
        symptoms = incident.description
        severity = incident.severity

    result = await agent_engine.diagnose_incident(
        db=db,
        user=current_user,
        service_name=service_name,
        error_logs=error_logs,
        symptoms=symptoms,
        severity=severity
    )
    return DiagnoseIncidentResponse(**result)


@router.post("/generate-postmortem", response_model=GeneratePostmortemResponse)
async def generate_postmortem(
    req: GeneratePostmortemRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Generate an automated blameless postmortem and retain its key learnings into Hindsight."""
    incident_service = IncidentService(db)
    incident = await incident_service.get_incident(req.incident_id)

    result = await agent_engine.generate_postmortem(
        db=db,
        incident=incident,
        user=current_user,
        include_reflection=req.include_systemic_reflection
    )
    return GeneratePostmortemResponse(**result)

