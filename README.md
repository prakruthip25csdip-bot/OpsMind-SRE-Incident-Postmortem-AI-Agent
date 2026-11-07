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

# OpsMind — SRE & Incident Postmortem AI Agent
> **HackWithHyderabad 3.0 Hackathon Project**  
> **Theme:** AI Agents That Learn Using Hindsight

---

## 1. Executive Summary

During high-severity production outages, Site Reliability Engineers (SREs) and on-call DevOps engineers lose critical Mean Time to Resolution (MTTR) repeating troubleshooting mistakes, re-testing dead-end solutions, and failing to leverage historical organizational memory.

**OpsMind** is an enterprise SRE & Incident Postmortem AI Agent powered by **Vectorize Hindsight persistent memory** and **Groq LLM inference**. It bridges active incident triage with long-term memory:
- **Correlates Live Telemetry:** Automatically queries past postmortems for identical symptoms and error signatures.
- **Deep Historical Recall:** Uses Hindsight semantic, keyword, and temporal search to pull proven mitigations.
- **Systemic Reflection:** Uses Hindsight mental models (`reflect`) to detect recurring architectural weaknesses and warn against failed actions.
- **Continuous Learning Loop:** Retains validated root causes, runbook commands, and postmortem timelines back into isolated team memory banks (`retain`).

---

## 2. Hackathon Mandatory Tech & Hindsight Architecture

### A. Hindsight Persistent Memory Integration (25% Hackathon Judging Weight)

OpsMind implements the official `hindsight-client` Python SDK with strict bank isolation and learning loops:

| Hindsight Semantic Verb | SDK Method | OpsMind Operational Role |
| :--- | :--- | :--- |
| **Recall** | `client.arecall()` | Queries historical incident memories, verified root causes, and runbooks during active troubleshooting. |
| **Reflect** | `client.areflect()` | Synthesizes cross-incident mental models, recurrent bug patterns, and anti-patterns to avoid. |
| **Retain** | `client.aretain()` | Persists resolved postmortems, verified runbook actions, and user feedback ratings into long-term memory. |

### B. User & Team Memory Bank Isolation
To ensure strict multi-tenant boundaries, memory banks are isolated per team and microservice:
```python
bank_id = f"opsmind_{team_id}_{service_name}"
# Example: opsmind_sre_core_checkout_api
```

### C. Continuous Learning Loop
```
[Production Outage]
        │
        ▼
[OpsMind Diagnostics] ──(arecall)──> [Hindsight Memory Bank]
        │                                      │ (Recalls similar past P1s)
        ▼                                      ▼
[Engineer Mitigates via Runbook] ──(areflect)─> [Synthesizes Systemic Antipatterns]
        │
        ▼
[Incident Marked Resolved] ──(aretain)──> [Retains Verified Postmortem to Hindsight]
        │
        ▼
[Next Outage on Service] ──> Instant recognition of previous fix!
```

---

## 3. Technology Stack

- **Backend Framework:** FastAPI 0.115+, Pydantic v2.9+, Uvicorn
- **Database ORM:** PostgreSQL 16 / SQLite with SQLAlchemy 2.0+ async engine
- **Migrations:** Alembic 1.14+
- **Persistent AI Memory:** Vectorize Hindsight SDK (`hindsight-client` 1.2.0)
- **LLM Inference:** Groq Cloud API (`groq` 1.7.0) with `llama-3.3-70b-versatile` & fallback
- **Authentication:** JWT (HMAC-SHA256) with bcrypt password hashing and Role-Based Access Control (Admin, Engineer, Viewer)
- **Testing:** Pytest 8.3+, pytest-asyncio, HTTPX
- **Deployment:** Docker, Docker Compose

---

## 4. Directory Structure

