from __future__ import annotations

from pathlib import Path


def prompts_dir() -> Path:
    # app/services -> app -> api
    api_dir = Path(__file__).resolve().parents[2]
    return api_dir / "prompts"

def load_prompt(filename: str) -> str:
    path = prompts_dir() / filename
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path} ")
    return path.read_text()