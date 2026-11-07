"""Direct Hindsight Memory inspection and control endpoints."""

from typing import Annotated, Any, Dict, List
from fastapi import APIRouter, Depends, Query, status

from app.ai.hindsight_engine import hindsight_engine
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.hindsight import (
    MemoryBankInfo,
    MemoryRecallRequest,
    MemoryRecallResponse,
    MemoryReflectRequest,
    MemoryReflectResponse,
    MemoryRetainRequest,
    MemoryRetainResponse
)

router = APIRouter(prefix="/hindsight", tags=["Hindsight Memory Engine"])


@router.post("/retain", response_model=MemoryRetainResponse, status_code=status.HTTP_201_CREATED)
async def retain_memory(
    req: MemoryRetainRequest,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Directly store an SRE learning, runbook fact, or architectural decision into Hindsight."""
    target_bank = req.bank_id or hindsight_engine.build_bank_id(current_user.team_id, "general")
    result = await hindsight_engine.aretain(
        bank_id=target_bank,
        content=req.content,
        context=req.context,
        tags=req.tags,
        metadata=req.metadata
    )
    return MemoryRetainResponse(
        success=result.get("success", True),
        bank_id=target_bank,
        items_count=result.get("items_count", 1),
        operation_id=result.get("operation_id")
    )


@router.post("/recall", response_model=MemoryRecallResponse)
async def recall_memories(
    req: MemoryRecallRequest,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Perform parallel multi-strategy recall (vector, keyword, temporal, graph) across Hindsight memories."""
    target_bank = req.bank_id or hindsight_engine.build_bank_id(current_user.team_id, "general")
    result = await hindsight_engine.arecall(
        bank_id=target_bank,
        query=req.query,
        max_tokens=req.max_tokens,
        tags=req.tags
    )
    return MemoryRecallResponse(
        bank_id=target_bank,
        query=req.query,
        total_memories=result.get("total_memories", 0),
        memories=result.get("memories", []),
        formatted_prompt=result.get("formatted_prompt")
    )


@router.post("/reflect", response_model=MemoryReflectResponse)
async def reflect_on_memories(
    req: MemoryReflectRequest,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Synthesize high-level mental models and systemic postmortem reflections across memories."""
    target_bank = req.bank_id or hindsight_engine.build_bank_id(current_user.team_id, "general")
    result = await hindsight_engine.areflect(
        bank_id=target_bank,
        query=req.query,
        budget=req.budget,
        context=req.context
    )
    return MemoryReflectResponse(
        bank_id=target_bank,
        query=req.query,
        reflection=result.get("reflection", ""),
        based_on_count=result.get("based_on_count", 0),
        based_on=result.get("based_on", [])
    )


@router.get("/bank-info", response_model=MemoryBankInfo)
async def get_bank_info(
    service_name: str = Query("default", description="Service name"),
    current_user: Annotated[User, Depends(get_current_user)] = None
):
    """Get the active Hindsight memory bank coordinate scoped by user team and service."""
    bank_id = hindsight_engine.build_bank_id(current_user.team_id, service_name)
    return MemoryBankInfo(
        bank_id=bank_id,
        service_name=service_name,
        team_id=current_user.team_id,
        total_items=0
    )

