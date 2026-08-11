"""
ProspectusIQ Backend — FastAPI Application Entry Point
======================================================
File: backend/app/main.py

Startup sequence:
  1. Validate critical ML artifacts exist (model .pkl, FAISS index, metadata)
  2. Register API router (POST /api/v1/query, GET /api/v1/health)
  3. Serve OpenAPI docs at /docs

Run:
  cd backend
  uvicorn app.main:app --reload --port 8000
"""

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.rag.retriever import _init_faiss, get_index_stats
from app.middleware.security import _SQLI_MODEL

log = logging.getLogger("main")

# ---------------------------------------------------------------------------
# Path constants (for startup validation messages)
# ---------------------------------------------------------------------------
_HERE = Path(__file__).resolve()
_PROJECT_ROOT = _HERE.parent.parent.parent  # ProspectusIQ/


@asynccontextmanager
async def lifespan(application: FastAPI):
    """
    Application startup / shutdown lifecycle manager.
    Warms up FAISS index and logs artifact status.
    """
    log.info("=" * 60)
    log.info("ProspectusIQ ML Security API — Starting up")
    log.info("=" * 60)

    # Warm up FAISS (lazy init runs on first call)
    _init_faiss()
    stats = get_index_stats()

    if _SQLI_MODEL is not None:
        log.info("[OK] SQLi classifier loaded — sqli_detector_sebi.pkl")
    else:
        log.warning("[WARN] SQLi model unavailable — keyword-only guardrail active")

    if stats["available"]:
        log.info(
            f"[OK] FAISS index loaded — "
            f"{stats['total_vectors']} vectors | dim={stats['dimension']}"
        )
    else:
        log.warning("[WARN] FAISS index unavailable — RAG retrieval disabled")

    log.info("API ready. Docs at http://localhost:8000/docs")
    log.info("=" * 60)

    yield  # --- Application running ---

    log.info("ProspectusIQ ML Security API — Shutting down")


# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ProspectusIQ — SEBI DRHP ML Security & RAG API",
    description=(
        "Production-grade API for SQLi threat classification and SEBI prospectus "
        "vector retrieval. All queries pass through the security guardrail before "
        "reaching the FAISS RAG engine."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow all origins in development; restrict in production
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "ProspectusIQ ML Security & RAG API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "query": "POST /api/v1/query",
            "health": "GET  /api/v1/health",
        },
    }
