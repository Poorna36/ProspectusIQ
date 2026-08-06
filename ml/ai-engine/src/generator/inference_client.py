"""
inference_client.py — Calls Gemini Flash API (primary) with Ollama fallback.
Spec: ML_SESSION_CONTEXT.md §10 (LLM Strategy) | §PRIORITY 2
"""

from __future__ import annotations
import os
import json
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Try to import Gemini SDK — gracefully degraded if not installed
try:
    import google.generativeai as genai
    _GEMINI_AVAILABLE = True
except ImportError:
    _GEMINI_AVAILABLE = False
    logger.warning("google-generativeai not installed — Gemini calls will fail gracefully to mock mode")

_GEMINI_MODEL = "gemini-2.0-flash"
_gemini_client_initialized = False


def _init_gemini() -> bool:
    global _gemini_client_initialized
    if _gemini_client_initialized:
        return True
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or not _GEMINI_AVAILABLE:
        return False
    genai.configure(api_key=api_key)
    _gemini_client_initialized = True
    return True


def call_llm(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
    max_tokens: int = 2048,
    json_mode: bool = False,
) -> str:
    """
    Calls Gemini Flash API with system + user prompt.
    Falls back to mock output if Gemini API key not set.

    Returns: string — either drafted text or JSON string (if json_mode=True)
    """
    if _init_gemini():
        return _call_gemini(system_prompt, user_prompt, temperature, max_tokens, json_mode)
    else:
        logger.warning("Gemini API not configured — returning mock LLM output")
        return _mock_llm_output(user_prompt, json_mode)


def _call_gemini(
    system_prompt: str,
    user_prompt: str,
    temperature: float,
    max_tokens: int,
    json_mode: bool,
) -> str:
    """
    Call Gemini 2.0 Flash via google-generativeai SDK.
    Combines system + user prompt into a single user message (Flash API style).
    """
    full_prompt = f"{system_prompt}\n\n{user_prompt}"

    generation_config = genai.types.GenerationConfig(
        temperature=temperature,
        max_output_tokens=max_tokens,
        response_mime_type="application/json" if json_mode else "text/plain",
    )

    model = genai.GenerativeModel(
        model_name=_GEMINI_MODEL,
        generation_config=generation_config,
    )

    response = model.generate_content(full_prompt)
    return response.text.strip()


def _mock_llm_output(user_prompt: str, json_mode: bool) -> str:
    """
    Mock output when Gemini API is unavailable.
    For json_mode (verifier), returns a compliant JSON.
    For text mode (generator), returns a minimal draft stub.
    """
    if json_mode:
        return json.dumps({
            "status": "NEEDS_HUMAN_REVIEW",
            "confidence": 0.72,
            "flags": [
                {
                    "type": "OMISSION",
                    "clause_reference": "SEBI ICDR 2018, Schedule VI",
                    "justification": "Mock verifier — Gemini API key not configured. Manual review required."
                }
            ]
        })
    else:
        # Extract section key hint from the prompt for slightly better mock
        section_hint = "CH_00"
        for ch in ["CH_02", "CH_04", "CH_06", "CH_10", "CH_11"]:
            if ch in user_prompt:
                section_hint = ch
                break

        return (
            f"[MOCK DRAFT — Gemini API key not configured]\n\n"
            f"This is a placeholder draft for section {section_hint}. "
            "The AI Engine requires a GEMINI_API_KEY environment variable to generate real SEBI-compliant prose. "
            "Please set GEMINI_API_KEY in your .env file and restart the ML server.\n\n"
            "In production, this section would contain formally drafted, SEBI ICDR 2018-compliant narrative text "
            "grounded entirely in the provided input variables and retrieved regulatory context."
        )
