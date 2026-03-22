from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ClarifyRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    doc_id: str
    question: str


class ClarifyResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    doc_id: str
    answer: str
    summary: str
    last_updated: datetime
