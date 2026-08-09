"""
ProspectusIQ — Automated ML Integration Test Suite
====================================================
File: tests/test_ml_integration.py

Validates 4 distinct scenarios using the FastAPI TestClient:

  1. Valid SEBI financial queries     → HTTP 200 + non-empty chunks
  2. Direct SQLi attacks             → HTTP 403 (guardrail)
  3. OWASP Polyglot SQLi payloads    → HTTP 403 (guardrail)
  4. FAISS similarity boundary test  → HTTP 200 + score validation

Run:
  cd backend
  python -m pytest ../tests/ -v --tb=short
"""

import sys
from pathlib import Path

# Ensure backend/ is on sys.path so `app.*` imports resolve
_TESTS_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _TESTS_DIR.parent
_BACKEND_DIR = _PROJECT_ROOT / "backend"
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ═══════════════════════════════════════════════════════════════════════════
# SCENARIO 1: Valid SEBI Financial Queries → HTTP 200 + Retrieved Chunks
# ═══════════════════════════════════════════════════════════════════════════

class TestValidFinancialQueries:
    """Safe, domain-relevant queries should pass the guardrail and return RAG chunks."""

    @pytest.mark.parametrize("query", [
        "What is the net profit of Encube Ethicals?",
        "Show balance sheet restatements for revenue FY25 of Veritas Finance",
        "Search objects of the issue for TechNova Solutions SME IPO",
        "Get litigation history and pending proceedings for Indian Gas Exchange",
        "What are the major risk factors in the draft red herring prospectus?",
    ])
    def test_valid_query_returns_200(self, query: str):
        resp = client.post("/api/v1/query", json={"query": query, "top_k": 5})
        assert resp.status_code == 200, f"Expected 200 for safe query, got {resp.status_code}: {resp.text}"

        body = resp.json()
        assert body["status"] == "success"
        assert body["query"] == query
        assert isinstance(body["retrieved_contexts"], list)
        assert isinstance(body["latency_ms"], (int, float))
        assert body["latency_ms"] >= 0

    def test_valid_query_returns_non_empty_chunks(self):
        resp = client.post(
            "/api/v1/query",
            json={"query": "SEBI ICDR regulations risk factors promoter", "top_k": 3},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["total_contexts_returned"] > 0, "Expected at least 1 context chunk for a well-known query"

    def test_health_endpoint(self):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "ok"
        assert "faiss_index" in body


# ═══════════════════════════════════════════════════════════════════════════
# SCENARIO 2: Direct SQLi Attacks → HTTP 403
# ═══════════════════════════════════════════════════════════════════════════

class TestDirectSqlInjectionAttacks:
    """Classic SQLi attack vectors must be blocked with 403 Forbidden."""

    @pytest.mark.parametrize("payload", [
        "' OR '1'='1' --",
        "1; DROP TABLE filings; --",
        "SELECT * FROM users WHERE username = 'admin' --",
        "' UNION SELECT credit_card_num FROM accounts --",
        "admin' OR 1=1 --",
        "1' AND SLEEP(5) --",
        "'; WAITFOR DELAY '0:0:5' --",
        "' OR ''='",
    ])
    def test_direct_sqli_returns_403(self, payload: str):
        resp = client.post("/api/v1/query", json={"query": payload, "top_k": 3})
        assert resp.status_code == 403, (
            f"Expected 403 for SQLi payload {payload!r}, got {resp.status_code}: {resp.text}"
        )

    def test_403_body_contains_guardrail_detail(self):
        resp = client.post(
            "/api/v1/query",
            json={"query": "' OR '1'='1' --", "top_k": 1},
        )
        assert resp.status_code == 403
        body = resp.json()
        detail = body.get("detail", {})
        assert "Malicious Query Pattern Detected" in detail.get("error", "")
        assert "attack_probability" in detail
        assert "timestamp" in detail


# ═══════════════════════════════════════════════════════════════════════════
# SCENARIO 3: OWASP Polyglot SQLi Payloads → HTTP 403
# ═══════════════════════════════════════════════════════════════════════════

class TestOwaspPolyglotPayloads:
    """
    Advanced obfuscated payloads from OWASP SecLists that attempt to bypass
    naive keyword filters. The trained model + bypass scanner must catch them.
    """

    @pytest.mark.parametrize("payload", [
        # URL-encoded
        "%27%20OR%201%3D1%20--",
        # Comment-obfuscated
        "1'/**/OR/**/1=1/**/--",
        # Double-URL-encoded
        "%2527%2520OR%25201%253D1%2520--",
        # Polyglot: boolean + error-based
        "1 AND (SELECT 1 FROM(SELECT COUNT(*),CONCAT(0x3a,0x3a,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.TABLES GROUP BY x)a)",
        # Hex encoding
        "admin'/**/UNION/**/SELECT/**/CHAR(117,115,101,114,110,97,109,101)--",
        # Nested comment
        "' OR/*comment*/'1'='1' --",
        # Time-based blind with comment
        "param_42'/**/pg_sleep/**/secret_key,/**/admin_flag/**/from/**/filings_42/**/;--",
    ])
    def test_owasp_polyglot_returns_403(self, payload: str):
        resp = client.post("/api/v1/query", json={"query": payload, "top_k": 1})
        assert resp.status_code == 403, (
            f"OWASP polyglot payload was NOT blocked: {payload!r} → {resp.status_code}"
        )


# ═══════════════════════════════════════════════════════════════════════════
# SCENARIO 4: FAISS Similarity Search Boundary Test
# ═══════════════════════════════════════════════════════════════════════════

class TestFaissSimilarityBoundary:
    """
    Ensures the vector retrieval engine returns non-empty, structurally valid
    context chunks and that similarity scores are within expected bounds.
    """

    def test_chunks_are_non_empty(self):
        resp = client.post(
            "/api/v1/query",
            json={"query": "SEBI ICDR regulation risk factors", "top_k": 5},
        )
        assert resp.status_code == 200
        chunks = resp.json()["retrieved_contexts"]
        assert len(chunks) > 0, "FAISS should return at least 1 chunk for a relevant query"

        for chunk in chunks:
            assert chunk["text"].strip(), "Chunk text must not be empty"
            assert chunk["pdf_source"], "pdf_source must be present"
            assert chunk["page"] >= 1, "Page number must be >= 1"

    def test_top_k_respected(self):
        for k in [1, 3, 5]:
            resp = client.post(
                "/api/v1/query",
                json={"query": "objects of the issue working capital", "top_k": k},
            )
            assert resp.status_code == 200
            body = resp.json()
            assert body["total_contexts_returned"] <= k

    def test_similarity_scores_bounded(self):
        resp = client.post(
            "/api/v1/query",
            json={"query": "promoter shareholding lock-in period", "top_k": 5},
        )
        assert resp.status_code == 200
        chunks = resp.json()["retrieved_contexts"]
        for chunk in chunks:
            assert -1.0 <= chunk["score"] <= 1.01, (
                f"Cosine similarity score {chunk['score']} out of [-1, 1] range"
            )

    def test_chunk_structure_keys(self):
        resp = client.post(
            "/api/v1/query",
            json={"query": "EBITDA margin revenue breakdown", "top_k": 2},
        )
        assert resp.status_code == 200
        chunks = resp.json()["retrieved_contexts"]
        required_keys = {"chunk_id", "pdf_source", "page", "section", "doc_type", "text", "score"}
        for chunk in chunks:
            assert required_keys.issubset(chunk.keys()), (
                f"Missing keys: {required_keys - chunk.keys()}"
            )
