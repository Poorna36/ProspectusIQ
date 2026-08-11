"""
server.py — FastAPI entrypoint for the ProspectusIQ ML Engine.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 1 | blueprint docs/ml/pipeline.md §4

Routes:
  POST /ml/draft           — 5-step DRHP drafting pipeline
  POST /ml/verify          — Standalone compliance check
  POST /ml/search          — Raw SEBI RAG search
  POST /ml/security/check  — SQLi detection
  POST /ml/copilot         — Context-aware Q&A

Startup: uvicorn src.api.server:app --reload --port 8001
"""

from __future__ import annotations
import logging
import os
import re
import urllib.parse
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import joblib
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import (
    DraftRequest, DraftResponse,
    VerifyRequest, VerifyResponse,
    SearchRequest, SearchResponse, SearchChunk,
    SecurityCheckRequest, SecurityCheckResponse,
    CopilotRequest, CopilotResponse, CopilotSource,
    VerifierFlag, VerifierStatus, RulesEngineStatus,
)
from ..rag.retriever import search_sebi, get_regulation_context
from ..rag.embeddings import get_embedder
from ..generator.inference_client import call_llm
from ..verifier.cross_encoder import score_compliance
from ..pipelines import draft_orchestrator
from ..copilot import chat_handler

# ── Bootstrap ────────────────────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# ── SQLi Model ───────────────────────────────────────────────────────────────
_ML_DIR = Path(__file__).resolve().parents[4]   # ml/
_SQLI_MODEL_PATH = _ML_DIR / "models" / "sqli_detector_sebi.pkl"
_sqli_model = None


def _normalize_security_query(query: str) -> str:
    """Exact normalization from ML_HANDOFF_GUIDE.md §1."""
    if not isinstance(query, str):
        return ""
    decoded = urllib.parse.unquote(query)
    if "%" in decoded:
        try:
            decoded = urllib.parse.unquote(decoded)
        except Exception:
            pass
    lowered = decoded.lower()
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", lowered)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


# ── Lifespan: load heavy models once at startup ───────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _sqli_model
    logger.info("Starting ProspectusIQ ML Engine...")

    # Pre-load sentence transformer (avoids cold-start on first request)
    try:
        get_embedder()
        logger.info("✓ Sentence transformer loaded")
    except Exception as e:
        logger.warning(f"Sentence transformer load warning: {e}")

    # Load SQLi model
    try:
        if _SQLI_MODEL_PATH.exists():
            _sqli_model = joblib.load(str(_SQLI_MODEL_PATH))
            logger.info(f"✓ SQLi model loaded from {_SQLI_MODEL_PATH}")
        else:
            logger.warning(f"SQLi model not found at {_SQLI_MODEL_PATH} — /ml/security/check will use fallback")
    except Exception as e:
        logger.warning(f"SQLi model load error: {e}")

    logger.info("ML Engine ready on port 8001")
    yield
    logger.info("ML Engine shutting down")


# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="ProspectusIQ ML Engine",
    description="AI inference service for SEBI DRHP drafting, compliance verification, RAG search, security, and copilot.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Internal token guard
_INTERNAL_TOKEN = os.getenv("INTERNAL_SERVICE_TOKEN", "prospectusiq-internal-service-token")


def _verify_internal(request: Request) -> None:
    """Light token check — ensures only the Node.js backend can call this service."""
    token = request.headers.get("X-Internal-Token", "")
    if token != _INTERNAL_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden: invalid internal service token")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "prospectusiq-ml-engine", "version": "1.0.0"}


