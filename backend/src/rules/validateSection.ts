/**
 * Stage 1 — Deterministic Rules Engine
 * Runs synchronously before AI drafting.
 * Returns flags and a PASS/FAIL verdict.
 */

import { SectionKey } from '../types/api';

interface RuleFlag {
  type: string;
  severity: 'CRITICAL' | 'REVIEW' | 'INFO';
  description: string;
  clause_reference: string | null;
}

interface RulesResult {
  status: 'PASS' | 'FAIL';
  flags: RuleFlag[];
}

export function validateSection(
  sectionKey: SectionKey,
  variables: Record<string, unknown>
): RulesResult {
  const flags: RuleFlag[] = [];

  // ── Universal rules (apply to every section) ─────────────────────────────

  // All submitted variables must be non-null / non-empty strings
  for (const [key, value] of Object.entries(variables)) {
    if (value === null || value === undefined || value === '') {
      flags.push({
        type: 'MISSING_REQUIRED_FIELD',
        severity: 'CRITICAL',
        description: `Required field '${key}' is missing or empty.`,
        clause_reference: null,
      });
    }
  }

  // ── Section-specific rules ───────────────────────────────────────────────

  if (sectionKey === 'CH_02') {
    // Risk Factors: must have at least one risk category
    if (!variables['risk_categories'] || (variables['risk_categories'] as string[]).length === 0) {
      flags.push({
        type: 'MISSING_RISK_CATEGORY',
        severity: 'CRITICAL',
        description: 'At least one risk category must be specified for Risk Factors.',
        clause_reference: 'SEBI ICDR 2018, Schedule VI, Clause 2.1',
      });
    }
  }

  if (sectionKey === 'CH_04') {
    // Objects of Issue: fund use percentages must sum to 100
    const allocations = variables['fund_allocations'] as Record<string, number> | undefined;
    if (allocations) {
      const total = Object.values(allocations).reduce((a, b) => a + b, 0);
      if (Math.abs(total - 100) > 0.01) {
        flags.push({
          type: 'FUND_ALLOCATION_MISMATCH',
          severity: 'CRITICAL',
          description: `Fund allocation percentages sum to ${total.toFixed(2)}% — must equal 100%.`,
          clause_reference: 'SEBI ICDR 2018, Schedule VI, Clause 4.1',
        });
      }
    }
  }

  if (sectionKey === 'CH_05') {
    // Basis for Issue Price: P/E ratio must be positive
    const pe = variables['pe_ratio'] as number | undefined;
    if (pe !== undefined && pe <= 0) {
      flags.push({
        type: 'INVALID_PE_RATIO',
        severity: 'CRITICAL',
        description: 'P/E ratio must be a positive number.',
        clause_reference: 'SEBI ICDR 2018, Schedule VI, Clause 5.2',
      });
    }
  }

  if (sectionKey === 'CH_11') {
    // Financial Statements: check for 3 years of restated data
    const years = variables['restated_years'] as number | undefined;
    if (!years || years < 3) {
      flags.push({
        type: 'INSUFFICIENT_FINANCIAL_HISTORY',
        severity: 'CRITICAL',
        description: 'SEBI ICDR requires at least 3 years of restated financial statements.',
        clause_reference: 'SEBI ICDR 2018, Regulation 26(1)',
      });
    }
    // Revenue must be positive
    const revenue = variables['variable_revenue_FY26'] as number | undefined;
    if (revenue !== undefined && revenue <= 0) {
      flags.push({
        type: 'NON_POSITIVE_REVENUE',
        severity: 'CRITICAL',
        description: 'Revenue must be a positive value.',
        clause_reference: null,
      });
    }
  }

  if (sectionKey === 'CH_10') {
    // Promoter Group: check for undisclosed related parties warning
    const relatedParties = variables['related_party_count'] as number | undefined;
    if (relatedParties !== undefined && relatedParties > 10) {
      flags.push({
        type: 'HIGH_RELATED_PARTY_COUNT',
        severity: 'REVIEW',
        description: `${relatedParties} related parties detected — MCA21 cross-check recommended.`,
        clause_reference: 'SEBI ICDR 2018, Schedule VI, Clause 10.3',
      });
    }
  }

  if (['CH_06', 'CH_07', 'CH_08'].includes(sectionKey)) {
    // Business sections: customer concentration risk check
    const topCustomerPct = variables['variable_customer_concentration_top5_pct'] as number | undefined;
    if (topCustomerPct !== undefined && topCustomerPct > 50) {
      flags.push({
        type: 'HIGH_CUSTOMER_CONCENTRATION',
        severity: 'REVIEW',
        description: `Top 5 customers account for ${topCustomerPct}% of revenue — material concentration risk must be disclosed.`,
        clause_reference: 'SEBI ICDR 2018, Schedule VI, Clause 6.2',
      });
    }
  }

  const hasCritical = flags.some(f => f.severity === 'CRITICAL');
  return {
    status: hasCritical ? 'FAIL' : 'PASS',
    flags,
  };
}
