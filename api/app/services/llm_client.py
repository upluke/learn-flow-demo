from __future__ import annotations

from openai import OpenAI
from app.config import settings

_client = OpenAI(api_key=settings.openai_api_key)


async def generate_draft(prompt: str) -> str:
    resp = _client.responses.create(
        model=settings.openai_model,
        input=prompt,
        store=False,
    )
    return (resp.output_text or "").strip()
