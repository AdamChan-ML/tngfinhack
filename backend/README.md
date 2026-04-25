# Financial Inclusion AI Orchestration Platform (Backend)

## 1. Project Overview

Financially underserved users are often declined for loans due to inconsistent cashflow, limited credit history, and low financial planning support.

This backend demonstrates a **multi-agent AI orchestration system** that turns raw user behavior into:
- structured financial insights,
- risk evaluation,
- growth recommendations,
- staged action plans,
- and friendly final coaching advice.

It is production-quality in structure, but hackathon-friendly in setup and mock support.

### UX-to-Backend Flow (Current Scope)

- User enters a **financial goal** in the UI (frontend integration comes later).
- UI sends prompt payload to backend `POST /analyze-user`.
- Backend orchestrator runs all agents and returns:
  - financial plan,
  - advisor-style explanation,
  - score.
- This repository currently implements the **backend only**.

---

## 2. Architecture Diagram (Text)

```text
POST /analyze-user
    ↓
FastAPI Route (app/routes/analyze.py)
    ↓
Orchestrator (app/orchestrator/flow.py)
    ↓
Insight Agent
    ↓
Risk Agent + Growth Agent (parallel)
    ↓
Planner Agent
    ↓
Coach Agent
    ↓
Alibaba Qwen Service (app/services/qwen_service.py)
    ↓
Structured API Response + score from AWS service simulation
```

### Agent Responsibilities
- **Insight Agent**: Summarizes financial behavior signals.
- **Risk Agent**: Conservative risk reasoning for loan readiness.
- **Growth Agent**: Improvement strategies (micro-savings, discipline).
- **Planner Agent**: Multi-stage roadmap.
- **Coach Agent**: Friendly explanation via Alibaba Qwen API.

> All agents use **QWEN-only** inference via the backend service layer.

### Cloud Integration
- **AWS (simulated)**: `compute_score(user_data)` in `aws_service.py`.
- **Alibaba Cloud (Qwen)**: prompt-to-text generation in `qwen_service.py`.

---

## 3. Setup Instructions

### Local Setup

- Python: **3.10+** recommended.
- Create virtual environment and install dependencies.
- Start the FastAPI server via Uvicorn.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Open API docs at: `http://localhost:8000/docs`

### AWS Setup (Simplified)

1. Create an IAM user in AWS Console with minimal programmatic access.
2. Create Access Keys.
3. Put keys into `.env`:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
4. (Optional) Replace `compute_score()` with:
   - Lambda invocation,
   - SageMaker endpoint call,
   - or data pipeline scoring.

> Current implementation is a deterministic simulation for local demo reliability.

### Alibaba Cloud Setup (Qwen)

1. Create an Alibaba Cloud account.
2. Open DashScope / Model Studio and create API credentials.
3. Put API key in `.env`:
   - `QWEN_API_KEY=...`
4. Optional model/endpoint override:
   - `QWEN_MODEL`
   - `QWEN_API_URL`

If `QWEN_API_KEY` is missing or call fails, the service returns a safe mock advice string.

---

## 4. Running the API

### Endpoint

- `POST /transaction-summary`
- `POST /transaction-summary-lines`
- `POST /transaction-summary-sample`
- `POST /analyze-user`

### Example cURL

```bash
curl -X POST "http://localhost:8000/transaction-summary" \
  -H "Content-Type: application/json" \
  -d '{
    "user_background": {
      "occupation": "E-hailing driver",
      "monthly_income": 3200,
      "monthly_expenses": 2500,
      "savings_balance": 1800,
      "existing_debt": 1200,
      "risk_tolerance": "medium",
      "notes": "Supports parents monthly"
    },
    "months": 3,
    "transactions_per_month": 18
  }'
```

```bash
curl -X POST "http://localhost:8000/transaction-summary-lines" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_lines": [
      "2026-03-01,3200.00,salary,Monthly salary payout",
      "2026-03-02,-85.40,groceries,AEON groceries",
      "2026-03-05,-250.00,utilities,Electricity and water bill"
    ]
  }'
```

```bash
curl -X POST "http://localhost:8000/transaction-summary-sample" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "transaction_lines_sample.txt"
  }'
```

```bash
curl -X POST "http://localhost:8000/analyze-user" \
  -H "Content-Type: application/json" \
  -d '{
    "user_background": {
      "occupation": "Freelancer",
      "monthly_income": 4200,
      "monthly_expenses": 3100,
      "savings_balance": 2500,
      "existing_debt": 900,
      "risk_tolerance": "medium",
      "notes": "Income can fluctuate each month"
    },
    "goal": "User wants a motorbike loan",
    "months": 3,
    "transactions_per_month": 18
  }'
```

---

## 5. Example Input/Output

### Request

```json
{
  "user_background": {
    "occupation": "Freelancer",
    "monthly_income": 4200,
    "monthly_expenses": 3100,
    "savings_balance": 2500,
    "existing_debt": 900,
    "risk_tolerance": "medium",
    "notes": "Income can fluctuate each month"
  },
  "goal": "User wants a motorbike loan",
  "transaction_summary": "Optional: output summary string from /transaction-summary",
  "transaction_lines": [
    "Optional: one-line transaction records (date,amount,category,description)"
  ],
  "months": 3,
  "transactions_per_month": 18
}
```

`user_background` is used to generate mock transaction records and a transaction summary. The summary is then injected into orchestration as the analysis `user_data` context.

If you call `/transaction-summary` first, you can pass its `summary` text into `transaction_summary` in `/analyze-user`; otherwise `/analyze-user` auto-generates the summary internally.

If you pass `transaction_lines`, the backend sends those lines to QWEN for richer behavior summarization, then injects that result into `analyze-user` to improve advisor and planner outputs.

You can find a ready mock file at `backend/mock_data/transaction_lines_sample.txt` (one transaction per line).

### Response (shape)

```json
{
  "insights": "...",
  "risk": "...",
  "growth": "...",
  "plan": "...",
  "final_advice": "...",
  "transaction_summary": "...",
  "score": 72,
  "planner": {
    "headline": "...",
    "goal": "...",
    "progress": 0,
    "score": 72,
    "quick_summary": ["..."],
    "guardrails": ["..."],
    "milestones": [
      {
        "title": "...",
        "hint": "...",
        "status": "in_progress",
        "optional": false
      }
    ],
    "stages": [
      {
        "title": "Short-Term",
        "timeframe": "1-2 months",
        "steps": ["..."]
      }
    ]
  }
}
```

---

## 6. Future Improvements

1. Add async queue orchestration and retries (Celery / distributed workers).
2. Persist analysis history and score trends (PostgreSQL + analytics).
3. Add policy rules engine for explainable eligibility constraints.
4. Add observability (OpenTelemetry traces, structured JSON logs, dashboards).
5. Add unit/integration tests + load tests for production hardening.
6. Replace mock AWS scoring with real feature store + model service.

---

## Project Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── routes/
│   │   └── analyze.py
│   ├── agents/
│   │   ├── common.py
│   │   ├── insight.py
│   │   ├── risk.py
│   │   ├── growth.py
│   │   ├── planner.py
│   │   └── coach.py
│   ├── orchestrator/
│   │   └── flow.py
│   ├── services/
│   │   ├── aws_service.py
│   │   └── qwen_service.py
│   └── models/
│       └── schemas.py
├── requirements.txt
├── .env.example
└── README.md
```

---

## Notes

- The system always remains runnable locally even without external API keys.
- When API keys are present, LangChain + Qwen are used for richer responses.
- Logging is enabled via `LOG_LEVEL` env var.