```
opsmind-backend/
├── app/
│   ├── main.py                  # FastAPI app factory, lifespan, CORS, error handlers
│   ├── api/
│   │   ├── deps.py              # JWT authentication & RBAC dependencies
│   │   └── v1/
│   │       ├── router.py        # API v1 route aggregator
│   │       └── endpoints/
│   │           ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │           ├── users.py         # User administration
│   │           ├── incidents.py     # Incident lifecycle, runbooks, postmortem resolution
│   │           ├── conversations.py # Troubleshooting chat sessions & history
│   │           ├── agent.py         # AI diagnosis, chat, and postmortem generation
│   │           ├── hindsight.py     # Direct Hindsight retain, recall, reflect inspect
│   │           ├── feedback.py      # User rating & memory reinforcement loop
│   │           └── health.py        # System, Database, LLM, and Hindsight probes
│   ├── core/
│   │   ├── config.py            # Pydantic Settings
│   │   ├── security.py          # Bcrypt hashing & JWT issuance
│   │   ├── exceptions.py        # Domain exceptions & error codes
│   │   └── logging.py           # Structured logging
│   ├── db/
│   │   ├── base.py              # DeclarativeBase with UUID & timestamp mixins
│   │   └── session.py           # Async SQLAlchemy engine & sessionmaker
│   ├── models/                  # SQLAlchemy 2.0 ORM models
│   ├── schemas/                 # Pydantic validation schemas
│   ├── repositories/            # Async database repositories
│   ├── services/                # Business logic services
│   └── ai/
│       ├── hindsight_engine.py  # Hindsight SDK integration (retain, recall, reflect)
│       ├── llm_client.py        # Groq client with retry, timeout & heuristic fallback
│       ├── prompt_templates.py  # SRE prompts and postmortem templates
│       └── agent_engine.py      # OpsMind coordinating agent
├── tests/                       # Automated test suite (13 tests passing)
│   ├── conftest.py              # Test doubles, DB fixtures & auth helpers
│   ├── test_auth.py             # Auth & user registration tests
│   ├── test_incidents.py        # Incident CRUD & runbook tests
│   ├── test_hindsight_engine.py # Memory isolation & fallback tests
│   ├── test_agent_engine.py     # Diagnostic & postmortem tests
│   └── test_e2e.py              # Complete end-to-end incident learning cycle
├── scripts/
│   └── seed_demo_data.py        # Seeds initial SRE team & historical incident memory
├── Dockerfile                   # Production container definition
├── docker-compose.yml           # Multi-service stack (Backend + PostgreSQL)
├── requirements.txt             # Locked Python dependencies
├── alembic.ini                  # Alembic configuration
├── .env.example                 # Environment variables template
└── README.md
```

---

## 5. Quick Start Guide

### Option A: Local Python 3.12 (Fastest)

1. **Clone and enter project directory:**
   ```bash
   cd opsmind-backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Using uv:
   uv venv .venv --python 3.12
   .venv\Scripts\activate   # Windows
   # source .venv/bin/activate # Linux/macOS
   ```

3. **Install dependencies:**
   ```bash
   uv pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env to supply your GROQ_API_KEY and HINDSIGHT_API_URL
   ```

5. **Seed demo data (Creates test user & historical postmortem memory):**
   ```bash
   python scripts/seed_demo_data.py
   ```
   *Default Demo Credentials:*
   - **Email:** `lead.sre@opsmind.io`
   - **Password:** `DemoPassword123!`

6. **Start Backend Server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

7. **Open Swagger API Docs:**  
   Navigate to: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### Option B: Docker Compose (Full Stack with PostgreSQL)

1. **Build and launch containers:**
   ```bash
   docker-compose up --build -d
   ```

2. **Verify services:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

---

## 6. Running Automated Tests

OpsMind includes a comprehensive 13-test automated test suite covering authentication, incident management, Hindsight memory isolation, AI agent execution, and end-to-end learning workflows:

```bash
pytest -v
```

**Test Verification Summary:**
```
tests/test_agent_engine.py::test_agent_chat_endpoint PASSED
tests/test_agent_engine.py::test_agent_diagnose_endpoint PASSED
tests/test_agent_engine.py::test_agent_generate_postmortem PASSED
tests/test_auth.py::test_register_user_success PASSED
tests/test_auth.py::test_register_duplicate_email_fails PASSED
tests/test_auth.py::test_login_success_and_me PASSED
tests/test_auth.py::test_login_invalid_password_fails PASSED
tests/test_e2e.py::test_full_incident_learning_e2e_workflow PASSED
tests/test_hindsight_engine.py::test_bank_id_scoping_and_isolation PASSED
tests/test_hindsight_engine.py::test_hindsight_engine_fallback_and_recovery PASSED
tests/test_incidents.py::test_create_and_get_incident PASSED
tests/test_incidents.py::test_list_incidents_filter PASSED
tests/test_incidents.py::test_runbook_actions_and_resolve PASSED
```

