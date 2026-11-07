"""
schemas.py - Pydantic schemas for IncidentIQ AI Agent.
Defines structured inputs, incident analyses, root causes, recommendations, and outcome models.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class IncidentInput(BaseModel):
    """Input payload for incident processing."""
    message: str = Field(..., description="The raw incident description, error log, or developer report.")
    session_id: Optional[str] = Field(None, description="Optional session or tracking ID.")
    service: Optional[str] = Field(None, description="Affected microservice or subsystem if known.")
    environment: Optional[str] = Field(None, description="Environment such as production, staging, or dev.")
    severity: Optional[str] = Field(None, description="Reported or initial severity level.")


class RootCause(BaseModel):
    """A plausible root cause identified during analysis."""
    description: str = Field(..., description="Description of the potential underlying root cause.")
    likelihood: Literal["High", "Medium", "Low"] = Field(..., description="Estimated probability of this cause.")
    evidence: str = Field(..., description="Supporting symptoms, error patterns, or stack trace clues.")
    supported_by_memory: bool = Field(
        default=False, 
        description="Whether this root cause is corroborated by historical incident memories."
    )


class TroubleshootingRecommendation(BaseModel):
    """A prioritized, actionable remediation or investigation step."""
    step_number: int = Field(..., description="Sequence or priority order of the action.")
    action: str = Field(..., description="Concrete troubleshooting action to perform.")
    priority: Literal["Critical", "High", "Medium", "Low"] = Field(..., description="Urgency priority level.")
    rationale: str = Field(..., description="Technical justification for taking this step.")
    is_supported_by_memory: bool = Field(
        default=False,
        description="True if this recommendation was derived from or validated by a past incident solution."
    )
    memory_reference: Optional[str] = Field(
        None,
        description="Contextual citation of the historical incident or previous solution that validates this step."
    )


class HistoricalIncidentPrecedent(BaseModel):
    """Historical context recalled from Hindsight persistent memory."""
    memory_id: Optional[str] = Field(None, description="Hindsight memory unit ID if available.")
    incident_summary: str = Field(..., description="Summary of the recalled past incident.")
    relevance: str = Field(..., description="Why this past incident is relevant to the current problem.")
    previous_outcome: Optional[str] = Field(None, description="Recorded past outcome: success, failure, or notes.")


class IncidentAnalysis(BaseModel):
    """Structured analytical response produced by the AI Agent."""
    incident_summary: str = Field(..., description="Executive summary of the reported incident.")
    severity: Literal["Critical", "High", "Medium", "Low"] = Field(
        default="High",
        description="Assessed severity based on business impact and error severity."
    )
    affected_systems: List[str] = Field(
        default_factory=list,
        description="List of detected services, databases, queues, or infrastructure components."
    )
    possible_root_causes: List[RootCause] = Field(
        default_factory=list,
        description="Ranked list of potential root causes."
    )
    recommendations: List[TroubleshootingRecommendation] = Field(
        default_factory=list,
        description="Prioritized, actionable troubleshooting steps."
    )
    supported_by_memory: bool = Field(
        default=False,
        description="True if any recommendations or root causes are backed by Hindsight memories."
    )
    memory_support_explanation: str = Field(
        default="",
        description="Clear explanation of which specific recommendations are supported by historical precedent."
    )
    relevant_historical_incidents: List[HistoricalIncidentPrecedent] = Field(
        default_factory=list,
        description="Recalled historical incidents and their outcomes from Hindsight."
    )
    memory_reflection: Optional[str] = Field(
        None,
        description="Higher-order synthesis and mental model insights generated via Hindsight reflect."
    )
    session_id: Optional[str] = Field(
        None,
        description="Session identifier associated with this incident analysis."
    )


class OutcomeInput(BaseModel):
    """Input payload to record the outcome of an attempted fix."""
    session_id: Optional[str] = Field(None, description="Session ID linked to the incident.")
    incident_id: Optional[str] = Field(None, description="Incident identifier if provided.")
    incident_summary: Optional[str] = Field(None, description="Brief summary of the incident being resolved.")
    attempted_solution: str = Field(..., description="The solution, code fix, config change, or restart attempted.")
    outcome: Literal["success", "failure", "resolved", "unresolved"] = Field(
        ...,
        description="Outcome of the attempted solution (e.g., 'success' or 'failure')."
    )
    resolution_notes: Optional[str] = Field(
        None,
        description="Observations, metrics, post-mortem notes, or reason for failure."
    )
    service: Optional[str] = Field(None, description="Subsystem or service name.")


class OutcomeResult(BaseModel):
    """Confirmation response after storing solution outcome in memory."""
    status: str = Field("success", description="Status code or indicator of the retention.")
    outcome_retained: bool = Field(True, description="Whether the memory was saved into Hindsight.")
    memory_id: Optional[str] = Field(None, description="Retained memory identifier from Hindsight.")
    message: str = Field(..., description="Human-readable status summary.")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata or response payload.")


class MemoryItem(BaseModel):
    """A memory unit retrieved from Hindsight memory bank."""
    id: Optional[str] = None
    text: str
    type: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    score: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

