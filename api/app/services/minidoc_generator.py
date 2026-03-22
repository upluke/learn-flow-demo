from __future__ import annotations

import json
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.models.minidoc import MiniDoc, MiniDocDraft, MiniDocSection, WorkedExampleSection
from app.services.llm_client import generate_draft
from app.services.prompt_loader import load_prompt


def _build_prompt(input_text: str) -> str:
    return load_prompt("minidoc_draft_v1.md").replace("{{INPUT}}", input_text)


def _parse(raw: str) -> MiniDocDraft:
    try:
        data = json.loads(raw.strip())
    except Exception as e:
        raise ValueError(f"Could not parse model output: {e}") from e
    if not isinstance(data, dict):
        raise ValueError("Expected a JSON object")
    return MiniDocDraft.model_validate(data)


def _dedup(concepts: list[str], seen: set[str]) -> list[str]:
    """Remove concept terms already used in a previous section."""
    unique = []
    for c in concepts:
        key = c.lower()
        if key not in seen:
            seen.add(key)
            unique.append(c)
    return unique


async def create_minidoc_from_input(input_text: str) -> MiniDoc:
    raw = await generate_draft(_build_prompt(input_text))
    try:
        draft = _parse(raw)
    except ValueError as e:
        raise HTTPException(status_code=502, detail={"error": "GENERATION_FAILED", "message": str(e)})

    # Normalise code newlines
    code = draft.worked_example.code_example.replace("\\n", "\n")

    # Remove any concept term that appears in more than one section
    seen: set[str] = set()
    core_concepts = _dedup(draft.core_idea.concepts, seen)
    mental_concepts = _dedup(draft.mental_model.concepts, seen)
    example_concepts = _dedup(draft.worked_example.concepts, seen)

    return MiniDoc(
        id=f"doc_{uuid4().hex[:12]}",
        topic=draft.topic,
        hook=draft.hook,
        core_idea=MiniDocSection(text=draft.core_idea.text, concepts=core_concepts),
        mental_model=MiniDocSection(text=draft.mental_model.text, concepts=mental_concepts),
        worked_example=WorkedExampleSection(
            text=draft.worked_example.text,
            concepts=example_concepts,
            code_example=code,
            code_breakdown=draft.worked_example.code_breakdown,
        ),
        quick_checks=draft.quick_checks,
        mastery=0.0,
        created_at=datetime.now(timezone.utc),
    )
