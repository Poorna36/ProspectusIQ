"""
draft_orchestrator.py — Executes the 5-step DRHP drafting inference loop.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 5 | blueprint docs/ml/pipeline.md §3

5-Step Loop:
  1. RAG Retrieval       — fetch top-k SEBI regulation clauses for sectionKey
  2. Generator Inference — synthesize draft from inputVariables + RAG context
  3. Grounding Check     — deterministic reject if hallucinated numbers found
  4. Verifier Inference  — score compliance, generate flag array
  5. Routing & Retry     — confidence >= 0.80 → DONE | < 0.60 + retries → loop | else NEEDS_HUMAN_REVIEW
"""

from __future__ import annotations
import logging
import time
from dataclasses import dataclass, field

from ..rag.retriever import get_regulation_context
from ..generator.prompts import get_system_prompt, build_user_prompt, SECTION_TITLES
from ..generator.inference_client import call_llm
from ..generator.grounding_check import check_grounding
from ..verifier.cross_encoder import score_compliance

logger = logging.getLogger(__name__)

# Confidence thresholds (from pipeline.md §3)
CONFIDENCE_PASS       = 0.80
CONFIDENCE_RETRY_MIN  = 0.60
MAX_GROUNDING_RETRIES = 2   # Max retries for grounding failures before accepting draft


@dataclass
class DraftResult:
    section: str
    sectionKey: str
    draftedText: str
    sourceVariablesUsed: list[str]
    rulesEngineStatus: str        # "PASS" | "FAIL"
    verifierStatus: str           # "COMPLIANT" | "NON_COMPLIANT" | "NEEDS_HUMAN_REVIEW"
    verifierConfidence: float
    verifierFlags: list[dict]
    retryCount: int
    modelVersion: str = "gemini-2.0-flash"
    requestId: str = ""
    audit_trail: list[dict] = field(default_factory=list)


