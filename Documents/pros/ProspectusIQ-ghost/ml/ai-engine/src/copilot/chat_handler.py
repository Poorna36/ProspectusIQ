"""
chat_handler.py — Context-aware SEBI DRHP Copilot.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 6 | blueprint docs/ml/pipeline.md §2.4

Reuses rag/retriever.py and generator/inference_client.py.
Serves both Interface A (PROMOTER) and Interface B (INTERMEDIARY).
"""

from __future__ import annotations
import logging
from typing import Optional

from ..rag.retriever import search_sebi
from ..generator.inference_client import call_llm

logger = logging.getLogger(__name__)

_OUT_OF_SCOPE_RESPONSE = "I can only assist with SEBI DRHP compliance questions."

_PROMOTER_SYSTEM = """You are ProspectusIQ Copilot — a friendly, plain-English SEBI DRHP filing assistant for first-time IPO applicants (company promoters and founders).

Your role:
- Help the promoter understand what information they need to provide for each DRHP section.
- Explain SEBI compliance requirements in simple, jargon-free language.
- When a flag is raised, explain it in plain language and suggest what information the promoter needs to collect.
- NEVER draft actual DRHP text — that is the Generator's job.
- Ground every answer in the filing context and SEBI sources provided.
- If unsure, say "Please consult your assigned Merchant Banker."

Tone: Friendly, supportive, clear. Like a knowledgeable guide.
"""

_INTERMEDIARY_SYSTEM = """You are ProspectusIQ Copilot — a technical SEBI DRHP compliance assistant for certified intermediaries (Merchant Bankers, Legal Counsel, Auditors).

Your role:
- Answer detailed regulatory questions with precise SEBI ICDR clause references.
- When explaining flags, cite the specific SEBI ICDR 2018 regulation being violated.
- Provide actionable guidance on how to resolve deficiencies.
- Reference the filing context (inputVariables, current draft, open flags) in your answers.
- NEVER hallucinate SEBI clause numbers — only cite what is in the retrieved regulatory context.

Tone: Technical, precise, professional. Like a senior compliance partner.
"""

_DRHP_KEYWORDS = [
    "drhp", "sebi", "icdr", "ipo", "prospectus", "risk factor", "filing",
    "section", "chapter", "compliance", "flag", "draft", "verifier", "merchant",
    "disclosure", "financial", "revenue", "allocation", "objects", "business",
    "promoter", "related party", "litigation", "auditor", "regulations",
    "materiality", "quantif", "omission", "mismatch", "claim",
]


def _is_in_scope(user_message: str) -> bool:
    """Quick heuristic to detect out-of-scope questions."""
    msg_lower = user_message.lower()
    return any(kw in msg_lower for kw in _DRHP_KEYWORDS)


def _build_copilot_prompt(
    user_message: str,
    section_key: Optional[str],
    filing_context: dict,
    rag_chunks: list[dict],
    role: str,
) -> str:
    """Assembles the user-turn prompt with all context injected."""
    lines = []

    # Filing context
    if section_key:
        lines.append(f"Active Section: {section_key}")

    input_vars = filing_context.get("inputVariables", {})
    if input_vars:
        vars_str = "\n".join(f"  {k}: {v}" for k, v in input_vars.items())
        lines.append(f"\n[Filing Input Variables]\n{vars_str}")

    current_draft = filing_context.get("currentDraft")
    if current_draft:
        lines.append(f"\n[Current AI Draft (first 600 chars)]\n{current_draft[:600]}")

    open_flags = filing_context.get("openFlags", [])
    if open_flags:
        flags_str = "\n".join(
            f"  - [{f.get('severity','?')}] {f.get('type','?')}: {f.get('description','')}"
            for f in open_flags[:5]
        )
        lines.append(f"\n[Open Compliance Flags]\n{flags_str}")

    # RAG context
    if rag_chunks:
        lines.append("\n[Relevant SEBI Regulatory Context]")
        for i, chunk in enumerate(rag_chunks[:3], 1):
            lines.append(f"[{i}] {chunk['pdf_source']} | {chunk['section']}")
            lines.append(chunk["excerpt"][:400])

    lines.append(f"\n[USER QUESTION]\n{user_message}")
    lines.append("\nProvide a helpful, grounded answer:")

    return "\n".join(lines)


def _build_suggested_actions(section_key: Optional[str], role: str, flags: list[dict]) -> list[str]:
    """Generates contextual quick-reply suggestions for the UI."""
    actions = []

    if flags:
        actions.append("Explain this flag in plain language")
        actions.append("What information do I need to fix this?")

    if section_key == "CH_02":
        actions.append("What quantification does SEBI require for risk factors?")
    elif section_key == "CH_04":
        actions.append("How should fund allocation percentages be presented?")
    elif section_key == "CH_06":
        actions.append("What constitutes an unquantified claim in Business Overview?")
    elif section_key == "CH_11":
        actions.append("What financial years are needed for restated statements?")

    if role == "INTERMEDIARY":
        actions.append("Which SEBI ICDR clause applies here?")
    else:
        actions.append("What should I prepare next?")

    return actions[:4]  # Cap at 4 suggestions


def respond(
    user_message: str,
    section_key: Optional[str],
    filing_context: dict,
    request_id: Optional[str] = None,
) -> dict:
    """
    Main entry point for the Copilot.
    Returns dict matching CopilotResponse schema.
    """
    role = filing_context.get("role", "PROMOTER")
    open_flags = filing_context.get("openFlags", [])

    # Out-of-scope guard
    if not _is_in_scope(user_message):
        return {
            "reply": _OUT_OF_SCOPE_RESPONSE,
            "sources": [],
            "suggestedActions": ["What information do I need for this section?"],
            "requestId": request_id,
        }

    # STEP 1: RAG search on user message + section context
    rag_query = user_message
    if section_key:
        rag_query = f"{section_key} {user_message}"

    try:
        rag_chunks = search_sebi(rag_query, top_k=3, section_key=section_key)
    except Exception as e:
        logger.warning(f"[Copilot] RAG search failed: {e}")
        rag_chunks = []

    # STEP 2: Build prompt and call LLM
    system_prompt = _PROMOTER_SYSTEM if role == "PROMOTER" else _INTERMEDIARY_SYSTEM
    user_prompt = _build_copilot_prompt(
        user_message=user_message,
        section_key=section_key,
        filing_context=filing_context,
        rag_chunks=rag_chunks,
        role=role,
    )

    try:
        reply = call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.4,
            max_tokens=1024,
            json_mode=False,
        )
    except Exception as e:
        logger.error(f"[Copilot] LLM call failed: {e}")
        reply = (
            "I encountered an issue generating a response. Please try rephrasing your question "
            "or consult your Merchant Banker directly."
        )

    # Format sources for response
    sources = [
        {
            "chunk_id":       c["chunk_id"],
            "pdf_source":     c["pdf_source"],
            "section":        c["section"],
            "relevance_score": c["relevance_score"],
            "excerpt":        c["excerpt"][:200],
        }
        for c in rag_chunks
    ]

    return {
        "reply": reply,
        "sources": sources,
        "suggestedActions": _build_suggested_actions(section_key, role, open_flags),
        "requestId": request_id,
    }