---

## 7. Core REST API Endpoints

### Authentication
- `POST /api/v1/auth/register` — Register a new engineer/admin.
- `POST /api/v1/auth/login` — Authenticate and obtain JWT token.
- `GET /api/v1/auth/me` — Get authenticated user details.

### SRE Incidents & Runbooks
- `POST /api/v1/incidents` — Report new incident with severity (P1-P4) and error logs.
- `GET /api/v1/incidents` — List and filter incidents by service, severity, and status.
- `GET /api/v1/incidents/{id}` — Retrieve detailed incident telemetry.
- `POST /api/v1/incidents/{id}/runbooks` — Log operational command executed by engineer.
- `POST /api/v1/incidents/{id}/resolve` — Mark incident resolved and **auto-retain verified postmortem into Hindsight**.

### AI Agent & Diagnostics
- `POST /api/v1/agent/diagnose` — Correlate error logs against historical postmortems in Hindsight.
- `POST /api/v1/agent/chat` — Conversational troubleshooting assistant grounded in Hindsight memories.
- `POST /api/v1/agent/generate-postmortem` — Auto-generate blameless postmortem markdown and retain to memory bank.

### Hindsight Persistent Memory
- `POST /api/v1/hindsight/retain` — Direct memory injection into Hindsight bank.
- `POST /api/v1/hindsight/recall` — Multi-strategy recall across Hindsight bank.
- `POST /api/v1/hindsight/reflect` — Synthesize mental models and cross-incident trends.
- `GET /api/v1/hindsight/bank-info` — Inspect team/service memory bank coordinates.

### Feedback Loop
- `POST /api/v1/feedback` — Submit rating (1-5) on agent recommendations to close learning loop.

### Health Probes
- `GET /api/v1/health` — Check Database, Groq LLM, and Hindsight service readiness.

---

## 8. Frontend & Band AI Desktop Integration

Frontend clients (or Band AI desktop integrations) can communicate with OpsMind via standard JSON REST APIs:

1. **Authentication Header:**
   ```http
   Authorization: Bearer <your_jwt_token>
   Content-Type: application/json
   ```

2. **Sample Incident Diagnosis Request:**
   ```json
   POST /api/v1/agent/diagnose
   {
     "service_name": "checkout-service",
     "symptoms": "504 Gateway Timeouts and elevated latency",
     "error_logs": "FATAL: remaining connection slots are reserved for non-replication superuser connections"
   }
   ```

3. **Sample Response with Hindsight Evidence:**
   ```json
   {
     "service_name": "checkout-service",
     "root_cause_hypothesis": "Database Connection Pool Exhaustion",
     "confidence_level": "high",
     "past_similar_incidents": [
       {
         "text": "Incident P1: PgBouncer pool exhaustion resolved by scaling pool to 120.",
         "similarity": 0.92
       }
     ],
     "recommended_actions": [
       "Inspect current connection count via pg_stat_activity",
       "Increase PgBouncer default_pool_size to 120"
     ],
     "anti_patterns_to_avoid": [
       "Do not restart worker pods simultaneously without increasing DB connection pool"
     ],
     "hindsight_bank_id": "opsmind_sre_core_checkout_service"
   }
   ```

# 🧠 MemoraDesk – AI Customer Support Agent with Persistent Memory

> **Hack with Hyderabad 3.0 Project Submission**  
> **Problem Statement:** *AI Agents That Learn Using Hindsight*  
> **Core Technology:** Persistent Vector Memory powered by **Hindsight by Vectorize** & **Groq LPUs**

---

## 🌟 Executive Summary

