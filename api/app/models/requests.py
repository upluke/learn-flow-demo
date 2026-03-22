from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict


class CreateDocRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    input: str
    source: Literal["chat", "pdf"]
    context_id: Optional[str] = None