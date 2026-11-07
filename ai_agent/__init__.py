"""
IncidentIQ AI Agent Package.
Provides persistent memory-guided incident intelligence and troubleshooting analysis.
"""

from .agent import (
    agent,
    process_incident,
    store_incident_outcome,
    get_memories,
)
from .schemas import (
    IncidentInput,
    IncidentAnalysis,
    OutcomeInput,
    OutcomeResult,
    RootCause,
    TroubleshootingRecommendation,
    HistoricalIncidentPrecedent,
    MemoryItem,
)
from .groq_client import groq_client, GroqIncidentClient
from .hindsight_client import hindsight_client, HindsightMemoryClient
from .memory_service import memory_service, IncidentMemoryService
from .config import settings

__all__ = [
    # Primary API functions for Member 2 backend
    "process_incident",
    "store_incident_outcome",
    "get_memories",
    # Main Agent & Services
    "agent",
    "groq_client",
    "hindsight_client",
    "memory_service",
    "settings",
    # Data Schemas
    "IncidentInput",
    "IncidentAnalysis",
    "OutcomeInput",
    "OutcomeResult",
    "RootCause",
    "TroubleshootingRecommendation",
    "HistoricalIncidentPrecedent",
    "MemoryItem",
]