# ── POST /ml/draft ─────────────────────────────────────────────────────────────
@app.post("/ml/draft", response_model=DraftResponse)
async def draft_section(payload: DraftRequest, request: Request):
    _verify_internal(request)
    logger.info(f"[/ml/draft] sectionKey={payload.sectionKey} filingId={payload.filingId} requestId={payload.requestId}")

    result = draft_orchestrator.run(
        filing_id=payload.filingId,
        section_key=payload.sectionKey,
        input_variables=payload.inputVariables,
        rag_enabled=payload.ragEnabled,
        max_retries=payload.maxRetries,
        request_id=payload.requestId,
    )

    return DraftResponse(
        section=result.section,
        sectionKey=result.sectionKey,
        draftedText=result.draftedText,
        sourceVariablesUsed=result.sourceVariablesUsed,
        rulesEngineStatus=RulesEngineStatus(result.rulesEngineStatus),
        verifierStatus=VerifierStatus(result.verifierStatus),
        verifierConfidence=result.verifierConfidence,
        verifierFlags=[VerifierFlag(**f) for f in result.verifierFlags],
        retryCount=result.retryCount,
        modelVersion=result.modelVersion,
        requestId=result.requestId,
    )


# ── POST /ml/verify ─────────────────────────────────────────────────────────────
@app.post("/ml/verify", response_model=VerifyResponse)
async def verify_section(payload: VerifyRequest, request: Request):
    _verify_internal(request)
    regulation_context = get_regulation_context(payload.sectionKey, top_k=3)
    result = score_compliance(
        section_key=payload.sectionKey,
        drafted_text=payload.draftedText,
        input_variables=payload.inputVariables,
        regulation_context=regulation_context,
    )
    return VerifyResponse(
        status=VerifierStatus(result["status"]),
        confidence=result["confidence"],
        flags=[VerifierFlag(**f) for f in result["flags"]],
        requestId=payload.requestId,
    )


# ── POST /ml/search ─────────────────────────────────────────────────────────────
@app.post("/ml/search", response_model=SearchResponse)
async def search_sebi_docs(payload: SearchRequest, request: Request):
    _verify_internal(request)
    chunks = search_sebi(payload.query, top_k=payload.topK, section_key=payload.sectionKey)
    return SearchResponse(
        query=payload.query,
        results=[
            SearchChunk(
                chunk_id=c["chunk_id"],
                pdf_source=c["pdf_source"],
                section=c["section"],
                page=c["page"],
                relevance_score=c["relevance_score"],
                excerpt=c["excerpt"],
            )
            for c in chunks
        ],
        totalResults=len(chunks),
    )


# ── POST /ml/security/check ──────────────────────────────────────────────────────
@app.post("/ml/security/check", response_model=SecurityCheckResponse)
async def security_check(payload: SecurityCheckRequest, request: Request):
    _verify_internal(request)
    cleaned = _normalize_security_query(payload.query)

    if _sqli_model is not None:
        probs = _sqli_model.predict_proba([cleaned])[0]
        is_malicious = bool(probs[1] > 0.5)
        confidence = float(probs[1] if is_malicious else probs[0])
    else:
        # Fallback: simple heuristic if model file missing
        sqli_patterns = ["select ", "union ", "drop ", "insert ", "delete ", "exec ", "' or ", "1=1", "--"]
        is_malicious = any(p in cleaned for p in sqli_patterns)
        confidence = 0.95 if is_malicious else 0.80

    return SecurityCheckResponse(
        query=payload.query,
        cleanedQuery=cleaned,
        isMalicious=is_malicious,
        confidence=confidence,
        label="SQL_INJECTION" if is_malicious else "SAFE",
    )


# ── POST /ml/copilot ─────────────────────────────────────────────────────────────
@app.post("/ml/copilot", response_model=CopilotResponse)
async def copilot_respond(payload: CopilotRequest, request: Request):
    _verify_internal(request)
    result = chat_handler.respond(
        user_message=payload.userMessage,
        section_key=payload.sectionKey,
        filing_context=payload.filingContext.model_dump(),
        request_id=payload.requestId,
    )
    return CopilotResponse(
        reply=result["reply"],
        sources=[CopilotSource(**s) for s in result["sources"]],
        suggestedActions=result["suggestedActions"],
        requestId=result.get("requestId"),
    )


# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def generic_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal ML Engine Error: {str(exc)}"},
    )
