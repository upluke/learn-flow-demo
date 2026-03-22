from __future__ import annotations

from typing import Dict, Optional

from app.models.minidoc import MiniDoc


class MiniDocStore:
    """Ephemeral in-process store. Lost on server restart."""

    def __init__(self) -> None:
        self._docs: Dict[str, MiniDoc] = {}

    def put(self, doc: MiniDoc) -> None:
        self._docs[doc.id] = doc

    def get(self, doc_id: str) -> Optional[MiniDoc]:
        return self._docs.get(doc_id)


minidoc_store = MiniDocStore()
