"""
ProspectusIQ Backend — Security Middleware Guardrail
=====================================================
File: backend/app/middleware/security.py
Platform: OS-agnostic (pathlib, UTF-8)

Loads the trained SQLi detector sklearn Pipeline (sqli_detector_sebi.pkl) once
at module import time and exposes:
  - normalize_query()              : canonical text normalization
  - is_sql_injection()             : probabilistic classifier check
  - verify_security_guardrail()    : FastAPI dependency / middleware

All paths resolved via pathlib.Path for Windows/Linux/macOS compatibility.
"""

import os
# Prevent OpenBLAS / OMP thread-pool contention on Windows
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import re
import logging
import urllib.parse
from pathlib import Path
from typing import Optional
from datetime import datetime, timezone

import joblib
from fastapi import Request, HTTPException

# ---------------------------------------------------------------------------
# Logging setup — structured JSON-style output for all security events
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "service": "security-middleware", "message": "%(message)s"}',
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
log = logging.getLogger("security_guardrail")

# ---------------------------------------------------------------------------
# Path resolution — works from any CWD on Windows, Linux, macOS
# ---------------------------------------------------------------------------
_THIS_FILE = Path(__file__).resolve()
_BACKEND_DIR = _THIS_FILE.parent.parent.parent   # backend/
_PROJECT_ROOT = _BACKEND_DIR.parent              # ProspectusIQ/

_MODEL_CANDIDATES = [
    _PROJECT_ROOT / "ml" / "models" / "sqli_detector_sebi.pkl",
    _PROJECT_ROOT / "models" / "sqli_detector_sebi.pkl",
    _BACKEND_DIR / "models" / "sqli_detector_sebi.pkl",
]

# ---------------------------------------------------------------------------
# Deterministic substring bypass patterns (fast-path before model inference)
# Catches highly-obfuscated payloads that may slip below the model threshold
# ---------------------------------------------------------------------------
_BYPASS_PATTERNS: list[str] = [
    "' or '1'='1",
    "1' or 1=1",
    "drop table",
    "drop database",
    "union select",
    "exec xp_cmdshell",
    "select * from",
    "waitfor delay",
    "pg_sleep(",
    "benchmark(",
    "information_schema.tables",
    "%27 or 1=1",
    "%27%20or%201%3d1",
    "1'/**/or",
    "' or ''='",
    "' having 1=1",
    "' group by 1",
]


def _load_sqli_model() -> Optional[object]:
    """Load serialized sklearn Pipeline from the first valid candidate path."""
    for candidate in _MODEL_CANDIDATES:
        if candidate.exists():
            try:
                pipeline = joblib.load(candidate)
                log.info(f"SQLi model loaded: {candidate.name} ({candidate.stat().st_size // 1024} KB)")
                return pipeline
            except Exception as exc:
                log.warning(f"Failed to load model from {candidate}: {exc}")
    log.error(
        "sqli_detector_sebi.pkl not found in any candidate path. "
        "Falling back to keyword-only guardrail."
    )
    return None


# Module-level singleton — loaded once at import time
_SQLI_MODEL = _load_sqli_model()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def normalize_query(query: str) -> str:
    """
    Canonical text normalization applied before every model inference call:
    1. URL-decode (handles %27, %20, double-encoded %2527, etc.)
    2. Lowercase
    3. Strip unprintable control characters (\\x00–\\x08, \\x0b, \\x0c, \\x0e–\\x1f, \\x7f)
    4. Collapse multiple whitespace to single space
    """
    if not isinstance(query, str):
        return ""
    decoded = urllib.parse.unquote(query)
    # Second pass for double-encoded payloads like %2527 → %27 → '
    if "%" in decoded:
        try:
            decoded = urllib.parse.unquote(decoded)
        except Exception:
            pass
    lowered = decoded.lower()
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", lowered)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def is_sql_injection(query: str, threshold: float = 0.80) -> tuple[bool, float]:
    """
    Evaluate a user query against the trained SQLi classifier pipeline.

    Returns
    -------
    (is_attack: bool, probability: float)
        is_attack    — True if predicted attack probability > threshold OR
                       a known bypass pattern is found in the normalized query.
        probability  — Model's P(class=1) probability, or 0.99 for bypass hits.
    """
    normalized = normalize_query(query)

    # --- Fast-path: deterministic substring scanner ---
    if any(pat in normalized for pat in _BYPASS_PATTERNS):
        return True, 0.99

    # --- Model inference path ---
    if _SQLI_MODEL is not None:
        try:
            probs = _SQLI_MODEL.predict_proba([normalized])[0]
            attack_prob = float(probs[1])
            return attack_prob >= threshold, attack_prob
        except Exception as exc:
            log.error(f"Model inference error: {exc} — falling back to keyword scan")

    # --- Keyword fallback (model unavailable) ---
    sqli_keywords = [
        "select", "union", "drop", "insert", "delete", "update", "alter",
        "exec", "sleep", "benchmark", "--", "/*", "or 1=1", "' or", "1=1",
    ]
    hit = any(kw in normalized for kw in sqli_keywords)
    return hit, 0.95 if hit else 0.05


async def verify_security_guardrail(request: Request) -> None:
    """
    FastAPI dependency that inspects every incoming request body for SQLi payloads.

    Usage
    -----
    Add as a dependency on any route or the entire router:

        @router.post("/query", dependencies=[Depends(verify_security_guardrail)])
        async def query_endpoint(body: QueryRequest): ...

    Raises
    ------
    HTTPException(403) when a malicious payload is detected.
    """
    # Only inspect JSON bodies (skip file uploads, health checks, etc.)
    content_type = request.headers.get("content-type", "")
    if "application/json" not in content_type:
        return

    try:
        body = await request.json()
    except Exception:
        return  # Malformed body — let downstream validation handle it

    query: str = ""
    if isinstance(body, dict):
        # Inspect the "query" field (primary) and any other string values
        query = str(body.get("query", ""))

    if not query:
        return

    attack, probability = is_sql_injection(query)

    if attack:
        ts = datetime.now(timezone.utc).isoformat()
        log.warning(
            f"SECURITY_GUARDRAIL_TRIGGERED | "
            f"timestamp={ts} | "
            f"attack_probability={probability:.4f} | "
            f"raw_query={query[:120]!r} | "
            f"client_ip={request.client.host if request.client else 'unknown'}"
        )
        raise HTTPException(
            status_code=403,
            detail={
                "error": "Security Guardrail Triggered: Malicious Query Pattern Detected",
                "attack_probability": round(probability, 4),
                "timestamp": ts,
            },
        )
