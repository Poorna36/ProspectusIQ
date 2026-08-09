"""
ProspectusIQ Backend — FAISS RAG Retrieval Engine
==================================================
File: backend/app/rag/retriever.py
Platform: OS-agnostic (pathlib, UTF-8)

Loads once at module import:
  - sebi_faiss.index         — FAISS IndexFlatIP (L2-normalized cosine)
  - vector_db_metadata.json  — chunk store with source PDF, page, section, text
  - SentenceTransformer       — all-MiniLM-L6-v2 (384-dim embeddings)

Public API:
  - retrieve_top_k_chunks(query, top_k=5) -> list[dict]
"""

import os
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import json
import logging
from pathlib import Path
from typing import Optional

import numpy as np

log = logging.getLogger("faiss_retriever")

# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------
_THIS_FILE = Path(__file__).resolve()
_BACKEND_DIR = _THIS_FILE.parent.parent.parent   # backend/
_PROJECT_ROOT = _BACKEND_DIR.parent              # ProspectusIQ/

_FAISS_CANDIDATES = [
    _PROJECT_ROOT / "ml" / "data" / "vector_db" / "sebi_faiss.index",
    _PROJECT_ROOT / "data" / "vector_db" / "sebi_faiss.index",
    _BACKEND_DIR / "data" / "vector_db" / "sebi_faiss.index",
]
_META_CANDIDATES = [
    _PROJECT_ROOT / "ml" / "data" / "vector_db" / "vector_db_metadata.json",
    _PROJECT_ROOT / "data" / "vector_db" / "vector_db_metadata.json",
    _BACKEND_DIR / "data" / "vector_db" / "vector_db_metadata.json",
]

# ---------------------------------------------------------------------------
# Lazy-imported heavy dependencies (faiss, sentence_transformers)
# so the module can be imported even when those packages aren't installed
# (unit tests can mock retrieve_top_k_chunks directly)
# ---------------------------------------------------------------------------
_faiss_index = None
_chunk_store: list[dict] = []
_embedder = None
_faiss_available = False


def _init_faiss() -> bool:
    """
    Attempt to load FAISS index, metadata, and embedding model.
    Returns True on success, False if any artifact is missing.
    Called lazily on first retrieve_top_k_chunks() call.
    """
    global _faiss_index, _chunk_store, _embedder, _faiss_available

    if _faiss_available:
        return True

    # Locate FAISS index file
    faiss_file: Optional[Path] = None
    for c in _FAISS_CANDIDATES:
        if c.exists():
            faiss_file = c
            break

    # Locate metadata JSON
    meta_file: Optional[Path] = None
    for c in _META_CANDIDATES:
        if c.exists():
            meta_file = c
            break

    if not faiss_file:
        log.error("sebi_faiss.index not found in any candidate path. RAG disabled.")
        return False
    if not meta_file:
        log.error("vector_db_metadata.json not found. RAG disabled.")
        return False

    try:
        import faiss as faiss_lib  # type: ignore[import]
        _faiss_index = faiss_lib.read_index(str(faiss_file))
        log.info(
            f"FAISS index loaded: {faiss_file.name} | "
            f"vectors={_faiss_index.ntotal} | "
            f"dim={_faiss_index.d}"
        )
    except ImportError:
        log.error("faiss-cpu not installed. Run: pip install faiss-cpu")
        return False
    except Exception as exc:
        log.error(f"Failed to load FAISS index: {exc}")
        return False

    try:
        with open(meta_file, "r", encoding="utf-8") as fh:
            meta = json.load(fh)
        _chunk_store = meta.get("chunks", [])
        log.info(f"Chunk store loaded: {len(_chunk_store)} chunks from {meta_file.name}")
    except Exception as exc:
        log.error(f"Failed to load vector metadata: {exc}")
        return False

    try:
        from sentence_transformers import SentenceTransformer  # type: ignore[import]
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        log.info("SentenceTransformer (all-MiniLM-L6-v2) loaded.")
    except ImportError:
        log.error("sentence-transformers not installed. Run: pip install sentence-transformers")
        return False
    except Exception as exc:
        log.error(f"Failed to load embedding model: {exc}")
        return False

    _faiss_available = True
    return True


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def retrieve_top_k_chunks(query: str, top_k: int = 5) -> list[dict]:
    """
    Encode *query* with all-MiniLM-L6-v2, search the FAISS index for the
    top-k nearest neighbours, and return the corresponding metadata chunks.

    Parameters
    ----------
    query   : Raw user query string (not normalized — embedder handles it).
    top_k   : Number of context chunks to return (default 5).

    Returns
    -------
    list[dict]  Each dict contains:
        chunk_id    : str   — unique identifier
        pdf_source  : str   — source PDF filename
        page        : int   — page number
        section     : str   — DRHP chapter heading
        doc_type    : str   — "DRHP" | "Regulations" | "Observation letters"
        text        : str   — extracted paragraph text
        score       : float — cosine similarity score (0–1, higher = more relevant)
    """
    if not query or not query.strip():
        return []

    if not _init_faiss():
        # Graceful degradation: return empty list instead of crashing
        log.warning("FAISS not available — returning empty context.")
        return []

    try:
        # Embed and L2-normalize for cosine similarity via inner product
        raw_emb: np.ndarray = _embedder.encode(  # type: ignore[union-attr]
            [query], convert_to_numpy=True, show_progress_bar=False
        )
        norm = np.linalg.norm(raw_emb, axis=1, keepdims=True)
        norm[norm == 0] = 1.0
        query_vec = (raw_emb / norm).astype(np.float32)

        # FAISS nearest-neighbour search
        scores, indices = _faiss_index.search(query_vec, top_k)  # type: ignore[union-attr]

        results: list[dict] = []
        for score, idx in zip(scores[0], indices[0]):
            if 0 <= int(idx) < len(_chunk_store):
                chunk = dict(_chunk_store[int(idx)])
                chunk["score"] = round(float(score), 6)
                results.append(chunk)

        return results

    except Exception as exc:
        log.error(f"FAISS retrieval error: {exc}")
        return []


def get_index_stats() -> dict:
    """Return basic statistics about the loaded vector index."""
    if not _init_faiss():
        return {"available": False, "total_vectors": 0, "dimension": 0}
    return {
        "available": True,
        "total_vectors": _faiss_index.ntotal,  # type: ignore[union-attr]
        "dimension": _faiss_index.d,           # type: ignore[union-attr]
        "total_chunks": len(_chunk_store),
        "embedding_model": "all-MiniLM-L6-v2",
    }
