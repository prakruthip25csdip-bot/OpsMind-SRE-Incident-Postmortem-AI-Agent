"""
hindsight_test_server.py - Lightweight local Hindsight API server for testing & offline development.
Implements the official Hindsight API specification (/version, retain, recall, reflect)
allowing the official hindsight-client Python SDK to perform real network operations.
"""

import sys
import uuid
import re
from datetime import datetime, timezone
from typing import Dict, List, Any
import uvicorn
from fastapi import FastAPI, Request

app = FastAPI(title="Hindsight Local Test Server", version="1.1.0")

# In-memory banks storage for local server testing
BANKS: Dict[str, List[Dict[str, Any]]] = {}


@app.get("/version")
async def get_version():
    """Version and features discovery endpoint matching Hindsight Cloud."""
    return {
        "api_version": "1.1.0",
        "features": {
            "observations": True,
            "mcp": True,
            "worker": False,
            "bank_config_api": True,
            "bank_llm_health": False,
            "file_upload_api": True,
            "document_export_api": True,
            "document_import_api": True,
            "audit_log": False,
            "llm_trace": False,
            "store_document_text": True,
        },
    }


@app.post("/v1/default/banks/{bank_id}/memories")
async def retain_memories(bank_id: str, request: Request):
    """Retain memory items into the designated bank."""
    body = await request.json()
    items = body.get("items", [])
    if bank_id not in BANKS:
        BANKS[bank_id] = []

    operation_id = f"op-{uuid.uuid4().hex[:12]}"

    for item in items:
        content = item.get("content", "")
        # Handle string or list of content blocks
        if isinstance(content, list):
            content_str = " ".join([b.get("text", "") for b in content if isinstance(b, dict)])
        else:
            content_str = str(content)

        memory_record = {
            "id": f"mem-{uuid.uuid4().hex[:8]}",
            "content": content_str,
            "metadata": item.get("metadata", {}),
            "tags": item.get("tags", []),
            "context": item.get("context", ""),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        BANKS[bank_id].append(memory_record)

    return {
        "success": True,
        "bank_id": bank_id,
        "items_count": len(items),
        "operation_id": operation_id,
        "operation_ids": [operation_id],
        "async": False,
    }


@app.post("/v1/default/banks/{bank_id}/memories/recall")
async def recall_memories(bank_id: str, request: Request):
    """Multi-strategy recall over stored bank memories."""
    body = await request.json()
    query = (body.get("query") or "").lower()
    query_tokens = set(re.findall(r"\w+", query))
    filter_tags = body.get("tags")

    bank_memories = BANKS.get(bank_id, [])
    scored_memories = []

    for mem in bank_memories:
        content = mem["content"].lower()
        mem_tags = mem.get("tags", [])

        # Filter by tags if specified
        if filter_tags and not any(t in mem_tags for t in filter_tags):
            continue

        # Score by token overlap and exact substring match
        score = 0.0
        if query in content:
            score += 2.0
        for token in query_tokens:
            if len(token) > 2 and token in content:
                score += 0.5

        scored_memories.append((score, mem))

    # Sort descending by score; if no scores, return most recent
    scored_memories.sort(key=lambda x: (x[0], x[1]["created_at"]), reverse=True)

    results = []
    for score, mem in scored_memories[:10]:
        results.append(
            {
                "id": mem["id"],
                "text": mem["content"],
                "type": "experience",
                "tags": mem["tags"],
                "metadata": mem["metadata"],
                "context": mem["context"],
                "scores": {
                    "final": float(score) if score > 0 else 0.5,
                    "semantic": 0.8,
                    "keyword": 0.8,
                    "reranker": None,
                },
            }
        )

    return {
        "results": results,
        "trace": None,
        "entities": {},
        "chunks": {},
        "source_facts": {},
    }


@app.post("/v1/default/banks/{bank_id}/reflect")
async def reflect(bank_id: str, request: Request):
    """Synthesize insights over stored memories."""
    body = await request.json()
    query = body.get("query", "")
    bank_memories = BANKS.get(bank_id, [])

    mem_count = len(bank_memories)
    outcomes = [m for m in bank_memories if "outcome" in m.get("tags", [])]
    successes = [m for m in outcomes if "outcome:success" in m.get("tags", [])]
    failures = [m for m in outcomes if "outcome:failure" in m.get("tags", [])]

    summary_lines = [
        f"Incident memory bank '{bank_id}' contains {mem_count} historical incidents/outcomes.",
        f"Recorded resolutions: {len(successes)} successful fixes, {len(failures)} failed attempts.",
    ]
    if successes:
        summary_lines.append(f"Proven successful fix precedent: {successes[-1]['content'][:150]}...")
    if failures:
        summary_lines.append(f"Recorded failed attempt warning: {failures[-1]['content'][:150]}...")

    reflection_text = "\n".join(summary_lines)

    return {
        "text": reflection_text,
        "based_on": {
            "memories": [],
            "mental_models": [],
            "directives": [],
        },
        "structured_output": None,
        "structured_output_error": None,
        "usage": {"tokens": 120},
    }


def start_server(host: str = "127.0.0.1", port: int = 8888):
    uvicorn.run(app, host=host, port=port, log_level="warning")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8888
    start_server(port=port)
