from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.clarify import ClarifyRequest, ClarifyResponse
from app.services.clarify_service import clarify_minidoc
from app.services.minidoc_store import minidoc_store

router = APIRouter()


def _get_doc_or_404(doc_id: str):
    doc = minidoc_store.get(doc_id)
    if doc is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "DOC_NOT_FOUND",
                "message": "MiniDoc not found. Generate a new MiniDoc first.",
            },
        )
    return doc


@router.post("/clarify", response_model=ClarifyResponse)
async def clarify(req: ClarifyRequest) -> ClarifyResponse:
    doc = _get_doc_or_404(req.doc_id)
    return await clarify_minidoc(doc, req.question)
