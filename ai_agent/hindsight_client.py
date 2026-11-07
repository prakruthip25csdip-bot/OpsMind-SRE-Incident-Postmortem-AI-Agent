"""
hindsight_client.py - Official Hindsight Python SDK client integration.
Connects to configured Hindsight Cloud or local instance and implements
incident retention, multi-strategy recall, and reflection operations.
"""

import logging
from typing import List, Optional, Dict, Any, Union
try:
    from hindsight_client import (
        Hindsight,
        RetainResponse,
        RecallResponse,
        ReflectResponse,
    )
    from hindsight_client_api.exceptions import (
        ApiException,
        UnauthorizedException,
        NotFoundException,
    )
except ImportError:
    Hindsight = None
    RetainResponse = None
    RecallResponse = None
    ReflectResponse = None
    ApiException = Exception
    UnauthorizedException = Exception
    NotFoundException = Exception

try:
    from .config import settings
except ImportError:
    from config import settings

logger = logging.getLogger("incidentiq.hindsight")


class HindsightMemoryClient:
    """
    Client wrapper for Hindsight long-term agent memory.
    Implements retain_incident, recall_incidents, reflect_on_incidents, and retain_outcome
    using the official hindsight-client SDK.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        bank_id: Optional[str] = None,
        timeout: Optional[float] = None,
    ):
        self.base_url = (base_url or settings.HINDSIGHT_BASE_URL).rstrip("/")
        self.api_key = api_key if api_key is not None else settings.HINDSIGHT_API_KEY
        self.bank_id = bank_id or settings.HINDSIGHT_BANK_ID
        self.timeout = timeout or settings.HINDSIGHT_TIMEOUT

        # Instantiate official Hindsight SDK client
        if Hindsight:
            self.client = Hindsight(
                base_url=self.base_url,
                api_key=self.api_key if self.api_key else None,
                timeout=self.timeout,
                user_agent="IncidentIQ-Agent/1.0",
            )
        else:
            self.client = None
            logger.info("Hindsight SDK client not installed; running in local resilient mode.")

    def check_connection(self) -> Dict[str, Any]:
        """
        Verify connection to Hindsight instance by querying version and capabilities.
        Uses the official get_version() SDK method.
        """
        if not self.client:
            return {
                "status": "fallback_local",
                "base_url": self.base_url,
                "bank_id": self.bank_id,
                "note": "Using resilient memory fallback",
            }
        try:
            version_response = self.client.get_version()
            return {
                "status": "connected",
                "base_url": self.base_url,
                "api_version": getattr(version_response, "api_version", "unknown"),
                "features": getattr(version_response, "features", None),
                "bank_id": self.bank_id,
            }
        except UnauthorizedException as unauth:
            logger.error(f"Hindsight authentication error (401): {unauth}")
            return {
                "status": "unauthorized",
                "base_url": self.base_url,
                "error": "API key required or invalid. Please check HINDSIGHT_API_KEY.",
            }
        except Exception as exc:
            logger.error(f"Hindsight connection check failed: {exc}")
            return {
                "status": "error",
                "base_url": self.base_url,
                "error": str(exc),
            }

    def retain_incident(
        self,
        content: str,
        bank_id: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
        tags: Optional[List[str]] = None,
        document_id: Optional[str] = None,
        context: Optional[str] = None,
    ) -> RetainResponse:
        """
        Retain an incident report or initial telemetry into Hindsight persistent memory.

        Uses the official client.retain() method:
        - bank_id: Target memory bank
        - content: Unstructured or semi-structured incident description
        - metadata: Custom key-value pairs (e.g., severity, session_id, service)
        - tags: Classification tags (e.g., ['incident', 'outage'])
        """
        target_bank = bank_id or self.bank_id
        tags = tags or ["incident"]

        if not self.client:
            logger.info("Hindsight client offline; skipping remote retain.")
            return None

        logger.info(f"Retaining incident in bank '{target_bank}' with tags={tags}")
        try:
            response = self.client.retain(
                bank_id=target_bank,
                content=content,
                metadata=metadata,
                tags=tags,
                document_id=document_id,
                context=context,
            )
            return response
        except UnauthorizedException as unauth:
            logger.error(f"Hindsight 401 Unauthorized during retain: {unauth}")
            raise
        except Exception as exc:
            logger.error(f"Error retaining incident in Hindsight: {exc}")
            raise

    def recall_incidents(
        self,
        query: str,
        bank_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        types: Optional[List[str]] = None,
        budget: str = "mid",
        max_tokens: int = 4096,
    ) -> RecallResponse:
        """
        Recall relevant historical incidents, error traces, and previous solutions.

        Uses the official client.recall() method:
        - Multi-strategy retrieval (semantic, keyword, entity graph, temporal).
        - query: Incident error description or search text
        - tags: Tag filters if any
        - budget: Computational budget ('low', 'mid', 'high')
        """
        target_bank = bank_id or self.bank_id
        if not self.client:
            logger.info("Hindsight client offline; returning empty recall response.")
            return None
        logger.info(f"Recalling memories from bank '{target_bank}' for query: '{query[:80]}...'")

        try:
            response = self.client.recall(
                bank_id=target_bank,
                query=query,
                tags=tags,
                types=types,
                budget=budget,
                max_tokens=max_tokens,
            )
            return response
        except UnauthorizedException as unauth:
            logger.error(f"Hindsight 401 Unauthorized during recall: {unauth}")
            raise
        except Exception as exc:
            logger.error(f"Error recalling incidents from Hindsight: {exc}")
            raise

    def reflect_on_incidents(
        self,
        query: str,
        bank_id: Optional[str] = None,
        budget: str = "low",
        context: Optional[str] = None,
        tags: Optional[List[str]] = None,
    ) -> ReflectResponse:
        """
        Synthesize higher-order insights, systemic failure patterns, and mental models
        from the stored memory bank.

        Uses the official client.reflect() method.
        """
        target_bank = bank_id or self.bank_id
        if not self.client:
            logger.info("Hindsight client offline; skipping reflect.")
            return None
        logger.info(f"Reflecting on bank '{target_bank}' with prompt: '{query[:80]}...'")

        try:
            response = self.client.reflect(
                bank_id=target_bank,
                query=query,
                budget=budget,
                context=context,
                tags=tags,
            )
            return response
        except UnauthorizedException as unauth:
            logger.error(f"Hindsight 401 Unauthorized during reflect: {unauth}")
            raise
        except Exception as exc:
            logger.error(f"Error reflecting on incidents in Hindsight: {exc}")
            raise

    def retain_outcome(
        self,
        content: str,
        bank_id: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None,
        tags: Optional[List[str]] = None,
        document_id: Optional[str] = None,
        context: Optional[str] = None,
    ) -> RetainResponse:
        """
        Retain an incident resolution outcome (success or failure) into Hindsight persistent memory.
        Enables the agent to learn from both effective fixes and failed attempts.
        """
        target_bank = bank_id or self.bank_id
        tags = tags or ["incident", "outcome"]

        if not self.client:
            logger.info("Hindsight client offline; skipping retain_outcome.")
            return None

        logger.info(f"Retaining outcome in bank '{target_bank}' with tags={tags}")
        try:
            response = self.client.retain(
                bank_id=target_bank,
                content=content,
                metadata=metadata,
                tags=tags,
                document_id=document_id,
                context=context,
            )
            return response
        except UnauthorizedException as unauth:
            logger.error(f"Hindsight 401 Unauthorized during retain_outcome: {unauth}")
            raise
        except Exception as exc:
            logger.error(f"Error retaining outcome in Hindsight: {exc}")
            raise


# Global singleton Hindsight client instance
hindsight_client = HindsightMemoryClient()

