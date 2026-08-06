"""
taxonomy.py — The 4 SEBI DRHP compliance deficiency types.
Spec: ML_SESSION_CONTEXT.md §PRIORITY 3 | blueprint docs/ml/data.md §3
"""

from enum import Enum


class DeficiencyType(str, Enum):
    MATERIALITY_SPECIFICITY = "MATERIALITY_SPECIFICITY"
    """
    Risk Factors section: A risk or business concentration is mentioned but
    NOT quantified. e.g. "We rely on few customers" instead of providing %.
    Source: SEBI ICDR Schedule VI — Risk Factors requirements.
    """

    UNQUANTIFIED_CLAIM = "UNQUANTIFIED_CLAIM"
    """
    Business Overview section: Subjective buzzword stated without a cited
    source. e.g. "We are the premier manufacturer" without market share data.
    Source: SEBI ICDR Schedule VI — Business Overview requirements.
    """

    NUMERIC_MISMATCH = "NUMERIC_MISMATCH"
    """
    Objects of the Issue / Financial sections: A figure in the drafted prose
    contradicts the inputVariables dictionary or financial restatements.
    Source: SEBI ICDR Schedule VI — Objects of Issue / Financial Statement.
    """

    OMISSION = "OMISSION"
    """
    Any section: A mandatory clause required by SEBI ICDR regulation (surfaced
    via RAG retrieval) is absent from the draft.
    Source: SEBI ICDR 2018, various regulations.
    """


# Human-readable descriptions used in flag justifications
DEFICIENCY_DESCRIPTIONS = {
    DeficiencyType.MATERIALITY_SPECIFICITY: (
        "Risk statement lacks quantification. SEBI ICDR requires material risks to be "
        "disclosed with specific percentages or financial impact figures."
    ),
    DeficiencyType.UNQUANTIFIED_CLAIM: (
        "Subjective claim made without cited data source. SEBI requires all material "
        "assertions to be backed by verifiable evidence or citations."
    ),
    DeficiencyType.NUMERIC_MISMATCH: (
        "Numeric figure in draft does not match the provided input variables or restated "
        "financial data. This constitutes a material misstatement risk."
    ),
    DeficiencyType.OMISSION: (
        "Mandatory SEBI ICDR disclosure clause identified via regulatory RAG retrieval "
        "is absent from the current draft text."
    ),
}

# Maps section keys to the most common deficiency type for that section
SECTION_PRIMARY_DEFICIENCY: dict[str, DeficiencyType] = {
    "CH_02": DeficiencyType.MATERIALITY_SPECIFICITY,
    "CH_04": DeficiencyType.NUMERIC_MISMATCH,
    "CH_05": DeficiencyType.NUMERIC_MISMATCH,
    "CH_06": DeficiencyType.UNQUANTIFIED_CLAIM,
    "CH_10": DeficiencyType.OMISSION,
    "CH_11": DeficiencyType.NUMERIC_MISMATCH,
    "CH_12": DeficiencyType.MATERIALITY_SPECIFICITY,
    "CH_13": DeficiencyType.OMISSION,
}
