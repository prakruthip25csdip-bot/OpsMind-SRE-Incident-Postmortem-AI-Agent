"""
groq_client.py - Groq client wrapper for IncidentIQ.
Handles Groq API initialization, model prompting, and structured incident analysis.
"""

import json
import logging
from typing import List, Optional, Dict, Any
from groq import Groq

try:
    from .config import settings
    from .schemas import IncidentAnalysis, RootCause, TroubleshootingRecommendation, HistoricalIncidentPrecedent
    from .prompts import INCIDENT_ANALYSIS_SYSTEM_PROMPT, INCIDENT_ANALYSIS_USER_TEMPLATE, QUERY_EXTRACTION_PROMPT
except ImportError:
    from config import settings
    from schemas import IncidentAnalysis, RootCause, TroubleshootingRecommendation, HistoricalIncidentPrecedent
    from prompts import INCIDENT_ANALYSIS_SYSTEM_PROMPT, INCIDENT_ANALYSIS_USER_TEMPLATE, QUERY_EXTRACTION_PROMPT

logger = logging.getLogger("incidentiq.groq")


class GroqIncidentClient:
    """Wrapper around Groq API for incident analysis and reasoning."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model = model or settings.GROQ_MODEL
        if not self.api_key:
            logger.warning("GROQ_API_KEY is not set. Groq client calls will fail without valid key.")
        self.client = Groq(api_key=self.api_key)

    def test_connection(self) -> Dict[str, Any]:
        """Verify connectivity to Groq API and model availability."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "ping"}],
                max_tokens=10,
                temperature=0.0,
            )
            return {
                "status": "connected",
                "model": self.model,
                "response": response.choices[0].message.content.strip(),
            }
        except Exception as exc:
            logger.error(f"Groq connection test failed: {exc}")
            return {
                "status": "error",
                "model": self.model,
                "error": str(exc),
            }

    def extract_search_query(self, message: str) -> str:
        """Extract a concise search query from an incident message for Hindsight memory lookup."""
        if len(message.strip()) <= 120 and "\n" not in message:
            return message.strip()

        try:
            prompt = QUERY_EXTRACTION_PROMPT.format(incident_message=message[:2000])
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.1,
            )
            query = response.choices[0].message.content.strip().strip('"').strip("'")
            return query if query else message[:150]
        except Exception as exc:
            logger.warning(f"Query extraction via Groq failed, using fallback: {exc}")
            # Fallback: first two non-empty lines
            lines = [line.strip() for line in message.splitlines() if line.strip()]
            return " ".join(lines[:2])[:150] if lines else message[:150]

    def analyze_incident(
        self,
        message: str,
        session_id: Optional[str] = None,
        service: Optional[str] = None,
        environment: Optional[str] = None,
        recalled_memories: Optional[List[Dict[str, Any]]] = None,
        reflection_text: Optional[str] = None,
    ) -> IncidentAnalysis:
        """
        Send incident details and relevant memories to Groq to generate structured analysis,
        root causes, and memory-supported recommendations.
        """
        recalled_memories = recalled_memories or []
        
        # Format memories for the prompt
        if recalled_memories:
            formatted_memories = []
            for idx, m in enumerate(recalled_memories, 1):
                m_text = m.get("text", "")
                m_type = m.get("type", "memory")
                m_id = m.get("id", f"mem-{idx}")
                formatted_memories.append(f"[{idx}] (ID: {m_id}, Type: {m_type}): {m_text}")
            memories_block = "\n".join(formatted_memories)
        else:
            memories_block = "No previous incident memories found for this query."

        reflection_block = reflection_text or "No reflection insights available."

        user_content = INCIDENT_ANALYSIS_USER_TEMPLATE.format(
            incident_message=message,
            session_id=session_id or "unspecified",
            service=service or "unspecified",
            environment=environment or "unspecified",
            recalled_memories=memories_block,
            reflection_text=reflection_block,
        )

        try:
            chat_completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": INCIDENT_ANALYSIS_SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )

            raw_text = chat_completion.choices[0].message.content
            parsed_json = json.loads(raw_text)

            # Build and validate IncidentAnalysis model
            analysis = IncidentAnalysis(
                incident_summary=parsed_json.get("incident_summary", "Incident report analyzed."),
                severity=parsed_json.get("severity", "High"),
                affected_systems=parsed_json.get("affected_systems", []),
                possible_root_causes=[
                    RootCause(**rc) for rc in parsed_json.get("possible_root_causes", [])
                ],
                recommendations=[
                    TroubleshootingRecommendation(**rec) for rec in parsed_json.get("recommendations", [])
                ],
                supported_by_memory=bool(parsed_json.get("supported_by_memory", False)),
                memory_support_explanation=parsed_json.get("memory_support_explanation", ""),
                relevant_historical_incidents=[
                    HistoricalIncidentPrecedent(**hp) for hp in parsed_json.get("relevant_historical_incidents", [])
                ],
                memory_reflection=reflection_text,
                session_id=session_id,
            )

            return analysis

        except Exception as exc:
            logger.error(f"Structured incident analysis failed via Groq: {exc}")
            # Resilient fallback parsing / generation
            return self._build_fallback_analysis(message, session_id, service, recalled_memories, str(exc))

    def _build_fallback_analysis(
        self,
        message: str,
        session_id: Optional[str],
        service: Optional[str],
        recalled_memories: List[Dict[str, Any]],
        error_context: str,
    ) -> IncidentAnalysis:
        """Provide a safe fallback IncidentAnalysis structure if model call or parsing errors."""
        has_memories = bool(recalled_memories)
        precedents = []
        for m in recalled_memories[:3]:
            precedents.append(
                HistoricalIncidentPrecedent(
                    memory_id=m.get("id"),
                    incident_summary=m.get("text", "")[:100],
                    relevance="Similar error patterns found in historical memory.",
                    previous_outcome=m.get("metadata", {}).get("outcome"),
                )
            )

        return IncidentAnalysis(
            incident_summary=f"Automated incident analysis for: {message[:120]}...",
            severity="High",
            affected_systems=[service] if service else ["application-service"],
            possible_root_causes=[
                RootCause(
                    description=f"Unhandled runtime fault or resource exhaustion detected in {service or 'service'}.",
                    likelihood="High",
                    evidence=message[:200],
                    supported_by_memory=has_memories,
                )
            ],
            recommendations=[
                TroubleshootingRecommendation(
                    step_number=1,
                    action="Inspect service health checks, logs, and stack trace in monitoring dashboard.",
                    priority="Critical",
                    rationale="Pinpoint exact failure trigger and affected request paths.",
                    is_supported_by_memory=False,
                ),
                TroubleshootingRecommendation(
                    step_number=2,
                    action="Review database/downstream dependency connectivity and active connection pools.",
                    priority="High",
                    rationale="Prevent cascading timeouts or resource starvation across services.",
                    is_supported_by_memory=has_memories,
                    memory_reference="Corroborated by historical memory precedents." if has_memories else None,
                ),
            ],
            supported_by_memory=has_memories,
            memory_support_explanation="Retrieved prior incident data from memory bank." if has_memories else "No prior incident memories were found for this issue.",
            relevant_historical_incidents=precedents,
            session_id=session_id,
        )


# Global singleton client instance
groq_client = GroqIncidentClient()

