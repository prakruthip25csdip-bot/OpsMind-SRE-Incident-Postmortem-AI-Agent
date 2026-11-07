"""Hindsight Persistent Memory Engine integrating Vectorize Hindsight SDK."""

import asyncio
from datetime import datetime, timezone
import json
from typing import Any, Dict, List, Optional
import httpx
from hindsight_client import Hindsight
from hindsight_client_api.models.recall_response import RecallResponse
from hindsight_client_api.models.reflect_response import ReflectResponse
from hindsight_client_api.models.retain_response import RetainResponse

from app.core.config import settings
from app.core.logging import logger


class HindsightEngine:
    """Enterprise wrapper around the official Hindsight SDK."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout: Optional[float] = None
    ):
        self.base_url = (base_url or settings.HINDSIGHT_API_URL).rstrip("/")
        self.api_key = api_key or (settings.HINDSIGHT_API_KEY if settings.HINDSIGHT_API_KEY else None)
        self.timeout = timeout if timeout is not None else getattr(settings, "HINDSIGHT_TIMEOUT_SECONDS", 2.0)
        self._client: Optional[Hindsight] = None

    @property
    def client(self) -> Hindsight:
        """Lazy initialization of the Hindsight SDK client."""
        if self._client is None:
            self._client = Hindsight(
                base_url=self.base_url,
                api_key=self.api_key,
                timeout=self.timeout
            )
        return self._client

    def build_bank_id(self, team_id: str, service_name: str) -> str:
        """Generate isolated, deterministic bank ID scoped by team and service."""
        clean_team = "".join(c if c.isalnum() else "_" for c in team_id.lower())
        clean_service = "".join(c if c.isalnum() else "_" for c in service_name.lower())
        return f"{settings.HINDSIGHT_BANK_PREFIX}_{clean_team}_{clean_service}"

    async def aretain(
        self,
        bank_id: str,
        content: str,
        context: Optional[str] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Store knowledge, postmortem facts, or incident resolutions into Hindsight."""
        try:
            logger.info(f"Retaining memory to Hindsight bank '{bank_id}' (content length: {len(content)})")
            response = await asyncio.wait_for(
                self.client.aretain(
                    bank_id=bank_id,
                    content=content,
                    context=context,
                    tags=tags or [],
                    metadata=metadata or {}
                ),
                timeout=self.timeout
            )
            return {
                "success": bool(response.success),
                "bank_id": bank_id,
                "items_count": getattr(response, "items_count", 1),
                "operation_id": getattr(response, "operation_id", None)
            }
        except Exception as exc:
            logger.warning(f"Hindsight aretain call failed (bank: {bank_id}): {exc}. Operating in resilient fallback mode.")
            return {
                "success": False,
                "bank_id": bank_id,
                "items_count": 0,
                "operation_id": None,
                "fallback_error": str(exc)
            }

    async def arecall(
        self,
        bank_id: str,
        query: str,
        max_tokens: int = 4096,
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Recall relevant past memories from Hindsight using semantic, temporal, and graph search."""
        try:
            logger.info(f"Recalling memories from Hindsight bank '{bank_id}' for query: '{query[:60]}...'")
            response = await asyncio.wait_for(
                self.client.arecall(
                    bank_id=bank_id,
                    query=query,
                    max_tokens=max_tokens,
                    tags=tags
                ),
                timeout=self.timeout
            )

            # Extract results and formatted prompt
            results_data = []
            if hasattr(response, "results") and response.results:
                for item in response.results:
                    if hasattr(item, "model_dump"):
                        results_data.append(item.model_dump())
                    elif isinstance(item, dict):
                        results_data.append(item)
                    else:
                        results_data.append({"text": str(item)})

            formatted_prompt = ""
            if hasattr(response, "to_prompt_string"):
                try:
                    formatted_prompt = response.to_prompt_string()
                except Exception:
                    formatted_prompt = "\n".join(str(r.get("text", "")) for r in results_data if isinstance(r, dict))

            return {
                "bank_id": bank_id,
                "query": query,
                "total_memories": len(results_data),
                "memories": results_data,
                "formatted_prompt": formatted_prompt
            }
        except Exception as exc:
            logger.warning(f"Hindsight arecall call failed (bank: {bank_id}): {exc}. Returning empty memory set.")
            return {
                "bank_id": bank_id,
                "query": query,
                "total_memories": 0,
                "memories": [],
                "formatted_prompt": "No prior memories found (Hindsight service offline or empty bank).",
                "fallback_error": str(exc)
            }

    async def areflect(
        self,
        bank_id: str,
        query: str,
        budget: str = "low",
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """Ask Hindsight to reflect and synthesize mental models across accumulated memories."""
        try:
            logger.info(f"Reflecting on Hindsight bank '{bank_id}' with query: '{query[:60]}...'")
            response = await asyncio.wait_for(
                self.client.areflect(
                    bank_id=bank_id,
                    query=query,
                    budget=budget,
                    context=context
                ),
                timeout=self.timeout
            )
            reflection_text = getattr(response, "text", "") or ""
            based_on = getattr(response, "based_on", []) or []

            return {
                "bank_id": bank_id,
                "query": query,
                "reflection": reflection_text,
                "based_on_count": len(based_on),
                "based_on": based_on
            }
        except Exception as exc:
            logger.warning(f"Hindsight areflect call failed (bank: {bank_id}): {exc}. Returning empty reflection.")
            return {
                "bank_id": bank_id,
                "query": query,
                "reflection": "Reflection unavailable due to Hindsight offline mode.",
                "based_on_count": 0,
                "based_on": [],
                "fallback_error": str(exc)
            }

    async def health_check(self) -> Dict[str, Any]:
        """Check if Hindsight service is reachable."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as http_client:
                # Most Hindsight/FastAPI instances expose /health or /version
                resp = await http_client.get(f"{self.base_url}/health")
                if resp.status_code == 200:
                    return {"status": "healthy", "url": self.base_url, "code": resp.status_code}
                return {"status": "degraded", "url": self.base_url, "code": resp.status_code}
        except Exception as exc:
            return {"status": "unreachable", "url": self.base_url, "error": str(exc)}


# Global singleton instance
hindsight_engine = HindsightEngine()
