"""Tests for Incidents, Runbooks, and Postmortem Resolution."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_and_get_incident(client: AsyncClient, auth_headers: dict):
    payload = {
        "title": "Payment Gateway 504 Timeout Cascade",
        "description": "High latency and 504 Gateway Timeouts observed on checkout API.",
        "severity": "P1",
        "service_name": "checkout-api",
        "environment": "production",
        "error_logs": "ERROR: database connection pool exhausted (max_pool=20)"
    }
    create_res = await client.post("/api/v1/incidents", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    incident = create_res.json()
    assert incident["title"] == payload["title"]
    assert incident["status"] == "open"
    assert incident["service_name"] == "checkout-api"
    assert "hindsight_bank_id" in incident

    incident_id = incident["id"]

    # Fetch incident
    get_res = await client.get(f"/api/v1/incidents/{incident_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == incident_id


@pytest.mark.asyncio
async def test_list_incidents_filter(client: AsyncClient, auth_headers: dict):
    # Create two incidents on different services
    inc1 = {
        "title": "Auth Redis OOM",
        "description": "Redis cache eviction failure causing login delays.",
        "severity": "P2",
        "service_name": "auth-service"
    }
    inc2 = {
        "title": "Billing Webhook Drop",
        "description": "Stripe webhook worker queue stalled.",
        "severity": "P3",
        "service_name": "billing-service"
    }
    await client.post("/api/v1/incidents", json=inc1, headers=auth_headers)
    await client.post("/api/v1/incidents", json=inc2, headers=auth_headers)

    # Filter by service_name
    res = await client.get("/api/v1/incidents?service_name=auth-service", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert all(i["service_name"] == "auth-service" for i in data["items"])


@pytest.mark.asyncio
async def test_runbook_actions_and_resolve(client: AsyncClient, auth_headers: dict):
    # 1. Create incident
    inc_payload = {
        "title": "Search Index Re-sync Lag",
        "description": "ElasticSearch replica shards unassigned.",
        "severity": "P2",
        "service_name": "search-index"
    }
    inc_res = await client.post("/api/v1/incidents", json=inc_payload, headers=auth_headers)
    incident_id = inc_res.json()["id"]

    # 2. Add runbook action
    rb_payload = {
        "step_name": "Reroute unassigned shards",
        "command_or_action": "POST /_cluster/reroute?retry_failed=true",
        "execution_result": "success",
        "engineer_notes": "All 4 unassigned shards re-allocated to node-3."
    }
    rb_res = await client.post(f"/api/v1/incidents/{incident_id}/runbooks", json=rb_payload, headers=auth_headers)
    assert rb_res.status_code == 201
    assert rb_res.json()["execution_result"] == "success"

    # 3. Resolve incident with Hindsight retention
    resolve_payload = {
        "root_cause": "Disk watermark reached 85% on node-2, triggering auto-unassignment of replica shards.",
        "mitigation_steps": "Purged 7-day-old audit logs and rerouted shards via cluster reroute API.",
        "time_to_mitigate_mins": 14,
        "retain_to_hindsight": True
    }
    resolve_res = await client.post(f"/api/v1/incidents/{incident_id}/resolve", json=resolve_payload, headers=auth_headers)
    assert resolve_res.status_code == 200
    resolved = resolve_res.json()
    assert resolved["status"] == "resolved"
    assert resolved["root_cause"] == resolve_payload["root_cause"]
    assert resolved["time_to_mitigate_mins"] == 14

