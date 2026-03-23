# LearnFlow — Demo

> "The document explains itself as you read it."

LearnFlow is an AI learning workspace where a generated document explains itself as you read it.
Click any concept and understanding expands inline — no panel switch, no context loss.

---

## Core idea

Most AI learning tools make you leave the document to ask a question.
LearnFlow keeps understanding inside the document itself.
Every concept is clickable. Explanations appear inline and stay there.

---

## Demo features

| Feature | Description |
|---------|-------------|
| **MiniDoc** | A structured learning document generated from any topic |
| **Clickable concepts** | Technical terms are highlighted and interactive |
| **Inline Halo** | Click a concept → explanation expands inline, in place |
| **Clarify panel** | Ask multi-turn follow-up questions in the right panel |
| **FloatingAskPanel** | Select any text → ask a follow-up question inline |

---

## MiniDoc structure

Each generated document has five sections:

- **Hook** — why this topic matters right now
- **Core Idea** — the essential mechanism
- **Mental Model** — a concrete analogy
- **Worked Example** — a real scenario with optional code
- **Quick Checks** — three short self-test questions

---

## Run locally

**Requirements:** Python 3.11+, Node.js 18+, an OpenAI API key.

**Backend**

```bash
cd api
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then add your OPENAI_API_KEY
uvicorn main:app --reload
```

**Frontend**

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stack

- Frontend: Next.js · React · TypeScript · Tailwind CSS
- Backend: FastAPI · Python · Pydantic
- AI: OpenAI API
