# LearnFlow — Demo

> "The document explains itself as you read it."

LearnFlow is an AI learning workspace where clicking any concept in a document
expands an inline explanation — no panel switch, no context loss.

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
| **FloatingAskPanel** | Select any text → ask a follow-up question |

---

## MiniDoc structure

Each generated document has five sections:

- **Hook** — why this topic matters right now
- **Core Idea** — the essential mechanism
- **Mental Model** — a concrete analogy
- **Worked Example** — a real scenario with code if applicable
- **Quick Checks** — three short self-test questions

---

## Running locally

**Backend**

```bash
cd api
cp .env.example .env          # add your OPENAI_API_KEY
pip install -r requirements.txt
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

- Frontend: Next.js / React / TypeScript / Tailwind CSS
- Backend: FastAPI / Python
- AI: OpenAI API
