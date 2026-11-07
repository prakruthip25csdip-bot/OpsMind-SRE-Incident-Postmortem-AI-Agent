"""Pydantic schemas for agent feedback."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class FeedbackCreate(BaseModel):
    message_id: str
    rating: int = Field(..., ge=1, le=5, description="1 (poor) to 5 (excellent)")
    feedback_type: str = Field("accurate", pattern="^(accurate|hallucination|helped_resolve|irrelevant_memory)$")
    comments: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    message_id: str
    user_id: str
    rating: int
    feedback_type: str
    comments: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

