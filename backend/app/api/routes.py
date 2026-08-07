"""
ProspectusIQ Backend — Query Processing Routes
===============================================
File: backend/app/api/routes.py

POST /api/v1/query
  - Runs verify_security_guardrail dependency (raises 403 on SQLi)
  - Calls FAISS RAG retriever for top-k context chunks
  - Returns structured JSON response with latency telemetry
"""

import time
import logging
from pathlib import Path
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.middleware.security import verify_security_guardrail
from app.rag.retriever import retrieve_top_k_chunks, get_index_stats

log = logging.getLogger("routes")

router = APIRouter(prefix="/api/v1", tags=["ProspectusIQ Query API"])


# ---------------------------------------------------------------------------
# Request / Response Pydantic Models
# ---------------------------------------------------------------------------

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2048, description="User financial query")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of RAG context chunks to return")

    model_config = {"json_schema_extra": {"examples": [{"query": "What is the net profit of Encube Ethicals?", "top_k": 5}]}}


class RetrievedChunk(BaseModel):
    chunk_id: str
    pdf_source: str
    page: int
    section: str
    doc_type: str
    text: str
    score: float


class QueryResponse(BaseModel):
    status: str
    query: str
    top_k_requested: int
    retrieved_contexts: list[RetrievedChunk]
    total_contexts_returned: int
    latency_ms: float


class HealthResponse(BaseModel):
    status: str
    faiss_index: dict
    model: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post(
    "/query",
    response_model=QueryResponse,
    summary="SEBI Prospectus Semantic Query",
    description=(
        "Submit a financial query. The security guardrail runs first — "
        "SQL injection payloads are blocked with HTTP 403. Safe queries are "
        "routed to the FAISS RAG vector retrieval engine and return the "
        "top-k most relevant SEBI DRHP context chunks."
    ),
    dependencies=[Depends(verify_security_guardrail)],
)
async def query_endpoint(body: QueryRequest) -> QueryResponse:
    """
    Main query processing endpoint.

    Security guardrail fires as a FastAPI dependency before this function
    is ever called, so by the time execution reaches here the query is
    guaranteed to be non-malicious.
    """
    t0 = time.perf_counter()

    chunks = retrieve_top_k_chunks(body.query, top_k=body.top_k)

    latency_ms = round((time.perf_counter() - t0) * 1000, 2)

    log.info(
        f"QUERY_PROCESSED | "
        f"latency_ms={latency_ms} | "
        f"chunks_returned={len(chunks)} | "
        f"query={body.query[:80]!r}"
    )

    return QueryResponse(
        status="success",
        query=body.query,
        top_k_requested=body.top_k,
        retrieved_contexts=[RetrievedChunk(**c) for c in chunks],
        total_contexts_returned=len(chunks),
        latency_ms=latency_ms,
    )


# ---------------------------------------------------------------------------
# Multi-Format Document Parsing Route
# ---------------------------------------------------------------------------

from app.rag.document_parser import parse_document, SUPPORTED_EXTENSIONS

class ParseFileRequest(BaseModel):
    file_path: str = Field(..., description="Local file path to document (.pdf, .docx, .xlsx, .csv, .txt, .md, .json, .html)")
    doc_type: str = Field(default="General", description="Document type tag (e.g., DRHP, Regulations, Observation letters, Audit)")

class ParseFileResponse(BaseModel):
    status: str
    file_name: str
    file_format: str
    doc_type: str
    total_chunks_extracted: int
    chunks: list[dict]
    supported_formats: list[str]

@router.post(
    "/parse_file",
    response_model=ParseFileResponse,
    summary="Multi-Format Document Parser",
    description="Parse and chunk documents across PDF, Word (.docx), Excel (.xlsx/.csv), Text (.txt/.md), JSON, and HTML formats for audit analysis."
)
async def parse_file_endpoint(body: ParseFileRequest) -> ParseFileResponse:
    path = Path(body.file_path)
    if not path.exists():
        return ParseFileResponse(
            status="error: file_not_found",
            file_name=path.name,
            file_format=path.suffix.lower(),
            doc_type=body.doc_type,
            total_chunks_extracted=0,
            chunks=[],
            supported_formats=list(SUPPORTED_EXTENSIONS.keys())
        )

    chunks = parse_document(path, doc_type=body.doc_type)
    return ParseFileResponse(
        status="success",
        file_name=path.name,
        file_format=SUPPORTED_EXTENSIONS.get(path.suffix.lower(), "Unknown"),
        doc_type=body.doc_type,
        total_chunks_extracted=len(chunks),
        chunks=chunks,
        supported_formats=list(SUPPORTED_EXTENSIONS.keys())
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health & FAISS Index Stats",
)
async def health_check() -> HealthResponse:
    """Returns liveness status and FAISS vector index statistics."""
    return HealthResponse(
        status="ok",
        faiss_index=get_index_stats(),
        model="ProspectusIQ SQLi Guardrail + SEBI RAG v1.0",
    )
