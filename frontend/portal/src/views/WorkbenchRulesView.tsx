import React, { useState } from 'react';
import { RuleEvaluationCard } from '../components/rules/RuleEvaluationCard';
import { Cpu, Filter } from 'lucide-react';
import { Filing } from '../types';

interface WorkbenchRulesViewProps {
  filing: Filing;
}

export const WorkbenchRulesView: React.FC<WorkbenchRulesViewProps> = ({ filing }) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'BLOCKER' | 'WARNING'>('ALL');

  const allFlags = filing.sections.flatMap((s) =>
    s.flags.map((f) => ({
      ruleId: f.id,
      ruleTitle: f.title,
      severity: f.severity === 'CRITICAL' ? ('BLOCKER' as const) : ('WARNING' as const),
      status: f.status === 'OPEN' ? (f.severity === 'CRITICAL' ? ('FAILED' as const) : ('REVIEW_REQUIRED' as const)) : ('PASSED' as const),
      ruleAuthority: f.clauseReference,
      detectedValue: 'Value Flagged',
      allowedValue: 'Threshold Checked',
      sourceDoc: 'Filing Source Document',
      sourceLocation: f.clauseReference,
      explanation: f.description,
      recommendedAction: f.suggestedFix || 'Review clause with legal counsel.',
      linkedSection: s.title
    }))
  );

  const filteredRules = allFlags.filter((r) => filterSeverity === 'ALL' || r.severity === filterSeverity);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} color="var(--color-deep-forest)" /> Deterministic Rules Engine Results
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)' }}>
            Transparent regulatory evaluations with exact source cell locations & authority citations.
          </p>
        </div>

        {/* Severity Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="var(--color-secondary-text)" />
          <button
            onClick={() => setFilterSeverity('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-stone)',
              backgroundColor: filterSeverity === 'ALL' ? 'var(--color-primary-charcoal)' : '#FFFFFF',
              color: filterSeverity === 'ALL' ? '#FFFFFF' : 'var(--color-primary-text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Rules ({allFlags.length})
          </button>

          <button
            onClick={() => setFilterSeverity('BLOCKER')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-brick-red)',
              backgroundColor: filterSeverity === 'BLOCKER' ? 'var(--color-brick-red)' : '#FFFFFF',
              color: filterSeverity === 'BLOCKER' ? '#FFFFFF' : 'var(--color-brick-red)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Blockers ({allFlags.filter((f) => f.severity === 'BLOCKER').length})
          </button>
        </div>
      </div>

      {/* Rule Cards List */}
      <div>
        {filteredRules.length > 0 ? (
          filteredRules.map((rule) => (
            <RuleEvaluationCard key={rule.ruleId} {...rule} />
          ))
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-secondary-text)', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border-stone)', borderRadius: 'var(--radius-md)' }}>
            No open rule flags detected for this filing.
          </div>
        )}
      </div>
    </div>
  );
};
