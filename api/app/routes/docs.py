from __future__ import annotations

from fastapi import APIRouter

from app.models.requests import CreateDocRequest
from app.models.minidoc import MiniDoc
from app.services.minidoc_generator import create_minidoc_from_input
from app.services.minidoc_store import minidoc_store

router = APIRouter()


@router.post("/docs", response_model=MiniDoc)
async def create_doc(req: CreateDocRequest) -> MiniDoc:
    doc = await create_minidoc_from_input(req.input)
    minidoc_store.put(doc)
    return doc