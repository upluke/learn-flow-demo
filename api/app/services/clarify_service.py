from __future__ import annotations

import json
from fastapi import HTTPException

from app.models.clarify import ClarifyResponse
from app.models.minidoc import MiniDoc
from app.services.llm_client import generate_draft
from app.services.prompt_loader import load_prompt


def _build_prompt(doc: MiniDoc, question: str) -> str:
    base = load_prompt("clarify_v1.md")
    return base.replace("{{MINIDOC_JSON}}", doc.model_dump_json()).replace("{{QUESTION}}", question)


async def clarify_minidoc(doc: MiniDoc, question: str) -> ClarifyResponse:
    raw = await generate_draft(_build_prompt(doc, question))
    try:
        data = json.loads(raw.strip())
        return ClarifyResponse.model_validate(data)
    except Exception as e:
        raise HTTPException(status_code=502, detail={"error": "GENERATION_FAILED", "message": str(e)})
