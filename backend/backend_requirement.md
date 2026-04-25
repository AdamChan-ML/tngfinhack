You are a senior backend engineer.

Build a production-quality (but hackathon-friendly) backend system for a "Financial Inclusion AI Orchestration Platform".

## 🧩 Core Requirements

The system must:
- Use Python (FastAPI)
- Use LangChain for multi-agent orchestration
- Implement 4 agents:
  1. Insight Agent
  2. Risk Agent
  3. Growth Agent
  4. Planner Agent
  5. Coach Agent (final output, uses Alibaba Qwen API)

- Provide REST APIs
- Be modular and clean (separate services, agents, and orchestration)

---

## 🏗️ Architecture

Flow:

POST /analyze-user
    ↓
Orchestrator
    ↓
Insight Agent (analyze user financial data)
    ↓
Risk Agent + Growth Agent (parallel reasoning)
    ↓
Planner Agent (generate staged financial plan)
    ↓
Coach Agent (Qwen LLM generates user-friendly response)
    ↓
Return structured + human-readable output

---

## 📦 Project Structure

Generate code with this structure:

backend/
│
├── app/
│   ├── main.py              # FastAPI entrypoint
│   ├── routes/
│   │   └── analyze.py
│   ├── agents/
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
│
├── requirements.txt
├── .env.example
└── README.md

---

## ⚙️ API Requirements

### POST /analyze-user

Request:
{
  "user_data": "...string describing financial behavior...",
  "goal": "User wants a motorbike loan"
}

Response:
{
  "insights": "...",
  "risk": "...",
  "growth": "...",
  "plan": "...",
  "final_advice": "...",
  "score": 72
}

---

## 🤖 Agent Implementation

Use LangChain LLMChain for each agent.

### Insight Agent
- Analyze financial behavior
- Output structured summary

### Risk Agent
- Conservative analysis
- Highlight loan risks

### Growth Agent
- Suggest improvements (micro-saving, discipline)

### Planner Agent
- Generate multi-stage plan

### Coach Agent
- Uses Alibaba Qwen API
- Converts plan into simple, friendly explanation

---

## ☁️ Multi-Cloud Integration

### AWS (simulate or implement)
- Used for:
  - scoring
  - analytics
- Implement aws_service.py:
  - function: compute_score(user_data) → returns numeric score

### Alibaba Cloud (Qwen)

Implement qwen_service.py:
- function: call_qwen(prompt: str) → returns text
- Use placeholder API call (mock if needed)

Coach agent MUST call this service.

---

## 🔐 Environment Variables (.env)

Include:
OPENAI_API_KEY=
QWEN_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

---

## 📄 README Requirements

Generate a COMPLETE README.md including:

### 1. Project Overview
Explain:
- financial inclusion problem
- agent orchestration solution

### 2. Architecture Diagram (text-based is fine)

### 3. Setup Instructions

#### Local Setup
- Python version
- pip install
- run server

#### AWS Setup (Simplified)
Explain:
- create IAM user
- get access keys
- optional Lambda usage

#### Alibaba Cloud Setup (Qwen)
Explain:
- how to get API key
- how to call Qwen endpoint

### 4. Running the API

Example:
curl -X POST http://localhost:8000/analyze-user

### 5. Example Input/Output

### 6. Future Improvements

---

## 🧪 Additional Requirements

- Use pydantic models for request/response
- Add basic logging
- Keep code clean and readable
- Avoid overengineering
- Mock external APIs if needed

---

## 🎯 Goal

The final system should:
- demonstrate multi-agent reasoning
- show financial planning flow
- integrate multi-cloud concept (AWS + Alibaba)
- be runnable locally for demo

---

Now generate ALL files with full code.