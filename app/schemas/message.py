"""Pydantic schemas for Messages."""

from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)
    sender: str = Field("user", pattern="^(user|agent|system)$")


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender: str
    content: str
    memories_recalled: Optional[str] = None
    reflection_summary: Optional[str] = None
    model_used: Optional[str] = None
    tokens_used: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

