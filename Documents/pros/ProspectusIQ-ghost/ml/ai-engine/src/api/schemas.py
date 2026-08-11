"""
schemas.py — Pydantic input/output models for all 5 FastAPI routes.
Contracts defined in blueprint docs/ml/pipeline.md §4 and ML_SESSION_CONTEXT.md §7.
"""

from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


# ── Shared enums ────────────────────────────────────────────────────────────

class VerifierStatus(str, Enum):
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    NEEDS_HUMAN_REVIEW = "NEEDS_HUMAN_REVIEW"

class RulesEngineStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"


# ── /ml/draft ───────────────────────────────────────────────────────────────

class DraftRequest(BaseModel):
    filingId: str = Field(..., description="UUID of the filing in the backend DB")
    sectionKey: str = Field(..., description="e.g. CH_02, CH_04, CH_06")
    inputVariables: dict = Field(..., description="Promoter-provided key/value data for the section")
    ragEnabled: bool = Field(default=True, description="Whether to run FAISS retrieval before generation")
    maxRetries: int = Field(default=3, ge=1, le=5)
    requestId: str = Field(..., description="X-Request-ID from backend — propagated for tracing")

class VerifierFlag(BaseModel):
    type: str = Field(..., description="One of 4 deficiency types from taxonomy")
    clause_reference: Optional[str] = Field(None)
    justification: str

class DraftResponse(BaseModel):
    section: str
    sectionKey: str
    draftedText: str
    sourceVariablesUsed: list[str]
    rulesEngineStatus: RulesEngineStatus
    verifierStatus: VerifierStatus
    verifierConfidence: float = Field(..., ge=0.0, le=1.0)
    verifierFlags: list[VerifierFlag]
    retryCount: int
    modelVersion: str
    requestId: str


# ── /ml/verify ──────────────────────────────────────────────────────────────

class VerifyRequest(BaseModel):
    draftedText: str = Field(..., min_length=10)
    sectionKey: str
    inputVariables: dict = Field(default_factory=dict)
    requestId: Optional[str] = None

class VerifyResponse(BaseModel):
    status: VerifierStatus
    confidence: float = Field(..., ge=0.0, le=1.0)
    flags: list[VerifierFlag]
    requestId: Optional[str] = None


# ── /ml/search ──────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=3)
    sectionKey: Optional[str] = Field(None, description="Optional section filter for re-ranking")
    topK: int = Field(default=3, ge=1, le=10)

class SearchChunk(BaseModel):
    chunk_id: str
    pdf_source: str
    section: str
    page: int
    relevance_score: float
    excerpt: str = Field(..., description="First 300 chars of matched chunk")

class SearchResponse(BaseModel):
    query: str
    results: list[SearchChunk]
    totalResults: int


# ── /ml/security/check ──────────────────────────────────────────────────────

class SecurityCheckRequest(BaseModel):
    query: str = Field(..., description="Raw user search/query string to classify")

class SecurityCheckResponse(BaseModel):
    query: str
    cleanedQuery: str
    isMalicious: bool
    confidence: float
    label: str  # "SAFE" | "SQL_INJECTION"


# ── /ml/copilot ─────────────────────────────────────────────────────────────

class FilingContext(BaseModel):
    inputVariables: dict = Field(default_factory=dict)
    currentDraft: Optional[str] = None
    openFlags: list[dict] = Field(default_factory=list)
    role: str = Field(..., description="PROMOTER | INTERMEDIARY")

class CopilotRequest(BaseModel):
    userMessage: str = Field(..., min_length=3)
    sectionKey: Optional[str] = None
    filingContext: FilingContext
    requestId: Optional[str] = None

class CopilotSource(BaseModel):
    chunk_id: str
    pdf_source: str
    section: str
    relevance_score: float
    excerpt: str

class CopilotResponse(BaseModel):
    reply: str
    sources: list[CopilotSource]
    suggestedActions: list[str]
    requestId: Optional[str] = None
