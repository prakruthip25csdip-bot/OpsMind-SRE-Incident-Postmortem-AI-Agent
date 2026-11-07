"""Conversation and chat history endpoints."""

from typing import Annotated, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationDetailResponse,
    ConversationResponse
)
from app.schemas.message import MessageResponse
from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conv_in: ConversationCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Start a new contextual troubleshooting session."""
    service = ConversationService(db)
    return await service.create_conversation(conv_in, current_user)


@router.get("", response_model=List[ConversationResponse])
async def list_conversations(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    skip: int = 0,
    limit: int = 50
):
    """List conversation sessions for current user."""
    service = ConversationService(db)
    return await service.list_conversations(user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Retrieve full conversation details including messages and memory telemetry."""
    service = ConversationService(db)
    return await service.get_conversation(conversation_id, load_messages=True)


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def list_conversation_messages(
    conversation_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    limit: int = 100
):
    """List all messages in chronological order for a specific conversation."""
    service = ConversationService(db)
    return await service.list_messages(conversation_id, limit=limit)