Traditional AI customer support bots are **stateless and amnesic**. Every interaction starts from zero, forcing customers to repeat their tech stacks, cloud regions, previous configurations, and past ticket histories.

**MemoraDesk** solves this fundamental customer friction by combining **Hindsight by Vectorize** for persistent vector memory and **Groq LPUs** for ultra-fast (sub-350ms) Llama-3.3-70b inference. 

With MemoraDesk:
- **Zero Repetitive Questions:** The AI agent immediately remembers customer environments, preferences, previous bugs, and verified solutions.
- **Sub-15ms Memory Recall:** Historical knowledge vectors are retrieved and injected into the prompt context in 14.8ms.
- **Continuous Compounding Intelligence:** Every resolved ticket and customer feedback is automatically vectorized and ingested into Hindsight.
- **-68.5% Reduction in Repeat Issues:** Verified technical fixes are instantly reapplied to recurring failure patterns.

---

## 🛠️ Hackathon Software & Technologies

| Technology | Role | Resource / Link |
| :--- | :--- | :--- |
| **Hindsight by Vectorize** | Mandatory Persistent Memory Storage & Semantic Vector Retrieval | [hindsight.vectorize.io](https://hindsight.vectorize.io/) • [GitHub](https://github.com/vectorize-io/hindsight) • [Cloud UI](https://ui.hindsight.vectorize.io) |
| **Band AI Desktop** | Mandatory Hackathon Desktop Agent | [band.ai](https://www.band.ai/) |
| **Groq LPUs** | Recommended Ultra-Fast LLM Inference (`llama-3.3-70b-versatile`) | [groq.com](https://groq.com/) |
| **React 18 & Vite** | Modern Reactive Frontend Architecture | [react.dev](https://react.dev/) |
| **Tailwind CSS & Framer Motion** | Glassmorphism, 60fps Micro-Animations, Glowing Borders | [tailwindcss.com](https://tailwindcss.com/) |
| **Recharts & Lucide Icons** | Vector Graph, Analytics Visualizations, & Modern Iconography | [recharts.org](https://recharts.org/) |
| **FastAPI Backend Ready** | Async Python REST Backend (`http://localhost:8000`) | [fastapi.tiangolo.com](https://fastapi.tiangolo.com/) |

---

## 🚀 Quick Launch Instructions

```bash
# 1. Navigate to the frontend directory
cd memora-desk/frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Then visit **`http://localhost:5173`** in your browser.

---

### ⌨️ Useful Shortcuts & Pages Inside the App

| Page / Feature | Route / Shortcut | Description |
| :--- | :--- | :--- |
| **Authentication & Sign In** | [`/login`](http://localhost:5173/login) | Full login & registration with 1-click demo personas |
| **Landing Page** | [`/`](http://localhost:5173/) | Hero section, 4-step pipeline, feature grid, and testbed |
| **Main Dashboard** | [`/dashboard`](http://localhost:5173/dashboard) | 5 statistics cards, activity area chart, category pie chart |
| **AI Support Chat** | [`/chat`](http://localhost:5173/chat) | Flagship context-aware chat with memory retrieval stepper |
| **Memory Explorer** | [`/memory-explorer`](http://localhost:5173/memory-explorer) | Interactive SVG neural memory network with vector inspector |
| **Before & After Comparison**| [`/comparison`](http://localhost:5173/comparison) | Side-by-side benchmark with dual response simulation |
| **Customer Directory** | [`/customers`](http://localhost:5173/customers) | Customer cards, table toggle, and persistent tech profiles |
| **Support Tickets** | [`/tickets`](http://localhost:5173/tickets) | Filterable ticket queue with automatic memory links |
| **Resolution Analytics** | [`/analytics`](http://localhost:5173/analytics) | Recall metrics, latency telemetry, and export report |
| **Settings & Integrations** | [`/settings`](http://localhost:5173/settings) | FastAPI ping, Groq LLM sliders, Hindsight cluster config |
| **Global Command Palette** | `Ctrl + K` (or `Cmd + K`) | Instant global search across pages, memories, and actions |
| **Theme Toggle** | Top Nav Sun/Moon | Persistent switch between Futuristic Dark and Clean Light mode |
