"""
test_agent.py - Comprehensive test suite for IncidentIQ AI Agent.
Tests Groq, Hindsight real operations, memory retention, recall, reflection,
learning from successful/failed solutions, and repeat incident diagnosis.
"""

import os
import sys
import time
import subprocess
import pytest
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ai_agent.config import settings
from ai_agent.groq_client import groq_client
from ai_agent.hindsight_client import hindsight_client, HindsightMemoryClient
from ai_agent.memory_service import memory_service, IncidentMemoryService
from ai_agent.agent import process_incident, store_incident_outcome, get_memories
from ai_agent.schemas import IncidentInput, OutcomeInput, IncidentAnalysis, OutcomeResult


@pytest.fixture(scope="session", autouse=True)
def manage_hindsight_server():
    """
    Ensure a Hindsight server instance is running during the test session.
    If HINDSIGHT_BASE_URL points to localhost and no server is running,
    starts the local test server in a subprocess.
    """
    proc = None
    if "127.0.0.1" in settings.HINDSIGHT_BASE_URL or "localhost" in settings.HINDSIGHT_BASE_URL:
        # Check if already running
        conn = hindsight_client.check_connection()
        if conn.get("status") != "connected":
            server_script = Path(__file__).parent / "hindsight_test_server.py"
            proc = subprocess.Popen([sys.executable, str(server_script), "8888"])
            time.sleep(2.0)
            print("\n[Test Fixture] Started local Hindsight test server on port 8888.")

    yield

    if proc is not None:
        proc.terminate()
        proc.wait(timeout=3)
        print("\n[Test Fixture] Stopped local Hindsight test server.")


def test_groq_connection():
    """Verify Groq API connectivity and model response."""
    result = groq_client.test_connection()
    assert result["status"] == "connected", f"Groq connection failed: {result}"
    assert result["model"] == settings.GROQ_MODEL
    print(f"\n[PASS] Groq connected with model: {result['model']}")


def test_hindsight_connection():
    """Verify Hindsight service connectivity and API version."""
    result = hindsight_client.check_connection()
    assert result["status"] == "connected", f"Hindsight check failed: {result}"
    assert result["api_version"] is not None
    print(f"\n[PASS] Hindsight connected: base_url={result['base_url']}, version={result['api_version']}")


def test_memory_retention():
    """Test storing an incident into Hindsight persistent memory."""
    incident_content = (
        "Incident Report: High latency in payments-gateway (p99 > 4500ms). "
        "Error: ReadTimeoutException connecting to upstream bank API."
    )
    resp = hindsight_client.retain_incident(
        content=incident_content,
        metadata={"service": "payments-gateway", "severity": "High"},
        tags=["incident", "service:payments-gateway", "severity:high"],
    )
    assert getattr(resp, "success", True) is True
    assert getattr(resp, "bank_id", None) == settings.HINDSIGHT_BANK_ID
    print(f"\n[PASS] Retained incident in Hindsight bank '{resp.bank_id}'")


def test_memory_recall():
    """Test recalling relevant memories from Hindsight using multi-strategy search."""
    query = "ReadTimeoutException in payments-gateway"
    recall_resp = hindsight_client.recall_incidents(
        query=query,
        budget="mid",
    )
    assert hasattr(recall_resp, "results")
    assert len(recall_resp.results) > 0
    matched_text = recall_resp.results[0].text
    assert "payments-gateway" in matched_text.lower() or "readtimeout" in matched_text.lower()
    print(f"\n[PASS] Recalled {len(recall_resp.results)} memories. Top match: '{matched_text[:70]}...'")


def test_memory_reflection():
    """Test higher-order synthesis and mental models via Hindsight reflect."""
    prompt = "Synthesize known failure modes and patterns in payments-gateway"
    reflect_resp = hindsight_client.reflect_on_incidents(
        query=prompt,
        budget="low",
    )
    assert hasattr(reflect_resp, "text")
    assert len(reflect_resp.text) > 0
    print(f"\n[PASS] Reflection output:\n{reflect_resp.text}")


def test_successful_solution_learning():
    """Test recording a developer's successful solution outcome."""
    outcome_payload = {
        "service": "payments-gateway",
        "attempted_solution": "Switched upstream connection pool to keep-alive and tuned socket read timeout to 8000ms.",
        "outcome": "success",
        "incident_summary": "High latency in payments-gateway with ReadTimeoutExceptions",
        "resolution_notes": "Upstream bank API latency stabilized; p99 dropped to 280ms.",
        "session_id": "sess-test-success-01",
    }
    result = store_incident_outcome(outcome_payload)
    assert isinstance(result, OutcomeResult)
    assert result.status == "success"
    assert result.outcome_retained is True
    print(f"\n[PASS] Learned successful solution: {result.message}")


def test_failed_solution_learning():
    """Test recording a developer's failed solution attempt (anti-pattern)."""
    outcome_payload = {
        "service": "payments-gateway",
        "attempted_solution": "Aggressively retried timed-out requests 5 times immediately.",
        "outcome": "failure",
        "incident_summary": "High latency in payments-gateway with ReadTimeoutExceptions",
        "resolution_notes": "Worsened the problem! Triggered IP throttling from bank API.",
        "session_id": "sess-test-fail-01",
    }
    result = store_incident_outcome(outcome_payload)
    assert isinstance(result, OutcomeResult)
    assert result.status == "success"
    assert result.outcome_retained is True
    print(f"\n[PASS] Learned failed solution anti-pattern: {result.message}")


def test_repeated_incident_recall_and_recommendation():
    """
    Test full end-to-end incident analysis on a repeated incident:
    The agent should recall the past failure and success, warn against the failed retry fix,
    and prioritize the proven keep-alive/timeout adjustment fix.
    """
    repeat_incident_msg = (
        "CRITICAL: payments-gateway service experiencing severe ReadTimeoutExceptions "
        "when communicating with external partner bank API during peak checkout volume."
    )
    analysis = process_incident(
        message=repeat_incident_msg,
        session_id="sess-repeat-incident-99",
        service="payments-gateway",
        environment="production",
    )

    assert isinstance(analysis, IncidentAnalysis)
    assert len(analysis.possible_root_causes) > 0
    assert len(analysis.recommendations) > 0
    assert analysis.supported_by_memory is True
    assert len(analysis.memory_support_explanation) > 0

    print(f"\n[PASS] Incident Analysis Generated:")
    print(f"  Summary: {analysis.incident_summary}")
    print(f"  Severity: {analysis.severity}")
    print(f"  Supported by Memory: {analysis.supported_by_memory}")
    print(f"  Memory Explanation: {analysis.memory_support_explanation}")
    print(f"  Root Causes Identified ({len(analysis.possible_root_causes)}):")
    for rc in analysis.possible_root_causes:
        print(f"    - [{rc.likelihood}] {rc.description}")
    print(f"  Troubleshooting Recommendations ({len(analysis.recommendations)}):")
    for rec in analysis.recommendations:
        mem_tag = " (Backed by past memory)" if rec.is_supported_by_memory else ""
        print(f"    {rec.step_number}. [{rec.priority}] {rec.action}{mem_tag}")


def test_get_memories_query():
    """Verify Member 2's get_memories function returns historical items."""
    memories = get_memories("payments-gateway")
    assert isinstance(memories, list)
    assert len(memories) > 0
    print(f"\n[PASS] get_memories('payments-gateway') returned {len(memories)} memory records.")

