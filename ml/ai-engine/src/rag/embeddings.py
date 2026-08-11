"""
embeddings.py — Embedding utilities.
Loads all-MiniLM-L6-v2 (384-dim) once at startup and provides encode helpers.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 4 | ML_HANDOFF_GUIDE.md §2
"""

from __future__ import annotations
import numpy as np
from sentence_transformers import SentenceTransformer

_MODEL_NAME = "all-MiniLM-L6-v2"
_embedder: SentenceTransformer | None = None


def get_embedder() -> SentenceTransformer:
    """Lazy-load the embedder once — reused for all inference."""
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(_MODEL_NAME)
    return _embedder


def embed_query(text: str) -> np.ndarray:
    """
    Encode a single text string to a normalised 384-dim float32 vector.
    Normalisation is required because the FAISS index uses cosine similarity
    via inner product (L2-normalised vectors).
    """
    embedder = get_embedder()
    raw = embedder.encode([text], convert_to_numpy=True)
    norm = np.linalg.norm(raw)
    if norm == 0:
        return raw.astype(np.float32)
    return (raw / norm).astype(np.float32)
