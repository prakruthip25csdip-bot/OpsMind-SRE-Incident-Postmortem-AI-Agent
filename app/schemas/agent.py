"""Pydantic schemas for OpsMind AI Agent executions."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AgentChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message or query to OpsMind agent")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID or None to start new")
    service_name: Optional[str] = Field("default", description="Target service context")
    incident_id: Optional[str] = Field(None, description="Optional incident ID context")
    include_reflection: bool = Field(False, description="Whether to invoke Hindsight reflect for higher-level synthesis")
    auto_retain_learning: bool = Field(True, description="Whether to automatically retain valuable diagnostic insights to Hindsight")


class AgentChatResponse(BaseModel):
    response: str
    conversation_id: str
    message_id: str
    memories_recalled: List[Dict[str, Any]] = []
    reflection_summary: Optional[str] = None
    model_used: str
    tokens_used: Optional[int] = None
    memory_retained: bool = False


class DiagnoseIncidentRequest(BaseModel):
    incident_id: Optional[str] = Field(None, description="ID of incident in database to diagnose")
    service_name: Optional[str] = Field(None, description="Target service if incident_id not provided")
    error_logs: Optional[str] = Field(None, description="Stack trace or error logs")
    symptoms: Optional[str] = Field(None, description="Observed system symptoms")


class PastIncidentMatch(BaseModel):
    incident_id: Optional[str] = None
    summary: str
    similarity_score: Optional[float] = None
    historical_resolution: Optional[str] = None


class DiagnoseIncidentResponse(BaseModel):
    service_name: str
    root_cause_hypothesis: str
    confidence_level: str  # high, medium, low
    past_similar_incidents: List[Dict[str, Any]] = []
    past_learnings_applied: List[str] = []
    recommended_actions: List[str] = []
    anti_patterns_to_avoid: List[str] = []
    hindsight_bank_id: str


class GeneratePostmortemRequest(BaseModel):
    incident_id: str
    include_systemic_reflection: bool = Field(True, description="Query Hindsight reflect to identify repeat failure trends")


class GeneratePostmortemResponse(BaseModel):
    incident_id: str
    title: str
    service_name: str
    postmortem_markdown: str
    systemic_patterns: Optional[str] = None
    hindsight_retained: bool
    hindsight_bank_id: str

