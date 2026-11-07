"""Pydantic schemas for Hindsight persistent memory operations."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class MemoryRetainRequest(BaseModel):
    bank_id: Optional[str] = Field(None, description="Target Hindsight bank ID. If omitted, uses team/service bank.")
    content: str = Field(..., min_length=5, description="Factual content, incident resolution, or SRE learning to retain")
    context: Optional[str] = Field(None, description="Optional situational context for the memory")
    tags: Optional[List[str]] = Field(default_factory=list, description="Categorization tags (e.g., ['k8s', 'p1', 'database'])")
    metadata: Optional[Dict[str, str]] = Field(default_factory=dict, description="Custom key-value metadata")


class MemoryRetainResponse(BaseModel):
    success: bool
    bank_id: str
    items_count: int = 1
    operation_id: Optional[str] = None
    message: str = "Memory successfully retained in Hindsight"


class MemoryRecallRequest(BaseModel):
    bank_id: Optional[str] = Field(None, description="Bank ID to query")
    query: str = Field(..., min_length=2, description="Semantic/keyword query to recall relevant past memories")
    max_tokens: int = Field(4096, ge=100, le=16384)
    tags: Optional[List[str]] = Field(default=None)


class MemoryUnitItem(BaseModel):
    id: Optional[str] = None
    text: str
    type: Optional[str] = None
    similarity: Optional[float] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}


class MemoryRecallResponse(BaseModel):
    bank_id: str
    query: str
    total_memories: int
    memories: List[Dict[str, Any]]
    formatted_prompt: Optional[str] = None


class MemoryReflectRequest(BaseModel):
    bank_id: Optional[str] = Field(None, description="Bank ID to reflect on")
    query: str = Field(..., min_length=3, description="Reflection question or synthesis prompt across memories")
    context: Optional[str] = None
    budget: str = Field("low", pattern="^(low|mid|high)$")


class MemoryReflectResponse(BaseModel):
    bank_id: str
    query: str
    reflection: str
    based_on_count: int
    based_on: List[Any] = []


class MemoryBankInfo(BaseModel):
    bank_id: str
    service_name: str
    team_id: str
    total_items: Optional[int] = 0

