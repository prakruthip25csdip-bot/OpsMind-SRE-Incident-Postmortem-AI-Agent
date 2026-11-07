"""
agent.py - Main AI Incident Intelligence & Memory Agent for IncidentIQ.
Exposes process_incident, store_incident_outcome, and get_memories for Member 2's backend integration.
Orchestrates Hindsight memory recall/reflection and Groq structured inference.
"""

import logging
from typing import Union, Optional, Dict, Any, List
from datetime import datetime

try:
    from .schemas import (
        IncidentInput,
        IncidentAnalysis,
        OutcomeInput,
        OutcomeResult,
        RootCause,
        TroubleshootingRecommendation,
        HistoricalIncidentPrecedent,
    )
    from .groq_client import groq_client, GroqIncidentClient
    from .memory_service import memory_service, IncidentMemoryService
    from .hindsight_client import hindsight_client, HindsightMemoryClient
    from .config import settings
except ImportError:
    from schemas import (
        IncidentInput,
        IncidentAnalysis,
        OutcomeInput,
        OutcomeResult,
        RootCause,
        TroubleshootingRecommendation,
        HistoricalIncidentPrecedent,
    )
    from groq_client import groq_client, GroqIncidentClient
    from memory_service import memory_service, IncidentMemoryService
    from hindsight_client import hindsight_client, HindsightMemoryClient
    from config import settings

logger = logging.getLogger("incidentiq.agent")


class IncidentIQAgent:
    """
    IncidentIQ AI Agent integrating Groq structured reasoning with
    Hindsight long-term agent memory.
    """

    def __init__(
        self,
        groq: Optional[GroqIncidentClient] = None,
        memory: Optional[IncidentMemoryService] = None,
    ):
        self.groq = groq or groq_client
        self.memory = memory or memory_service

    def process_incident(
        self,
        message: Union[str, IncidentInput, Dict[str, Any]],
        session_id: Optional[str] = None,
        service: Optional[str] = None,
        environment: Optional[str] = None,
        retain_in_memory: bool = True,
    ) -> IncidentAnalysis:
        """
        Main incident analysis workflow:
        1. Receive incident input.
        2. Analyze and extract key error signatures for lookup.
        3. Retrieve similar incident memories and reflection from Hindsight.
        4. Send incident and memories to Groq for structured reasoning.
        5. Generate possible root causes with likelihood and evidence.
        6. Generate prioritized troubleshooting recommendations.
        7. Explain which recommendations are supported by previous incidents.
        8. Retain current incident in Hindsight for continuous learning.
        9. Return structured IncidentAnalysis.
        """
        # Step 1: Normalize input
        if isinstance(message, IncidentInput):
            incident_text = message.message
            session_id = message.session_id or session_id
            service = message.service or service
            environment = message.environment or environment
        elif isinstance(message, dict):
            incident_text = message.get("message", "")
            session_id = message.get("session_id", session_id)
            service = message.get("service", service)
            environment = message.get("environment", environment)
        else:
            incident_text = str(message)

        session_id = session_id or f"sess-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        logger.info(f"Processing incident for session '{session_id}': {incident_text[:100]}...")

        # Step 2: Extract search query for Hindsight memory lookup
        search_query = self.groq.extract_search_query(incident_text)
        logger.info(f"Generated Hindsight recall query: '{search_query}'")

        # Step 3: Retrieve similar historical memories and reflection from Hindsight
        recalled_memories: List[Dict[str, Any]] = []
        try:
            recalled_memories = self.memory.retrieve_relevant_memories(
                query=search_query,
                service=service,
                limit=5,
            )
            logger.info(f"Retrieved {len(recalled_memories)} memories from Hindsight.")
        except Exception as exc:
            logger.warning(f"Could not retrieve memories from Hindsight (proceeding): {exc}")

        reflection_text: Optional[str] = None
        try:
            reflection_text = self.memory.reflect_on_patterns(
                query=search_query,
                context=f"Incident in service '{service or 'unknown'}'",
            )
        except Exception as exc:
            logger.warning(f"Could not synthesize reflection from Hindsight: {exc}")

        # Step 4, 5, 6, 7: Send incident and relevant memories to Groq for structured analysis
        analysis: IncidentAnalysis = self.groq.analyze_incident(
            message=incident_text,
            session_id=session_id,
            service=service,
            environment=environment,
            recalled_memories=recalled_memories,
            reflection_text=reflection_text,
        )

        # Step 8: Retain the current incident in Hindsight for future recall
        if retain_in_memory:
            try:
                self.memory.store_incident(
                    message=incident_text,
                    session_id=session_id,
                    service=service,
                    environment=environment,
                    severity=analysis.severity,
                    metadata={"summary": analysis.incident_summary},
                )
                logger.info(f"Retained incident report for session '{session_id}' in Hindsight.")
            except Exception as exc:
                logger.warning(f"Could not retain incident report in Hindsight: {exc}")

        # Return structured results
        return analysis

    def store_incident_outcome(
        self,
        incident_data: Union[OutcomeInput, Dict[str, Any]],
    ) -> OutcomeResult:
        """
        Record the developer's attempted fix and whether it succeeded or failed.
        Retains the solution outcome in Hindsight so the agent learns for future incidents.
        """
        if isinstance(incident_data, OutcomeInput):
            data = incident_data
        elif isinstance(incident_data, dict):
            data = OutcomeInput(**incident_data)
        else:
            raise ValueError(f"Expected OutcomeInput or dict, got {type(incident_data)}")

        logger.info(
            f"Storing incident outcome '{data.outcome}' for attempted solution: "
            f"'{data.attempted_solution[:80]}...'"
        )

        return self.memory.store_outcome(
            attempted_solution=data.attempted_solution,
            outcome=data.outcome,
            incident_summary=data.incident_summary,
            resolution_notes=data.resolution_notes,
            session_id=data.session_id,
            service=data.service,
        )

    def get_memories(
        self,
        query: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Query and inspect stored Hindsight memories directly.
        Exposed for Member 2's backend search/memory views.
        """
        return self.memory.retrieve_relevant_memories(query=query, limit=limit)


# Global singleton agent
agent = IncidentIQAgent()


# Expose clean top-level functions for Member 2 integration:
def process_incident(
    message: Union[str, IncidentInput, Dict[str, Any]],
    session_id: Optional[str] = None,
    **kwargs,
) -> IncidentAnalysis:
    """
    Member 2 Entrypoint: Process an incident report, correlate historical memories,
    and return structured root causes and recommendations.
    """
    return agent.process_incident(message=message, session_id=session_id, **kwargs)


def store_incident_outcome(
    incident_data: Union[OutcomeInput, Dict[str, Any]],
) -> OutcomeResult:
    """
    Member 2 Entrypoint: Store a developer's solution outcome (success or failure)
    into Hindsight long-term memory.
    """
    return agent.store_incident_outcome(incident_data=incident_data)


def get_memories(
    query: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """
    Member 2 Entrypoint: Search and inspect historical memories stored in Hindsight.
    """
    return agent.get_memories(query=query, limit=limit)

