"""Pydantic schemas for Conversations."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.message import MessageResponse


class ConversationCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    incident_id: Optional[str] = None
    service_name: str = Field("default", min_length=2, max_length=100)


class ConversationResponse(BaseModel):
    id: str
    title: str
    incident_id: Optional[str] = None
    user_id: str
    service_name: str
    hindsight_bank_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []

