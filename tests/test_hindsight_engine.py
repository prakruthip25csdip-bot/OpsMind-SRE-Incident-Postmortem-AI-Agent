"""Tests for Hindsight memory engine integration."""

import pytest
from app.ai.hindsight_engine import HindsightEngine


def test_bank_id_scoping_and_isolation():
    engine = HindsightEngine(base_url="http://localhost:8888")
    bank1 = engine.build_bank_id("team-alpha", "checkout-api")
    bank2 = engine.build_bank_id("team-beta", "checkout-api")
    bank3 = engine.build_bank_id("team-alpha", "search-service")

    assert bank1 != bank2  # Isolated across teams
    assert bank1 != bank3  # Isolated across services within same team
    assert "checkout_api" in bank1
    assert "team_alpha" in bank1


@pytest.mark.asyncio
async def test_hindsight_engine_fallback_and_recovery():
    """Verify HindsightEngine handles offline mode gracefully without crashing."""
    engine = HindsightEngine(base_url="http://localhost:8888", timeout=0.1)
    bank_id = "opsmind_sre_core_test"

    retain_res = await engine.aretain(
        bank_id=bank_id,
        content="Incident P1: PgBouncer pool exhaustion resolved by scaling pool to 120.",
        tags=["database", "p1"]
    )
    assert retain_res["bank_id"] == bank_id
    assert "success" in retain_res

    recall_res = await engine.arecall(
        bank_id=bank_id,
        query="What happened with db outage?"
    )
    assert recall_res["bank_id"] == bank_id
    assert "memories" in recall_res

    reflect_res = await engine.areflect(
        bank_id=bank_id,
        query="Reflect on recurring outages"
    )
    assert reflect_res["bank_id"] == bank_id
    assert "reflection" in reflect_res
