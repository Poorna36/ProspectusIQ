"""
cross_encoder.py — LLM-as-judge compliance verifier.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 3 | blueprint docs/ml/pipeline.md §2.2

Uses Gemini Flash in JSON mode to evaluate a drafted section against:
  - The input variables (source of truth)
  - Retrieved SEBI regulatory clauses (RAG context)
Returns structured JSON: { status, confidence, flags[] }
"""

from __future__ import annotations
import json
import logging
import re
from typing import Any

from ..generator.inference_client import call_llm
from .taxonomy import DeficiencyType, SECTION_PRIMARY_DEFICIENCY

logger = logging.getLogger(__name__)

_VERIFIER_SYSTEM = """You are a senior SEBI compliance officer and DRHP reviewer with 20 years of experience evaluating Draft Red Herring Prospectus submissions for the Indian securities market.

Your task: Evaluate the provided DRHP section draft against SEBI ICDR 2018 regulations.

You MUST return ONLY a valid JSON object — no markdown, no explanation, just pure JSON.

Output schema (strictly follow this):
{
  "status": "COMPLIANT" | "NON_COMPLIANT" | "NEEDS_HUMAN_REVIEW",
  "confidence": <float between 0.0 and 1.0>,
  "flags": [
    {
      "type": "MATERIALITY_SPECIFICITY" | "UNQUANTIFIED_CLAIM" | "NUMERIC_MISMATCH" | "OMISSION",
      "clause_reference": "<specific SEBI ICDR clause or null>",
      "justification": "<one sentence explanation of the specific issue>"
    }
  ]
}

Status rules:
- COMPLIANT: confidence >= 0.80 AND flags is empty
- NON_COMPLIANT: confidence < 0.60 OR has CRITICAL flags (NUMERIC_MISMATCH or OMISSION)
- NEEDS_HUMAN_REVIEW: 0.60 <= confidence < 0.80 OR has MATERIALITY_SPECIFICITY or UNQUANTIFIED_CLAIM flags

Deficiency type definitions:
- MATERIALITY_SPECIFICITY: Risk stated without quantified percentage or financial impact
- UNQUANTIFIED_CLAIM: Assertion like "market leader" without a cited data source
- NUMERIC_MISMATCH: A figure in the draft contradicts the provided input variables
- OMISSION: A mandatory SEBI clause is missing from the draft
"""


def _build_verifier_prompt(
    section_key: str,
    drafted_text: str,
    input_variables: dict,
    regulation_context: str,
) -> str:
    vars_str = "\n".join(f"  {k}: {v}" for k, v in input_variables.items())

    return f"""EVALUATE THE FOLLOWING DRHP SECTION DRAFT:

Section Key: {section_key}

[INPUT VARIABLES — Source of truth for all numeric figures]
{vars_str}

{regulation_context}

[DRAFTED TEXT TO EVALUATE]
{drafted_text}

Evaluate this draft and return ONLY the JSON compliance assessment:"""


def score_compliance(
    section_key: str,
    drafted_text: str,
    input_variables: dict,
    regulation_context: str,
) -> dict[str, Any]:
    """
    Sends draft + context to LLM as judge and returns structured compliance result.
    Always returns a valid dict matching VerifyResponse schema, even on LLM error.
    """
    prompt = _build_verifier_prompt(section_key, drafted_text, input_variables, regulation_context)

    try:
        raw = call_llm(
            system_prompt=_VERIFIER_SYSTEM,
            user_prompt=prompt,
            temperature=0.1,   # Low temp for consistent structured output
            max_tokens=1024,
            json_mode=True,
        )

        # Strip potential markdown fences if model ignores json_mode instruction
        raw_clean = re.sub(r"```(?:json)?\n?", "", raw).strip().rstrip("```").strip()
        result = json.loads(raw_clean)

        # Validate and normalise the response
        return _normalise_result(result)

    except (json.JSONDecodeError, KeyError, Exception) as e:
        logger.error(f"Verifier error for {section_key}: {e}")
        # Safe fallback — send to human review rather than falsely passing
        primary = SECTION_PRIMARY_DEFICIENCY.get(section_key, DeficiencyType.OMISSION)
        return {
            "status": "NEEDS_HUMAN_REVIEW",
            "confidence": 0.65,
            "flags": [
                {
                    "type": primary.value,
                    "clause_reference": "SEBI ICDR 2018, Schedule VI",
                    "justification": f"Verifier encountered an internal error ({type(e).__name__}). Manual review recommended.",
                }
            ],
        }


def _normalise_result(raw: dict) -> dict[str, Any]:
    """Ensures the LLM output conforms to the expected schema."""
    valid_statuses = {"COMPLIANT", "NON_COMPLIANT", "NEEDS_HUMAN_REVIEW"}
    valid_types = {dt.value for dt in DeficiencyType}

    status = raw.get("status", "NEEDS_HUMAN_REVIEW")
    if status not in valid_statuses:
        status = "NEEDS_HUMAN_REVIEW"

    confidence = float(raw.get("confidence", 0.65))
    confidence = max(0.0, min(1.0, confidence))

    raw_flags = raw.get("flags", [])
    clean_flags = []
    for f in raw_flags:
        flag_type = f.get("type", "OMISSION")
        if flag_type not in valid_types:
            flag_type = "OMISSION"
        clean_flags.append({
            "type": flag_type,
            "clause_reference": f.get("clause_reference") or None,
            "justification": str(f.get("justification", "No justification provided")),
        })

    # Status-confidence consistency enforcement
    if status == "COMPLIANT" and confidence < 0.80:
        status = "NEEDS_HUMAN_REVIEW"
    if status == "NON_COMPLIANT" and confidence >= 0.80 and not clean_flags:
        status = "COMPLIANT"

    return {"status": status, "confidence": confidence, "flags": clean_flags}
