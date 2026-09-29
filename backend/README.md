# CrisisPilot — Production Backend

> **Tagline**: *"Turn Sales Challenges Into Smart Decisions"*  
> **Core Differentiator**: **Organizational Decision Memory** powered by [HindSight by Vectorize](https://vectorize.io).

CrisisPilot is an enterprise AI decision-intelligence platform that empowers revenue, operations, and inventory executives to resolve business crises (excess inventory, falling sales, competitor price cuts, seasonal shifts) through evidence-based strategy recommendations grounded in historical organizational memory and deterministic financial simulations.

---

## 1. The Core Decision Loop

```
Past Crisis
    ↓
Decision Executed
    ↓
Real-World Outcome (Clearance %, Revenue, Margin, Post-Mortem)
    ↓
HindSight Memory Bank (Retain)
    ↓
New Crisis Occurs
    ↓
Historical Recall (Semantic Precedent Retrieval)
    ↓
Scenario Simulation (Deterministic Python Financial Math)
    ↓
AI Recommendation (Multi-Agent Synthesis & Risk Exposure)
    ↓
Executive Executes Decision
    ↓
Real Outcome Recorded
    ↓
HindSight Memory Updated (Continuous Learning)
```

---

## 2. Technology Stack

- **Framework**: Python 3.11+, FastAPI, ASGI (uvicorn)
- **Data Validation & Schemas**: Pydantic v2 with strict type validation
- **ORM & Database**: SQLAlchemy 2.x (asyncpg for PostgreSQL; aiosqlite for local/test execution)
- **Migrations**: Alembic (async environment configured)
- **Long-Term Organizational Memory**: HindSight by Vectorize (`hindsight-client`)
  - Dedicated memory banks per organization: `organization:{organization_id}:crisispilot`
  - Core operations: `retain`, `recall`, `reflect`
  - Fail-safe resilience: Graceful offline fallback to verified institutional precedents
- **AI / LLM Abstraction**: Groq (`llama-3.3-70b-versatile`) by default with OpenAI-compatible fallback
- **Deterministic Math**: Python-based pricing elasticity, clearance rate, effective margin, and Recharts projection points (no LLM hallucination of financial numbers)
- **Security**: JWT authentication (HS256), bcrypt password hashing, strict multi-tenant tenant isolation

---

## 3. Architecture

```
app/
├── main.py                     # FastAPI application entrypoint, middleware, health endpoints
├── api/
│   ├── deps.py                 # Dependency injection (get_db, get_current_user)
│   └── routes/
│       ├── auth.py             # Login, register, me
│       ├── organizations.py    # Organization profile
│       ├── dashboard.py        # Executive summary, active crises, recent decisions
│       ├── crises.py           # Crisis CRUD, SSE analysis stream (/analysis-stream)
│       ├── decisions.py        # Decision lifecycle, execution & outcome recording
│       ├── simulations.py      # Single simulation & multi-scenario Recharts comparison
│       ├── inventory.py        # Regional inventory snapshots, stock at risk
│       ├── memory.py           # HindSight semantic search, historical cases, insights
│       ├── insights.py         # 5 core organizational memory principles
│       ├── recommendations.py  # AI recommendation & objective regeneration
│       ├── reports.py          # 8-section Crisis Analysis Reports
│       ├── ai.py               # Conversational AI assistant with memory grounding
│       └── notifications.py    # Alerts and notifications
├── core/
│   ├── config.py               # Pydantic BaseSettings (.env loading)
│   ├── security.py             # JWT token creation & bcrypt hashing
│   ├── logging.py              # Structured JSON logging
│   └── exceptions.py           # Standardized error codes & AppException handlers
├── db/
│   ├── database.py             # Async engine, sessionmaker, init_db
│   ├── models/                 # SQLAlchemy 2.x models (GUID, UniversalJSON)
│   └── repositories/           # Async repository pattern for all entities
├── schemas/                    # Pydantic v2 input/output schemas
├── services/                   # Business logic layer
│   ├── memory_service.py       # HindSight retain, recall, and reflection
│   ├── crisis_service.py       # Crisis management & analysis orchestration
│   ├── decision_service.py     # Decision execution & HindSight outcome retention
│   ├── simulation_service.py   # Deterministic multi-scenario simulation engine
│   ├── inventory_service.py    # Inventory telemetry & holding cost calculations
│   └── report_service.py       # Executive report compilation
├── agents/                     # Multi-Agent Orchestration Architecture
│   ├── orchestrator.py         # Multi-Agent pipeline controller
│   ├── situation_agent.py      # Natural language extraction (no hallucinations)
│   ├── memory_agent.py         # HindSight query formulation & precedent retrieval
│   ├── strategy_agent.py       # Deterministic candidate ranking by objective
│   └── explanation_agent.py    # Probabilistic projections & risk disclosure
├── integrations/
│   ├── hindsight.py            # HindSight SDK client integration & resilience
│   └── llm.py                  # Groq & OpenAI provider abstraction with backoff
└── utils/
    └── calculations.py         # Deterministic financial math & Recharts timelines
```

---

## 4. Quickstart & Running Locally

### Option A: Local Development (Python Virtual Environment)

1. **Activate Virtual Environment**:
   ```powershell
   cd c:\CrisisPilot\backend
   .\.venv\Scripts\Activate.ps1
   ```

2. **Configure Environment**:
   Ensure `.env` contains your settings (or use SQLite default for zero-dependency local run):
   ```ini
   DATABASE_URL=sqlite+aiosqlite:///./crisispilot.db
   JWT_SECRET=supersecretcrisispilotjwtkeyforproductionandlocaldev2026
   LLM_PROVIDER=groq
   GROQ_API_KEY=your_groq_api_key_here
   HINDSIGHT_API_KEY=your_hindsight_api_key_here
   ```

3. **Run Seed Script**:
   ```bash
   python -m app.seed
   ```
   *Seeds Acme Retail, Sarah Morgan (admin), Product X (48,000 units, 90 days expiry), 12-month sales history, historical decisions, outcomes, and HindSight organizational memories.*

4. **Start Development Server**:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

5. **Access Interactive API Documentation**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### Option B: Docker Compose (PostgreSQL + Redis + FastAPI Backend)

```bash
docker compose up -d --build
```
This automatically boots:
- PostgreSQL 16 on port 5432
- Redis 7 on port 6379
- CrisisPilot Backend on port 8000 (runs migrations, seeds data, starts server)

---

## 5. Automated Testing & Verification

Run the automated pytest suite (12 unit and integration tests):
```bash
pytest -v
```

Run the end-to-end closed-loop validation script:
```bash
python verify_backend.py
```

### Verified Test Matrix:
- `test_health_endpoints`: Observability, PostgreSQL, and HindSight status.
- `test_auth_login_and_me`: JWT authentication and user profile retrieval.
- `test_multi_tenant_isolation`: Enforces that Organization A cannot access Organization B's crises or decisions (404/403 isolation).
- `test_simulations_comparison_api`: Multi-scenario comparison with Recharts timeline projection.
- `test_dashboard_summary_api`: Total inventory, stock-at-risk, and monitored SKU metrics.
- `test_discounted_price_calculation`: Deterministic price and unit margin calculations.
- `test_inventory_runway_calculation`: Shelf-life runway calculations.
- `test_deterministic_simulation_metrics`: Full simulation clearance, revenue, and margin outputs.
- `test_discount_elasticity_comparison`: Non-linear elasticity verification.
- `test_hindsight_bank_id_pattern`: Strict `organization:{org_id}:crisispilot` memory bank namespace isolation.
- `test_hindsight_retain_recall_reflect_workflow`: HindSight retain, semantic recall, and strategic reflection.
- `test_memory_service_case_and_insight_retrieval`: Precedent cases and institutional insights.

---

## 6. Seed Credentials for Acme Retail Demo

- **Organization**: Acme Retail (`11111111-1111-1111-1111-111111111111`)
- **Email**: `sarah.morgan@acmeretail.com`
- **Password**: `Password123!`
- **Active Demo Crisis ID**: `44444444-4444-4444-4444-444444444444` (Product X: 48,000 unsold units, 90 days expiry)
- **HindSight Memory Bank**: `organization:11111111-1111-1111-1111-111111111111:crisispilot`
