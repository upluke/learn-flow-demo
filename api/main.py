from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.docs import router as docs_router
from app.routes.clarify import router as clarify_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(docs_router)
app.include_router(clarify_router)