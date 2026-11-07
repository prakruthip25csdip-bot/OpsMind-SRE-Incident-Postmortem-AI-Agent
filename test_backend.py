import sys
from main import (
    get_health,
    handle_chat_message,
    get_memories,
    ingest_memory,
    get_memory_stats,
    get_customers,
    get_customer_by_id,
    get_tickets,
    create_ticket,
    ChatMessageRequest,
    MemoryIngestRequest,
    TicketCreateRequest
)

def test_all():
    print("=== Testing MemoraDesk Backend Endpoints Directly ===")
    
    # 1. Health check
    health = get_health()
    assert health["status"] == "ok"
    print("✓ get_health():", health["service"])
    
    # 2. Chat AI Agent message (Database timeout query)
    chat_req = ChatMessageRequest(
        conversationId="conv_001",
        customerId="cust_001",
        message="We have database pool timeout on Supabase under peak volume"
    )
    res = handle_chat_message(chat_req)
    assert "statement_timeout=15000" in res["codeSnippet"] or "statement_timeout=15000" in res["text"]
    assert len(res["retrievedMemories"]) > 0
    print(f"✓ handle_chat_message(): Recalled {len(res['retrievedMemories'])} memories in {res['latency']}")
    print(f"  AI Agent Response Preview: {res['text'][:90]}...")
    
    # 3. Chat AI Agent message (Webhook scenario)
    res_webhook = handle_chat_message(ChatMessageRequest(
        conversationId="conv_002",
        customerId="cust_002",
        message="Stripe webhook signature is failing with 400 Bad Request"
    ))
    assert "rawBody" in res_webhook["codeSnippet"]
    print("✓ handle_chat_message(Webhook): Verified rawBody code snippet returned")

    # 4. Memories
    memories = get_memories(category="all", search="")
    assert len(memories) >= 5
    print(f"✓ get_memories(): {len(memories)} persistent vector memories active")

    # 5. Ingest Memory
    ingest_req = MemoryIngestRequest(
        customerId="cust_001",
        customerName="Sarah Chen",
        category="solutions",
        title="Prisma connection pool optimization",
        content="Increased connection pool to 25 with statement_timeout=15000.",
        tags=["Prisma", "Supabase", "Pool"]
    )
    new_mem = ingest_memory(ingest_req)
    assert new_mem["id"].startswith("mem_")
    print(f"✓ ingest_memory(): Ingested memory ID {new_mem['id']}")

    # 6. Memory Stats
    stats = get_memory_stats()
    assert stats["totalMemories"] > 14000
    print(f"✓ get_memory_stats(): Total {stats['totalMemories']} vectors, hit rate: {stats['semanticHitRate']}%")

    # 7. Customers
    customers = get_customers(search="", plan="all")
    assert len(customers) >= 3
    print(f"✓ get_customers(): {len(customers)} customer accounts retrieved")

    # 8. Customer Detail with Memories
    cust_detail = get_customer_by_id("cust_001")
    assert len(cust_detail["memories"]) >= 2
    print(f"✓ get_customer_by_id('cust_001'): Retrieved {cust_detail['name']} with {len(cust_detail['memories'])} linked memories")

    # 9. Tickets
    tickets = get_tickets(status="all", priority="all", search="")
    assert len(tickets) >= 2
    print(f"✓ get_tickets(): {len(tickets)} tickets found")

    print("\n🎉 ALL BACKEND AND AI AGENT CORE LOGIC VERIFIED AND WORKING PERFECTLY!")

if __name__ == "__main__":
    test_all()
