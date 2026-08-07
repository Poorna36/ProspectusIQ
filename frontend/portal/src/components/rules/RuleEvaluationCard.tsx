import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { SourceReference } from '../shared/SourceReference';
import { ShieldAlert, ExternalLink, ArrowRight, CornerDownRight, Scale } from 'lucide-react';

interface RuleEvaluationCardProps {
  ruleId?: string;
  ruleTitle?: string;
  severity?: 'BLOCKER' | 'WARNING' | 'INFO';
  status?: 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED';
  ruleAuthority?: string;
  detectedValue?: string;
  allowedValue?: string;
  sourceDoc?: string;
  sourceLocation?: string;
  explanation?: string;
  recommendedAction?: string;
  linkedSection?: string;
  onViewEvidence?: () => void;
  onOpenClause?: () => void;
}

export const RuleEvaluationCard: React.FC<RuleEvaluationCardProps> = ({
  ruleId = 'SME-ELIG-04',
  ruleTitle = 'Post-Issue Paid-Up Capital SME Ceiling Check',
  severity = 'BLOCKER',
  status = 'FAILED',
  ruleAuthority = 'NSE Emerge Eligibility Criteria (v2026.1)',
  detectedValue = '₹31.40 Crore',
  allowedValue = '₹25.00 Crore Ceiling',
  sourceDoc = 'Capital Structure.xlsx',
  sourceLocation = 'Sheet 2 • Cell F17',
  explanation = 'The post-issue paid-up equity capital exceeds the statutory ₹25 Crore maximum threshold permitted for listing on the NSE Emerge SME platform.',
  recommendedAction = 'Scale down public issue size or reclassify offering to Mainboard platform.',
  linkedSection = 'Capital Structure & Issue Details',
  onViewEvidence,
  onOpenClause
}) => {
  const isBlocker = severity === 'BLOCKER';

  return (
    <div style={{
      backgroundColor: isBlocker ? 'var(--status-failed-bg)' : 'var(--color-surface-white)',
      border: `1px solid ${isBlocker ? 'var(--status-failed-border)' : 'var(--color-border-stone)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '16px'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: isBlocker ? '#FFFFFF' : 'var(--color-primary-text)',
            backgroundColor: isBlocker ? 'var(--color-brick-red)' : 'var(--color-secondary-charcoal)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)'
          }}>
            {severity} · {ruleId}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-secondary-text)', fontWeight: 600 }}>
            Source: {ruleAuthority}
          </span>
        </div>

        <StatusBadge variant={status === 'PASSED' ? 'passed' : isBlocker ? 'failed' : 'review'} />
      </div>

      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
        {ruleTitle}
      </h4>

      <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)', lineHeight: '1.5', marginBottom: '14px' }}>
        {explanation}
      </p>

      {/* Detected vs Allowed Threshold Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px',
        marginBottom: '14px',
        fontSize: '12px'
      }}>
        <div>
          <span style={{ color: 'var(--color-secondary-text)', fontWeight: 600 }}>Detected Value in Filing:</span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: isBlocker ? 'var(--color-brick-red)' : 'var(--color-primary-text)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {detectedValue}
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--color-secondary-text)', fontWeight: 600 }}>Allowed Regulatory Threshold:</span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-passed-color)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {allowedValue}
          </div>
        </div>
      </div>

      {/* Recommended Remediation Action */}
      <div style={{
        backgroundColor: 'var(--color-warm-ivory)',
        borderLeft: '3px solid var(--color-deep-forest)',
        padding: '10px 12px',
        fontSize: '12px',
        color: 'var(--color-primary-text)',
        marginBottom: '14px'
      }}>
        <strong>Recommended Action:</strong> {recommendedAction}
      </div>

      {/* Footer Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-stone)', fontSize: '12px' }}>
        <SourceReference documentName={sourceDoc} location={sourceLocation} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onViewEvidence || (() => alert(`Opening evidence details for ${ruleId}...`))}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-stone)',
              backgroundColor: 'var(--color-surface-white)',
              color: 'var(--color-primary-text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            [View Evidence]
          </button>

          <button
            onClick={onOpenClause || (() => alert(`Navigating to section: ${linkedSection}...`))}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'var(--color-deep-forest)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            [Open Related Clause]
          </button>
        </div>
      </div>
    </div>
  );
};
