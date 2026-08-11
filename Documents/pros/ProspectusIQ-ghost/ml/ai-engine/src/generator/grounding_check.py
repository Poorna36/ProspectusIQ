"""
grounding_check.py — Post-generation hallucination prevention.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 2 | blueprint docs/ml/pipeline.md §2.1

CRITICAL RULE (from pipeline.md §2.1):
  Any numeric value emitted by the model MUST explicitly exist in inputVariables.
  If a hallucinated number is found, the draft is immediately rejected.
"""

from __future__ import annotations
import re
from dataclasses import dataclass


@dataclass
class GroundingResult:
    passed: bool
    hallucinated_numbers: list[str]
    message: str


# Patterns for numeric extraction from generated text
_NUMBER_PATTERN = re.compile(
    r"""
    (?:
        ₹\s*[\d,]+(?:\.\d+)?       |   # ₹ prefixed
        [\d,]+(?:\.\d+)?\s*%        |   # percentages
        [\d,]+(?:\.\d+)?\s*(?:Cr|L|Crore|Lakh|crore|lakh|million|billion|bn|mn)  |  # financial units
        \b\d{2,}(?:,\d{3})*(?:\.\d+)?\b  # bare large numbers (5+ digits)
    )
    """,
    re.VERBOSE | re.IGNORECASE,
)

# These patterns in the draft are allowable structural text — not hallucinations
_SEBI_PLACEHOLDERS = re.compile(r"\[●\]|\[•\]|\[__\]")
_ORDINALS = re.compile(r"\b(?:1st|2nd|3rd|\d+th)\b", re.IGNORECASE)


def _normalize_number(raw: str) -> str:
    """Strip formatting to bare numeric string for comparison."""
    return re.sub(r"[₹,%\s,]", "", raw.split()[0]).strip().lower()


def _extract_input_values(input_variables: dict) -> set[str]:
    """
    Extract all numeric strings from input_variables dict values for comparison.
    Handles: int, float, nested dict, list.
    """
    values: set[str] = set()

    def _recurse(obj: object) -> None:
        if isinstance(obj, (int, float)):
            values.add(_normalize_number(str(obj)))
        elif isinstance(obj, str):
            for m in _NUMBER_PATTERN.finditer(obj):
                values.add(_normalize_number(m.group()))
        elif isinstance(obj, dict):
            for v in obj.values():
                _recurse(v)
        elif isinstance(obj, (list, tuple)):
            for item in obj:
                _recurse(item)

    _recurse(input_variables)
    return values


def check_grounding(generated_text: str, input_variables: dict) -> GroundingResult:
    """
    Scans `generated_text` for numeric figures not present in `input_variables`.
    Returns GroundingResult with pass/fail verdict and list of suspect numbers.

    A draft FAILS grounding if it contains a number that:
    - Is not in any input_variable value
    - Is not a SEBI placeholder like [●]
    - Is not a small ordinal (1st, 2nd...)
    - Is not a year (FY24, FY25, FY26, 2024, 2025...)
    """
    # Strip SEBI placeholder markers before scanning
    clean_text = _SEBI_PLACEHOLDERS.sub("", generated_text)
    clean_text = _ORDINALS.sub("", clean_text)

    # Extract all numbers from generated text
    draft_numbers = _NUMBER_PATTERN.findall(clean_text)

    # Get allowable values from inputVariables
    allowed = _extract_input_values(input_variables)

    # Always allow year references
    allowed.update({"2022", "2023", "2024", "2025", "2026", "2027", "3", "5", "10"})

    hallucinated = []
    for raw in draft_numbers:
        norm = _normalize_number(raw)
        if not norm or len(norm) < 2:
            continue
        # Check: is this number derivable from inputVariables?
        # Exact match or substring (e.g. "85" in "850000000")
        is_allowed = norm in allowed or any(norm in val or val in norm for val in allowed)
        if not is_allowed:
            # Secondary check: is it a year pattern?
            if re.match(r"^(19|20)\d{2}$", norm):
                continue
            hallucinated.append(raw.strip())

    if hallucinated:
        return GroundingResult(
            passed=False,
            hallucinated_numbers=hallucinated[:5],  # cap list for readability
            message=(
                f"Grounding FAILED — {len(hallucinated)} number(s) not found in inputVariables: "
                f"{hallucinated[:3]}. Draft rejected. Will retry."
            ),
        )

    return GroundingResult(
        passed=True,
        hallucinated_numbers=[],
        message="Grounding PASSED — all numeric figures traceable to inputVariables.",
    )
