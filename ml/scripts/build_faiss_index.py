#!/usr/bin/env python3
"""
build_faiss_index.py — Rebuilds the FAISS index from vector_db_metadata.json.
Run once at build time (Render build step) or locally to regenerate the index.

Usage:
    python scripts/build_faiss_index.py
"""

from __future__ import annotations
import json
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]          # ml/
_META_PATH  = _ROOT / "data" / "vector_db" / "vector_db_metadata.json"
_INDEX_PATH = _ROOT / "data" / "vector_db" / "sebi_faiss.index"

def main() -> None:
    if not _META_PATH.exists():
        print(f"[build_faiss_index] Metadata not found at {_META_PATH} — skipping index build.")
        sys.exit(0)

    print(f"[build_faiss_index] Loading metadata from {_META_PATH} …")
    with open(_META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)

    chunks = meta.get("chunks", [])
    if not chunks:
        print("[build_faiss_index] No chunks in metadata — skipping.")
        sys.exit(0)

    print(f"[build_faiss_index] {len(chunks)} chunks found. Building embeddings …")

    try:
        import numpy as np
        import faiss
        from sentence_transformers import SentenceTransformer
    except ImportError as e:
        print(f"[build_faiss_index] Required package not installed: {e}. Skipping index build.")
        sys.exit(0)

    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [c.get("text", "") for c in chunks]

    BATCH = 512
    all_vecs = []
    for i in range(0, len(texts), BATCH):
        batch = texts[i:i + BATCH]
        vecs = model.encode(batch, convert_to_numpy=True, show_progress_bar=False)
        # L2-normalise for cosine similarity via inner product
        norms = np.linalg.norm(vecs, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        all_vecs.append((vecs / norms).astype(np.float32))
        print(f"  encoded {min(i + BATCH, len(texts))}/{len(texts)}", flush=True)

    matrix = np.vstack(all_vecs)
    dim = matrix.shape[1]

    index = faiss.IndexFlatIP(dim)   # Inner product = cosine on L2-normalised vecs
    index.add(matrix)

    faiss.write_index(index, str(_INDEX_PATH))
    print(f"[build_faiss_index] ✓ Index written to {_INDEX_PATH}  ({index.ntotal} vectors, dim={dim})")


if __name__ == "__main__":
    main()
