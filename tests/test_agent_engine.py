"""Tests for OpsMind AI Agent Engine and Endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_agent_chat_endpoint(client: AsyncClient, auth_headers: dict):
    payload = {
        "message": "Payment service is logging connection timeout errors to Postgres.",
        "service_name": "payment-api",
        "include_reflection": True,
        "auto_retain_learning": True
    }
    response = await client.post("/api/v1/agent/chat", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 20
    assert "conversation_id" in data
    assert "message_id" in data
    assert isinstance(data["memories_recalled"], list)


@pytest.mark.asyncio
async def test_agent_diagnose_endpoint(client: AsyncClient, auth_headers: dict):
    payload = {
        "service_name": "inventory-api",
        "symptoms": "High 500 internal server error spikes after v2.4 rollout",
        "error_logs": "java.lang.OutOfMemoryError: Java heap space at com.inventory.BatchLoader"
    }
    response = await client.post("/api/v1/agent/diagnose", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["service_name"] == "inventory-api"
    assert "root_cause_hypothesis" in data
    assert "recommended_actions" in data
    assert "anti_patterns_to_avoid" in data


@pytest.mark.asyncio
async def test_agent_generate_postmortem(client: AsyncClient, auth_headers: dict):
    # 1. Create and resolve an incident
    inc_payload = {
        "title": "Auth Token Validation Outage",
        "description": "Public keys endpoint was unreachable.",
        "severity": "P1",
        "service_name": "auth-gateway"
    }
    inc_res = await client.post("/api/v1/incidents", json=inc_payload, headers=auth_headers)
    inc_id = inc_res.json()["id"]

    await client.post(f"/api/v1/incidents/{inc_id}/resolve", json={
        "root_cause": "JWKS endpoint certificate expired unexpectedly at midnight.",
        "mitigation_steps": "Rotated certificate and flushed cache.",
        "time_to_mitigate_mins": 25,
        "retain_to_hindsight": True
    }, headers=auth_headers)

    # 2. Trigger postmortem generation
    pm_res = await client.post("/api/v1/agent/generate-postmortem", json={
        "incident_id": inc_id,
        "include_systemic_reflection": True
    }, headers=auth_headers)

    assert pm_res.status_code == 200
    pm_data = pm_res.json()
    assert pm_data["incident_id"] == inc_id
    assert "postmortem_markdown" in pm_data
    assert "Postmortem" in pm_data["postmortem_markdown"]

