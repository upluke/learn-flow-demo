from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class MiniDocSection(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    text: str
    concepts: list[str]


class WorkedExampleSection(MiniDocSection):
    code_example: str  # empty string if topic is not code-related
    code_breakdown: str  # empty string if no code


class QuickCheck(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    question: str
    hint: str
    anchor_text: str  # verbatim sentence from any section that best answers this question
    anchor_section_key: Literal["core_idea", "mental_model", "worked_example"]
    type: Literal["recall", "apply", "connect"]


class MiniDocDraft(BaseModel):
    """Shape the LLM must return. Backend injects id / mastery / created_at."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    topic: str
    hook: str  # 1–2 sentences: why this matters now
    core_idea: MiniDocSection
    mental_model: MiniDocSection
    worked_example: WorkedExampleSection
    quick_checks: list[QuickCheck] = Field(min_length=1)


class MiniDoc(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str
    topic: str
    hook: str
    core_idea: MiniDocSection
    mental_model: MiniDocSection
    worked_example: WorkedExampleSection
    quick_checks: list[QuickCheck]
    mastery: float = Field(ge=0.0, le=1.0)
    created_at: datetime
