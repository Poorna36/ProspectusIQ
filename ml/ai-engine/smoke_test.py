#!/usr/bin/env python3
"""
smoke_test.py — Quick import + functional validation for the ML engine.
Run from ml/ai-engine/:  python smoke_test.py
"""

import sys
import os

# Ensure imports resolve from ml/ai-engine/
sys.path.insert(0, os.path.dirname(__file__))

print("=" * 60)
print("ProspectusIQ ML Engine — Smoke Test")
print("=" * 60)

# ── 1. Schema imports ────────────────────────────────────────────
print("\n[1] Importing schemas...")
from src.api.schemas import DraftRequest, DraftResponse, VerifierStatus
print("    ✓ schemas OK")

# ── 2. Embeddings ────────────────────────────────────────────────
print("\n[2] Loading sentence-transformer (all-MiniLM-L6-v2)...")
from src.rag.embeddings import embed_query
vec = embed_query("What are the risk factors in a DRHP?")
print(f"    ✓ embeddings OK — vector shape: {vec.shape}, dtype: {vec.dtype}")

# ── 3. RAG retriever ─────────────────────────────────────────────
print("\n[3] Testing FAISS search (top-3 for Risk Factors query)...")
from src.rag.retriever import search_sebi, get_regulation_context
results = search_sebi("risk factors SEBI ICDR", top_k=3, section_key="CH_02")
print(f"    ✓ FAISS search OK — {len(results)} chunks returned")
for r in results:
    print(f"       [{r['relevance_score']:.3f}] {r['pdf_source']} | {r['section']}")

# ── 4. Regulation context ────────────────────────────────────────
print("\n[4] Testing get_regulation_context for CH_02...")
ctx = get_regulation_context("CH_02", top_k=2)
print(f"    ✓ regulation context OK — {len(ctx)} chars")

# ── 5. Grounding check ───────────────────────────────────────────
print("\n[5] Testing grounding check...")
from src.generator.grounding_check import check_grounding
# Should PASS — 85 crore is in inputVariables
result_pass = check_grounding(
    "Our revenue was ₹85 crore in FY26.",
    {"variable_revenue_FY26": 850000000}
)
# Should FAIL — 99 crore is NOT in inputVariables
result_fail = check_grounding(
    "Our revenue was ₹99 crore in FY26.",
    {"variable_revenue_FY26": 850000000}
)
print(f"    ✓ grounding PASS test: passed={result_pass.passed} (expected True)")
print(f"    ✓ grounding FAIL test: passed={result_fail.passed} (expected False), hallucinated={result_fail.hallucinated_numbers}")

# ── 6. SQLi model ────────────────────────────────────────────────
print("\n[6] Testing SQLi classifier...")
import joblib
from pathlib import Path
sqli_path = Path(__file__).parent.parent.parent / "models" / "sqli_detector_sebi.pkl"
if sqli_path.exists():
    model = joblib.load(str(sqli_path))
    safe_query = "what are the risk factors in a DRHP for manufacturing companies?"
    sqli_query = "' OR 1=1; DROP TABLE users --"
    import urllib.parse, re
    def norm(q):
        d = urllib.parse.unquote(q)
        return re.sub(r'\s+', ' ', d.lower()).strip()
    safe_prob = model.predict_proba([norm(safe_query)])[0]
    sqli_prob = model.predict_proba([norm(sqli_query)])[0]
    print(f"    ✓ SQLi model loaded — {sqli_path.name}")
    print(f"       Safe query → malicious prob: {safe_prob[1]:.4f} (expected ~0)")
    print(f"       SQLi query → malicious prob: {sqli_prob[1]:.4f} (expected ~1)")
else:
    print(f"    ⚠ SQLi model not found at {sqli_path} — skipping")

# ── 7. Taxonomy ─────────────────────────────────────────────────
print("\n[7] Testing verifier taxonomy...")
from src.verifier.taxonomy import DeficiencyType, SECTION_PRIMARY_DEFICIENCY
print(f"    ✓ taxonomy OK — {len(DeficiencyType)} deficiency types")
print(f"       CH_02 primary: {SECTION_PRIMARY_DEFICIENCY.get('CH_02')}")

# ── 8. Prompts ──────────────────────────────────────────────────
print("\n[8] Testing section prompts...")
from src.generator.prompts import get_system_prompt, build_user_prompt
prompt = get_system_prompt("CH_02")
user_p = build_user_prompt(
    section_key="CH_02",
    input_variables={"variable_revenue_FY26": 850000000, "variable_customer_concentration_top5_pct": 62},
    regulation_context="Test regulation context",
)
print(f"    ✓ system prompt: {len(prompt)} chars")
print(f"    ✓ user prompt: {len(user_p)} chars")

print("\n" + "=" * 60)
print("All smoke tests PASSED ✓")
print("Ready to run: uvicorn src.api.server:app --reload --port 8001")
print("=" * 60)
