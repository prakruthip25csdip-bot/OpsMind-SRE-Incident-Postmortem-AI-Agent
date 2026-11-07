"""Pydantic schemas for SRE Incidents."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class IncidentBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    severity: str = Field("P2", pattern="^(P1|P2|P3|P4)$")
    service_name: str = Field(..., min_length=2, max_length=100)
    environment: str = Field("production", min_length=2, max_length=50)
    error_logs: Optional[str] = None


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    severity: Optional[str] = Field(None, pattern="^(P1|P2|P3|P4)$")
    status: Optional[str] = Field(None, pattern="^(open|investigating|mitigated|resolved)$")
    service_name: Optional[str] = None
    environment: Optional[str] = None
    error_logs: Optional[str] = None
    root_cause: Optional[str] = None
    mitigation_steps: Optional[str] = None
    time_to_mitigate_mins: Optional[int] = None


class IncidentResolve(BaseModel):
    root_cause: str = Field(..., min_length=10, description="Identified root cause of the incident")
    mitigation_steps: str = Field(..., min_length=10, description="Steps taken that successfully resolved the issue")
    time_to_mitigate_mins: Optional[int] = Field(None, ge=1)
    retain_to_hindsight: bool = Field(True, description="Whether to automatically store this resolution into Hindsight persistent memory bank")


class IncidentResponse(IncidentBase):
    id: str
    status: str
    root_cause: Optional[str] = None
    mitigation_steps: Optional[str] = None
    time_to_mitigate_mins: Optional[int] = None
    hindsight_bank_id: str
    created_by_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IncidentListResponse(BaseModel):
    items: List[IncidentResponse]
    total: int
    page: int
    page_size: int

