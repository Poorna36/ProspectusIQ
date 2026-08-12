"""
retriever.py — SEBI FAISS vector store search.
Wraps existing data/vector_db/sebi_faiss.index + vector_db_metadata.json.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 4 | ML_HANDOFF_GUIDE.md §2
"""

from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Optional

try:
    import faiss
except ImportError:
    faiss = None
import numpy as np

from .embeddings import embed_query

# ── Resolve absolute paths regardless of working directory ───────────────────
_ML_DIR = Path(__file__).resolve().parents[3]   # ml/  (rag/ -> src/ -> ai-engine/ -> ml/)
_INDEX_PATH = _ML_DIR / "data" / "vector_db" / "sebi_faiss.index"
_META_PATH  = _ML_DIR / "data" / "vector_db" / "vector_db_metadata.json"

_faiss_index: faiss.Index | None = None
_chunk_store: list[dict] | None = None


def _load_index() -> tuple[Optional[object], list[dict]]:
    global _faiss_index, _chunk_store
    if _faiss_index is None:
        if faiss is None or not _INDEX_PATH.exists() or not _META_PATH.exists():
            return None, []
        try:
            _faiss_index = faiss.read_index(str(_INDEX_PATH))
            with open(_META_PATH, "r", encoding="utf-8") as f:
                meta = json.load(f)
            _chunk_store = meta.get("chunks", [])
        except Exception:
            return None, []

    return _faiss_index, _chunk_store or []


# Section label → keyword mapping for light re-ranking by section relevance
_SECTION_KEYWORDS: dict[str, list[str]] = {
    "CH_01": ["cover page", "general information", "offer"],
    "CH_02": ["risk factors", "material risk", "concentration"],
    "CH_03": ["summary", "introduction", "highlights"],
    "CH_04": ["objects", "fund utilisation", "fund allocation", "proceeds"],
    "CH_05": ["basis for issue price", "peer group", "valuation"],
    "CH_06": ["business overview", "industry", "operations"],
    "CH_07": ["regulations", "regulatory", "compliance", "laws"],
    "CH_08": ["history", "corporate structure", "subsidiaries"],
    "CH_09": ["management", "board", "directors", "kmp"],
    "CH_10": ["promoter", "related party", "shareholding"],
    "CH_11": ["financial statements", "restated", "audited", "balance sheet"],
    "CH_12": ["management discussion", "mda", "analysis"],
    "CH_13": ["litigation", "legal proceedings", "disputes", "outstanding"],
    "CH_14": ["government approvals", "licences", "regulatory approvals"],
    "CH_15": ["statutory disclosures", "regulatory disclosures"],
    "CH_16": ["issue structure", "offer structure", "terms of the offer"],
    "CH_17": ["issue procedure", "application", "bidding"],
    "CH_18": ["material contracts", "documents for inspection"],
}


def search_sebi(
    query: str,
    top_k: int = 5,
    section_key: Optional[str] = None,
) -> list[dict]:
    """
    Returns top-K matching SEBI DRHP chunks for a query.
    If section_key provided, soft-boost chunks whose section text matches keywords.

    Returns list of dicts with keys:
        chunk_id, pdf_source, section, page, relevance_score, excerpt
    """
    index, chunks = _load_index()
    if index is None or not chunks:
        return []

    query_vec = embed_query(query)                     # (1, 384) float32
    scores, indices = index.search(query_vec, min(top_k * 2, len(chunks)))

    results: list[dict] = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < 0 or idx >= len(chunks):
            continue
        chunk = dict(chunks[idx])
        relevance = float(score)

        # Soft boost: if section keyword matches, add 0.05 to relevance
        if section_key and section_key in _SECTION_KEYWORDS:
            sec_text = chunk.get("section", "").lower()
            chunk_text = chunk.get("text", "").lower()
            for kw in _SECTION_KEYWORDS[section_key]:
                if kw in sec_text or kw in chunk_text:
                    relevance += 0.05
                    break

        results.append({
            "chunk_id":       chunk.get("chunk_id", f"chunk_{idx}"),
            "pdf_source":     chunk.get("pdf_source", "unknown"),
            "section":        chunk.get("section", ""),
            "page":           chunk.get("page", 0),
            "relevance_score": min(relevance, 1.0),
            "excerpt":        chunk.get("text", "")[:300],
            "_full_text":     chunk.get("text", ""),
        })

    # Sort by boosted relevance, take top_k
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results[:top_k]


def get_regulation_context(section_key: str, top_k: int = 3) -> str:
    """
    Returns a formatted string of the top-K SEBI regulatory clauses for a section.
    Used as context injection for Generator and Verifier prompts.
    """
    query = f"SEBI ICDR regulations requirements for {section_key} DRHP filing"
    chunks = search_sebi(query, top_k=top_k, section_key=section_key)

    if not chunks:
        return "No specific regulatory context retrieved. Apply general SEBI ICDR 2018 standards."

    lines = ["=== SEBI REGULATORY CONTEXT ==="]
    for i, chunk in enumerate(chunks, 1):
        lines.append(f"\n[{i}] Source: {chunk['pdf_source']} | Section: {chunk['section']}")
        lines.append(chunk["_full_text"][:600])
    return "\n".join(lines)
