"""Pydantic schemas for Runbook actions."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class RunbookActionCreate(BaseModel):
    step_name: str = Field(..., min_length=2, max_length=255)
    command_or_action: str = Field(..., min_length=2)
    execution_result: str = Field("pending", pattern="^(pending|success|failure|rolled_back)$")
    engineer_notes: Optional[str] = None


class RunbookActionUpdate(BaseModel):
    step_name: Optional[str] = None
    command_or_action: Optional[str] = None
    execution_result: Optional[str] = Field(None, pattern="^(pending|success|failure|rolled_back)$")
    engineer_notes: Optional[str] = None


class RunbookActionResponse(BaseModel):
    id: str
    incident_id: str
    step_name: str
    command_or_action: str
    execution_result: str
    engineer_notes: Optional[str] = None
    executed_by_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

