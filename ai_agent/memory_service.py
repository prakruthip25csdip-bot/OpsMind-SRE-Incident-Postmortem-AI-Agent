"""
memory_service.py - Domain memory service for IncidentIQ.
Orchestrates incident retention, semantic recall, reflection over historical patterns,
and solution outcome persistence via Hindsight.
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

try:
    from .config import settings
    from .hindsight_client import hindsight_client, HindsightMemoryClient
    from .schemas import MemoryItem, OutcomeInput, OutcomeResult
except ImportError:
    from config import settings
    from hindsight_client import hindsight_client, HindsightMemoryClient
    from schemas import MemoryItem, OutcomeInput, OutcomeResult

logger = logging.getLogger("incidentiq.memory_service")


class IncidentMemoryService:
    """
    Service layer providing high-level incident memory operations over Hindsight.
    """

    def __init__(self, client: Optional[HindsightMemoryClient] = None):
        self.hindsight = client or hindsight_client

    def store_incident(
        self,
        message: str,
        session_id: Optional[str] = None,
        service: Optional[str] = None,
        environment: Optional[str] = None,
        severity: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Retain an incident report into Hindsight with appropriate tags and metadata.
        """
        tags = ["incident"]
        if service:
            tags.append(f"service:{service.lower()}")
        if severity:
            tags.append(f"severity:{severity.lower()}")
        if environment:
            tags.append(f"env:{environment.lower()}")

        meta = {
            "session_id": session_id or "default",
            "service": service or "unknown",
            "severity": severity or "unknown",
            "environment": environment or "unknown",
            "type": "incident_report",
            "recorded_at": datetime.now(timezone.utc).isoformat(),
        }
        if metadata:
            meta.update({k: str(v) for k, v in metadata.items()})

        # Structured content body
        content_lines = [
            f"Incident Report: {message.strip()}",
            f"Service: {service or 'Unspecified'}",
            f"Severity: {severity or 'Unspecified'}",
            f"Environment: {environment or 'Unspecified'}",
            f"Timestamp: {meta['recorded_at']}",
        ]
        content_body = "\n".join(content_lines)

        try:
            resp = self.hindsight.retain_incident(
                content=content_body,
                metadata=meta,
                tags=tags,
                context=f"Incident session {session_id or 'default'}",
            )
            logger.info(f"Successfully retained incident into Hindsight. Response: {resp}")
            return {
                "success": getattr(resp, "success", True),
                "bank_id": getattr(resp, "bank_id", self.hindsight.bank_id),
                "items_count": getattr(resp, "items_count", 1),
                "operation_id": getattr(resp, "operation_id", None),
            }
        except Exception as exc:
            logger.error(f"Failed to retain incident in Hindsight: {exc}")
            raise

    def retrieve_relevant_memories(
        self,
        query: str,
        service: Optional[str] = None,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve similar past incidents and outcomes using Hindsight multi-strategy recall.
        Returns a list of standardized memory dictionaries.
        """
        tags = ["incident"]
        if service:
            tags.append(f"service:{service.lower()}")

        try:
            recall_response = self.hindsight.recall_incidents(
                query=query,
                tags=None,  # Do not restrict tags strictly to allow cross-service learning
                budget="mid",
                max_tokens=4096,
            )

            memories: List[Dict[str, Any]] = []
            results = getattr(recall_response, "results", []) or []

            for res in results[:limit]:
                mem_dict = {
                    "id": getattr(res, "id", None),
                    "text": getattr(res, "text", ""),
                    "type": getattr(res, "type", "memory"),
                    "tags": getattr(res, "tags", []) or [],
                    "metadata": getattr(res, "metadata", {}) or {},
                    "scores": getattr(res, "scores", {}) or {},
                    "context": getattr(res, "context", None),
                }
                memories.append(mem_dict)

            logger.info(f"Retrieved {len(memories)} relevant memories from Hindsight for query '{query[:60]}'")
            return memories

        except Exception as exc:
            logger.error(f"Failed to recall memories from Hindsight: {exc}")
            # Propagate or return empty list depending on error
            raise

    def reflect_on_patterns(
        self,
        query: str,
        context: Optional[str] = None,
    ) -> Optional[str]:
        """
        Use Hindsight's reflect capability to synthesize recurring systemic issues,
        failure modes, and historical solution trends.
        """
        reflect_prompt = (
            f"Analyze incident history and synthesize any recurring failure patterns, "
            f"successful fixes, or dangerous anti-patterns relevant to: {query}"
        )

        try:
            reflect_response = self.hindsight.reflect_on_incidents(
                query=reflect_prompt,
                budget="low",
                context=context,
            )
            reflection_text = getattr(reflect_response, "text", "")
            return reflection_text if reflection_text else None
        except Exception as exc:
            logger.warning(f"Hindsight reflection encountered an error (continuing): {exc}")
            return None

    def store_outcome(
        self,
        attempted_solution: str,
        outcome: str,
        incident_summary: Optional[str] = None,
        resolution_notes: Optional[str] = None,
        session_id: Optional[str] = None,
        service: Optional[str] = None,
    ) -> OutcomeResult:
        """
        Retain an attempted solution outcome (success or failure) into Hindsight.
        Enables the agent to remember what worked and what didn't for future incidents.
        """
        norm_outcome = outcome.strip().lower()
        is_success = norm_outcome in ("success", "resolved", "worked", "true")
        outcome_label = "success" if is_success else "failure"

        tags = [
            "incident",
            "outcome",
            f"outcome:{outcome_label}",
        ]
        if service:
            tags.append(f"service:{service.lower()}")

        meta = {
            "session_id": session_id or "default",
            "service": service or "unknown",
            "outcome": outcome_label,
            "type": "solution_outcome",
            "recorded_at": datetime.now(timezone.utc).isoformat(),
        }

        # Formulate rich learning memory
        content_lines = [
            f"Incident Resolution Outcome: {outcome_label.upper()}",
            f"Incident Summary: {incident_summary or 'Unspecified incident'}",
            f"Attempted Solution: {attempted_solution.strip()}",
            f"Outcome: {outcome_label}",
            f"Resolution Notes: {resolution_notes or 'None provided'}",
            f"Service: {service or 'Unspecified'}",
            f"Result Evaluation: {'This solution successfully resolved the incident.' if is_success else 'This solution failed to resolve the incident and should be avoided or adapted.'}",
        ]
        content_body = "\n".join(content_lines)

        try:
            resp = self.hindsight.retain_outcome(
                content=content_body,
                metadata=meta,
                tags=tags,
                context=f"Outcome for session {session_id or 'default'}",
            )

            msg = (
                f"Successfully learned from {'successful' if is_success else 'failed'} "
                f"solution in Hindsight memory."
            )
            logger.info(msg)

            return OutcomeResult(
                status="success",
                outcome_retained=True,
                memory_id=getattr(resp, "operation_id", None) or getattr(resp, "bank_id", None),
                message=msg,
                details={
                    "outcome": outcome_label,
                    "service": service,
                    "attempted_solution": attempted_solution,
                    "hindsight_response": {
                        "success": getattr(resp, "success", True),
                        "bank_id": getattr(resp, "bank_id", None),
                    },
                },
            )
        except Exception as exc:
            logger.error(f"Failed to store outcome in Hindsight: {exc}")
            raise


# Global singleton instance
memory_service = IncidentMemoryService()

