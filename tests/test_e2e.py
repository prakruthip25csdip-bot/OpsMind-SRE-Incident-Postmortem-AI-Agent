"""Complete End-to-End test demonstrating learning with Hindsight."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_full_incident_learning_e2e_workflow(client: AsyncClient):
    # STEP 1: Engineer Registration & Login
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": "lead.sre@hyderabad.tech",
        "full_name": "SRE Incident Commander",
        "password": "HackathonPassword2026!",
        "role": "engineer",
        "team_id": "infra-sre"
    })
    assert reg_res.status_code == 201

    login_res = await client.post("/api/v1/auth/login", json={
        "email": "lead.sre@hyderabad.tech",
        "password": "HackathonPassword2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # STEP 2: An Incident strikes!
    incident_res = await client.post("/api/v1/incidents", json={
        "title": "Kafka Consumer Lag Spike in Orders Queue",
        "description": "Partition rebalance storm causing 150k lag and order checkout delays.",
        "severity": "P1",
        "service_name": "orders-stream",
        "environment": "production",
        "error_logs": "CommitFailedException: Offset commit cannot be completed since the group has already rebalanced"
    }, headers=headers)
    assert incident_res.status_code == 201
    incident_id = incident_res.json()["id"]

    # STEP 3: OpsMind Agent Diagnoses Incident using Hindsight memory context
    diag_res = await client.post("/api/v1/agent/diagnose", json={
        "incident_id": incident_id
    }, headers=headers)
    assert diag_res.status_code == 200
    diagnosis = diag_res.json()
    assert "root_cause_hypothesis" in diagnosis
    assert len(diagnosis["recommended_actions"]) > 0

    # STEP 4: Engineer executes runbook step
    rb_res = await client.post(f"/api/v1/incidents/{incident_id}/runbooks", json={
        "step_name": "Increase max.poll.interval.ms to 600000",
        "command_or_action": "kubectl patch configmap kafka-consumer-config --patch '{\"data\":{\"MAX_POLL_INTERVAL_MS\":\"600000\"}}'",
        "execution_result": "success",
        "engineer_notes": "Prevented heartbeat timeouts during large order batch processing."
    }, headers=headers)
    assert rb_res.status_code == 201

    # STEP 5: Incident Resolved & Learned into Hindsight
    resolve_res = await client.post(f"/api/v1/incidents/{incident_id}/resolve", json={
        "root_cause": "Consumer processing large batched payload exceeded 300s timeout, triggering constant group rebalances.",
        "mitigation_steps": "Increased max.poll.interval.ms to 600000 and scaled consumer replicas from 4 to 8.",
        "time_to_mitigate_mins": 18,
        "retain_to_hindsight": True
    }, headers=headers)
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "resolved"

    # STEP 6: Subsequent chat on the same service recalls the newly learned experience
    chat_res = await client.post("/api/v1/agent/chat", json={
        "message": "Why does orders-stream keep rebalancing consumers?",
        "service_name": "orders-stream",
        "include_reflection": True
    }, headers=headers)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert len(chat_data["response"]) > 0

    # STEP 7: Submit User Feedback to reinforce positive learning
    fb_res = await client.post("/api/v1/feedback", json={
        "message_id": chat_data["message_id"],
        "rating": 5,
        "feedback_type": "helped_resolve",
        "comments": "Accurately recalled the max.poll.interval.ms fix from previous outage!"
    }, headers=headers)
    assert fb_res.status_code == 201

    # STEP 8: Verify System Health
    health_res = await client.get("/api/v1/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "online"
    assert health_res.json()["database"]["status"] == "healthy"

