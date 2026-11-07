"""Groq LLM Client supporting async completions, retries, and fallback."""

import asyncio
import json
from typing import Any, Dict, List, Optional
try:
    from groq import AsyncGroq
except ImportError:
    AsyncGroq = None

from app.core.config import settings
from app.core.exceptions import LLMServiceError
from app.core.logging import logger


class LLMClient:
    """Enterprise LLM wrapper for Groq with automatic retry and graceful fallback."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        default_model: Optional[str] = None,
        timeout: float = 30.0
    ):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.default_model = default_model or settings.GROQ_MODEL
        self.fallback_model = settings.GROQ_FALLBACK_MODEL
        self.timeout = timeout
        self._client: Optional[AsyncGroq] = None

    @property
    def client(self) -> Optional[AsyncGroq]:
        """Lazy initialization of AsyncGroq client."""
        if self._client is None and self.api_key and "your_groq_api_key" not in self.api_key:
            self._client = AsyncGroq(
                api_key=self.api_key,
                timeout=self.timeout
            )
        return self._client

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None,
        response_format: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Generate LLM response with automatic retries and fallback."""
        temp = temperature if temperature is not None else settings.GROQ_TEMPERATURE
        tokens = max_tokens or settings.GROQ_MAX_TOKENS
        selected_model = model or self.default_model

        # If no Groq API Key configured or placeholder dummy key, use deterministic simulated SRE response
        if not self.api_key or not self.client or "your_groq_api_key" in self.api_key:
            logger.info("GROQ_API_KEY is not configured or in mock test mode. Returning heuristic SRE response.")
            return self._generate_simulated_sre_response(messages)

        attempts = 0
        max_attempts = 3
        current_model = selected_model

        while attempts < max_attempts:
            attempts += 1
            try:
                logger.info(f"Calling Groq LLM (model={current_model}, attempt={attempts})")
                kwargs: Dict[str, Any] = {
                    "model": current_model,
                    "messages": messages,
                    "temperature": temp,
                    "max_tokens": tokens,
                }
                if response_format:
                    kwargs["response_format"] = response_format

                response = await self.client.chat.completions.create(**kwargs)
                content = response.choices[0].message.content or ""
                total_tokens = response.usage.total_tokens if response.usage else 0

                return {
                    "content": content,
                    "model": current_model,
                    "tokens_used": total_tokens,
                    "is_simulated": False
                }

            except Exception as exc:
                logger.warning(f"Groq API call failed on attempt {attempts} with model {current_model}: {exc}")
                if attempts == 2 and self.fallback_model and current_model != self.fallback_model:
                    logger.info(f"Switching to fallback model: {self.fallback_model}")
                    current_model = self.fallback_model
                
                if attempts < max_attempts:
                    await asyncio.sleep(1.0 * attempts)
                else:
                    logger.error("All Groq API attempts exhausted. Falling back to heuristic diagnosis.")
                    return self._generate_simulated_sre_response(messages)

        raise LLMServiceError("Failed to generate LLM response from Groq.")

    def _generate_simulated_sre_response(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Deterministic heuristic response used when Groq credentials are not set."""
        last_user_message = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user_message = m.get("content", "")
                break

        # SRE heuristic analysis
        if "postmortem" in last_user_message.lower():
            content = """# SRE Incident Postmortem (Automated by OpsMind)

## Executive Summary
This incident was diagnosed and correlated against historical postmortems in Hindsight. Previous similar outages indicated connection pool exhaustion and cascading timeout failures.

## Root Cause Analysis
High incoming concurrency saturated the available database connection pool, resulting in 504 Gateway Timeouts across upstream microservices.

## Lessons Learned & Hindsight Reflections
- **Past Fixes Applied**: Scaling pool size from 20 to 100 connections resolved identical symptoms in Incident P2-849.
- **Anti-Pattern Avoided**: Restarting pods without increasing DB connection max limits caused an immediate second wave of timeouts.

## Preventative Action Items
1. Deploy connection pooling proxy (PgBouncer).
2. Configure circuit breaker with exponential backoff on client queries.
3. Add Prometheus alerting threshold at 80% pool utilization.
"""
        else:
            content = f"""### OpsMind SRE Incident Diagnosis

**1. Root Cause Hypothesis**
Based on log analysis and memories retrieved from Hindsight, the symptoms point to **Connection Exhaustion & Upstream Timeout Cascade**.

**2. Historical Knowledge Applied (from Hindsight)**
- Recalled past incident where increasing replica count without increasing DB pool caused cascading lockups.
- Successfully applied runbook: scaling pool size to 80 connections resolved latency in 8 minutes.

**3. Recommended Immediate Actions**
```bash
# Check current active connections
kubectl exec -it db-primary-0 -- psql -U postgres -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"

# Scale up connection limit dynamically
kubectl patch deployment api-gateway -p '{{"spec":{{"template":{{"spec":{{"containers":[{{"name":"api","env":[{{"name":"DB_POOL_SIZE","value":"80"}}]}}]}}}}}}'
```

**4. Anti-Patterns to Avoid**
- DO NOT immediately restart all worker pods simultaneously; this triggers a connection stampede.
"""

        return {
            "content": content,
            "model": "simulated-sre-engine",
            "tokens_used": 350,
            "is_simulated": True
        }


# Global singleton instance
llm_client = LLMClient()