def run(
    filing_id: str,
    section_key: str,
    input_variables: dict,
    rag_enabled: bool = True,
    max_retries: int = 3,
    request_id: str = "",
) -> DraftResult:
    """
    Main entry point — runs the full 5-step drafting pipeline.
    Called by POST /ml/draft via the FastAPI server.
    """
    section_title = SECTION_TITLES.get(section_key, section_key)
    audit_trail = []
    retry_count = 0
    corrections: list[str] = []

    logger.info(f"[Orchestrator] START | section={section_key} | filing={filing_id} | requestId={request_id}")

    # ── STEP 1: RAG Retrieval ────────────────────────────────────────────────
    t0 = time.time()
    if rag_enabled:
        regulation_context = get_regulation_context(section_key, top_k=3)
        logger.info(f"[Orchestrator] RAG retrieved in {time.time()-t0:.2f}s")
    else:
        regulation_context = "RAG disabled. Apply general SEBI ICDR 2018 standards."

    audit_trail.append({"step": "RAG_RETRIEVAL", "success": True, "elapsed_ms": int((time.time()-t0)*1000)})

    source_variables_used = list(input_variables.keys())
    system_prompt = get_system_prompt(section_key)

    # ── Steps 2–5: Generation + Verify Loop ─────────────────────────────────
    last_draft = ""
    verifier_result: dict = {
        "status": "NEEDS_HUMAN_REVIEW",
        "confidence": 0.50,
        "flags": [],
    }
    grounding_failures = 0

    while retry_count <= max_retries:
        # ── STEP 2: Generator Inference ────────────────────────────────────
        t1 = time.time()
        user_prompt = build_user_prompt(
            section_key=section_key,
            input_variables=input_variables,
            regulation_context=regulation_context,
            corrections=corrections if corrections else None,
        )

        try:
            draft_text = call_llm(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.3 if retry_count == 0 else 0.2,  # lower temp on retries
                max_tokens=2048,
                json_mode=False,
            )
        except Exception as e:
            logger.error(f"[Orchestrator] Generator failed on attempt {retry_count}: {e}")
            draft_text = f"[Generation failed: {e}. Manual drafting required.]"
            break

        last_draft = draft_text
        gen_elapsed = int((time.time()-t1)*1000)
        logger.info(f"[Orchestrator] Generator done in {gen_elapsed}ms | retry={retry_count}")

        # ── STEP 3: Grounding Check ─────────────────────────────────────────
        t2 = time.time()
        grounding = check_grounding(draft_text, input_variables)
        grd_elapsed = int((time.time()-t2)*1000)

        audit_trail.append({
            "step": "GENERATOR",
            "retry": retry_count,
            "groundingPassed": grounding.passed,
            "elapsed_ms": gen_elapsed + grd_elapsed,
        })

        if not grounding.passed:
            grounding_failures += 1
            logger.warning(f"[Orchestrator] Grounding FAILED | {grounding.message}")

            if grounding_failures <= MAX_GROUNDING_RETRIES:
                # Add grounding correction and loop back to generator
                corrections.append(
                    f"GROUNDING ERROR: The following numbers were NOT in inputVariables and must be removed: "
                    f"{grounding.hallucinated_numbers}. Only use figures from the INPUT VARIABLES section."
                )
                retry_count += 1
                continue
            else:
                # Accept draft with grounding warning after max retries
                logger.warning("[Orchestrator] Max grounding retries exceeded — accepting draft with warning")

        # ── STEP 4: Verifier Inference ──────────────────────────────────────
        t3 = time.time()
        verifier_result = score_compliance(
            section_key=section_key,
            drafted_text=draft_text,
            input_variables=input_variables,
            regulation_context=regulation_context,
        )
        ver_elapsed = int((time.time()-t3)*1000)
        logger.info(
            f"[Orchestrator] Verifier done in {ver_elapsed}ms | "
            f"status={verifier_result['status']} confidence={verifier_result['confidence']:.2f}"
        )

        audit_trail.append({
            "step": "VERIFIER",
            "retry": retry_count,
            "status": verifier_result["status"],
            "confidence": verifier_result["confidence"],
            "flagCount": len(verifier_result.get("flags", [])),
            "elapsed_ms": ver_elapsed,
        })

        # ── STEP 5: Routing & Retry Logic ───────────────────────────────────
        confidence = verifier_result["confidence"]

        if confidence >= CONFIDENCE_PASS:
            # Done — high-confidence compliant draft
            logger.info(f"[Orchestrator] DONE — confidence={confidence:.2f} >= {CONFIDENCE_PASS} | status=AI_DRAFT_READY")
            break

        elif confidence < CONFIDENCE_RETRY_MIN and retry_count < max_retries:
            # Low confidence — append verifier flags as corrections and retry
            verifier_flags = verifier_result.get("flags", [])
            corrections = [f"{f['type']}: {f['justification']}" for f in verifier_flags]
            logger.info(f"[Orchestrator] Retrying — confidence={confidence:.2f} < {CONFIDENCE_RETRY_MIN} | retry={retry_count+1}")
            retry_count += 1
            continue

        else:
            # Mid-confidence or retries exhausted → NEEDS_HUMAN_REVIEW
            logger.info(f"[Orchestrator] NEEDS_HUMAN_REVIEW — confidence={confidence:.2f} retries={retry_count}")
            break

    # Determine final rules engine status (PASS if no grounding failures, FAIL if had any)
    rules_engine_status = "FAIL" if grounding_failures > 0 else "PASS"

    return DraftResult(
        section=section_title,
        sectionKey=section_key,
        draftedText=last_draft,
        sourceVariablesUsed=source_variables_used,
        rulesEngineStatus=rules_engine_status,
        verifierStatus=verifier_result["status"],
        verifierConfidence=verifier_result["confidence"],
        verifierFlags=verifier_result.get("flags", []),
        retryCount=retry_count,
        requestId=request_id,
        audit_trail=audit_trail,
    )
