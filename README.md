# LearnFlow (AI Tutor --- Structured MiniDocs)

LearnFlow is a structured AI tutor system designed to make explanations
actually learnable --- not just conversational.

Instead of generating long chat responses, every question becomes a
structured **MiniDoc** with:

-   **Topic**
-   **Core Idea**
-   **Worked Example**
-   **Self-Check Question**

Follow-up questions (Phase 2) live in a separate clarification panel to
keep the main knowledge clean and structured.

------------------------------------------------------------------------

## Why This Exists

Most AI tutors generate long answers that are hard to study from.\
LearnFlow enforces structured outputs with strict schema validation and
a multi-panel interface designed for learning --- not chatting.

------------------------------------------------------------------------

## Tech Stack

**Backend** - FastAPI - Pydantic (strict schema validation) - LLM
integration - JSON contract enforcement

**Frontend** - Next.js - React - Multi-panel layout architecture

------------------------------------------------------------------------

## Current Phase

**Phase 1 (Complete)** - Structured MiniDoc generation - Strict LLM
output validation - Retry-on-invalid-output logic - Clean multi-panel UI

**Phase 2 (In Progress)** - Ephemeral in-memory MiniDoc storage - Strict follow-up schema validation

------------------------------------------------------------------------

## Run Locally

### Backend

``` bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY inside .env
uvicorn main:app --reload --port 8000
```

### Frontend

``` bash
cd web
npm install
npm run dev
```

Then open:

http://localhost:3000

------------------------------------------------------------------------

## Example Flow

1.  Enter a question → generates a structured MiniDoc
2.  Review core idea + example
3.  Use the self-check question
4.  (Phase 2) Ask focused follow-up in clarify panel

------------------------------------------------------------------------

## Design Principles

-   Not a generic chat app
-   Structured learning over freeform responses
-   Strict JSON contracts for LLM discipline
-   Multi-phase roadmap architecture


