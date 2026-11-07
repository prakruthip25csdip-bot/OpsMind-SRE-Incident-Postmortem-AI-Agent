# OpsMind – SRE & Incident Postmortem AI Agent

**IncidentIQ – Member 3 AI Agent Implementation**

**Member 3 AI Agent Implementation**  
An enterprise AI agent that analyzes software incidents, correlates historical incident telemetry, recalls previous solutions, and improves troubleshooting recommendations through **Hindsight persistent memory**.

---

## 📁 Module Structure

```
ai_agent/
  __init__.py           # Package exports for Member 2 integration
  agent.py              # Main AI Agent orchestrating Groq + Hindsight
  groq_client.py        # Groq client with structured JSON output & query extraction
  hindsight_client.py   # Official Hindsight Python SDK client wrapper
  memory_service.py     # Domain memory operations: retention, recall, reflection, outcomes
  prompts.py            # Prompt engineering for incident analysis & root cause ranking
  schemas.py            # Pydantic v2 data models for inputs, analyses, & outcomes
  config.py             # Central environment & credentials configuration (.env)
tests/
  test_agent.py         # Pytest test suite covering all 8 core workflows
  hindsight_test_server.py # Hindsight API server for offline test execution
run_tests.py            # Automated test runner script
requirements.txt        # Python package dependencies
.env                    # Active environment configuration
.env.example            # Environment template
```

---

## 🚀 Key Technologies

- **Python 3.10+** (Tested on Python 3.14)
- **Groq API**: High-speed LLM inference (`openai/gpt-oss-20b`, `llama-3.3-70b-versatile`)
- **Hindsight Python SDK (`hindsight-client`)**: Long-term persistent agent memory
- **Pydantic v2**: Strict schema validation & structured outputs
- **python-dotenv**: Environment configuration loading

---

## ⚙️ Configuration (`.env`)

Configure the following variables in your `.env` file:

```ini
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b

# Hindsight Persistent Memory Configuration
# For local instance: http://127.0.0.1:8888
# For Hindsight Cloud: https://api.hindsight.vectorize.io (requires HINDSIGHT_API_KEY)
HINDSIGHT_BASE_URL=http://127.0.0.1:8888
HINDSIGHT_API_KEY=
HINDSIGHT_BANK_ID=incidentiq-bank
HINDSIGHT_TIMEOUT=60.0
```

---

## 🔌 Integration Instructions for Member 2 (Backend)

Member 2 can directly import the primary API functions from `ai_agent`:

```python
from ai_agent import (
    process_incident,
    store_incident_outcome,
    get_memories,
    IncidentInput,
    OutcomeInput,
    IncidentAnalysis,
    OutcomeResult,
)
```

### 1. Process an Incident
Receives the incident, searches Hindsight memory, prompts Groq, determines root causes and prioritized troubleshooting recommendations, and retains the incident report in Hindsight:

```python
# In your FastAPI endpoint:
@app.post("/api/incidents/analyze", response_model=IncidentAnalysis)
async def analyze_incident_endpoint(payload: IncidentInput):
    # payload can be an IncidentInput instance, dict, or raw message string
    analysis: IncidentAnalysis = process_incident(
        message=payload.message,
        session_id=payload.session_id,
        service=payload.service,
        environment=payload.environment,
    )
    return analysis
```

### 2. Store Solution Outcome (Continuous Learning)
Records whether a developer's attempted fix worked or failed, retaining it in Hindsight so future incidents learn from this precedent:

```python
@app.post("/api/incidents/outcome", response_model=OutcomeResult)
async def record_outcome_endpoint(outcome: OutcomeInput):
    result: OutcomeResult = store_incident_outcome(outcome)
    return result
```

Example payload:
```json
{
  "service": "payments-gateway",
  "attempted_solution": "Switched connection pool to keep-alive and tuned socket read timeout to 8000ms.",
  "outcome": "success",
  "incident_summary": "High latency in payments-gateway with ReadTimeoutExceptions",
  "resolution_notes": "Upstream bank latency stabilized; p99 dropped to 280ms.",
  "session_id": "sess-checkout-482"
}
```

### 3. Query Stored Memories
Retrieve memories directly for dashboard visualization or search:

```python
@app.get("/api/memories")
async def list_memories(query: str, limit: int = 10):
    memories = get_memories(query=query, limit=limit)
    return {"memories": memories}
```

---

## 🧪 Running the Test Suite

Run all verification tests with:

```bash
python run_tests.py
```

Or using pytest:

```bash
pytest tests/test_agent.py -v -s
```

### Verified Test Cases:
1. **Groq Connection**: Validates Groq API authentication and model chat completion.
2. **Hindsight Connection**: Verifies connection and capability flags via official `client.get_version()`.
3. **Memory Retention**: Validates `client.retain()` with tags, metadata, and structured content.
4. **Memory Recall**: Tests multi-strategy recall via `client.recall()`.
5. **Memory Reflection**: Tests synthesis of historical trends via `client.reflect()`.
6. **Successful Solution Learning**: Verifies retention and tagging of working fixes.
7. **Failed Solution Learning**: Verifies retention of anti-patterns and failed troubleshooting steps.
8. **Repeated Incident Diagnosis**: Verifies the AI Agent retrieves past memories, cites working fixes, warns against failed retries, and returns structured `IncidentAnalysis`.
9. **Get Memories Query**: Confirms Member 2's direct search capability over stored memory units.

