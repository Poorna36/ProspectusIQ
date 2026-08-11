import React from 'react';
import { SectionData } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { ShieldCheck, AlertTriangle, CheckCircle2, MessageSquare, CornerDownRight, Check, Eye } from 'lucide-react';

interface AuditPanelProps {
  section: SectionData;
  onSelectEvidenceClaim: (claimText: string, value: string, source: string) => void;
  onResolveFlag: (flagId: string) => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  section,
  onSelectEvidenceClaim,
  onResolveFlag
}) => {
  const openFlags = section.flags.filter((f) => f.status === 'OPEN');
  const resolvedFlags = section.flags.filter((f) => f.status === 'RESOLVED');

  return (
    <aside style={{
      width: '360px',
      backgroundColor: 'var(--color-surface-white)',
      borderLeft: '1px solid var(--color-border-stone)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--color-border-stone)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--color-deep-forest)" />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)' }}>
            Audit & Compliance Status
          </h4>
        </div>

        <StatusBadge variant={openFlags.some((f) => f.severity === 'CRITICAL') ? 'failed' : openFlags.length > 0 ? 'review' : 'passed'} size="sm" />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Verification Score Summary */}
        <div style={{
          backgroundColor: 'var(--color-warm-ivory)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', marginBottom: '8px' }}>
            AI Verifier Pipeline Output:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>AI Verification Score:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{section.aiConfidence || 88}%</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mandatory Clause Coverage:</span>
              <span style={{ color: openFlags.length > 0 ? 'var(--status-review-color)' : 'var(--status-passed-color)', fontWeight: 600 }}>
                {openFlags.length > 0 ? 'Possible Omission' : 'Complete'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Evidence Entailment Support:</span>
              <strong style={{ color: 'var(--status-source-color)' }}>3 of 4 Claims Linked</strong>
            </div>
          </div>
        </div>

        {/* Rule Status Summary */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
            Regulatory Rule Checks ({section.flags.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {section.flags.map((flag) => {
              const isResolved = flag.status === 'RESOLVED';

              return (
                <div
                  key={flag.id}
                  style={{
                    backgroundColor: isResolved ? 'var(--status-passed-bg)' : flag.severity === 'CRITICAL' ? 'var(--status-failed-bg)' : 'var(--status-review-bg)',
                    border: `1px solid ${isResolved ? 'var(--status-passed-border)' : flag.severity === 'CRITICAL' ? 'var(--status-failed-border)' : 'var(--status-review-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <StatusBadge variant={isResolved ? 'approved' : flag.severity === 'CRITICAL' ? 'failed' : 'review'} size="sm" />

                    {!isResolved && (
                      <button
                        onClick={() => onResolveFlag(flag.id)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: 'var(--color-deep-forest)',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Check size={11} /> Resolve
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-text)', marginBottom: '4px' }}>
                    {flag.title}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--color-secondary-text)', lineHeight: '1.4', marginBottom: '8px' }}>
                    {flag.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary-text)' }}>
                    <span>Ref: {flag.clauseReference}</span>
                    <button
                      onClick={() => onSelectEvidenceClaim(flag.title, '41.2%', 'Audited AOC-4 Statement FY25')}
                      style={{ background: 'none', border: 'none', color: 'var(--status-source-color)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Eye size={12} /> Inspect Source
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Thread */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-stone)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={12} /> Reviewer & Promoter Thread
          </div>

          {section.promoterComments && section.promoterComments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {section.promoterComments.map((c, i) => (
                <div key={i} style={{
                  fontSize: '12px',
                  backgroundColor: 'var(--color-warm-ivory)',
                  border: '1px solid var(--color-border-stone)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-primary-text)'
                }}>
                  💬 {c}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--color-secondary-text)', fontStyle: 'italic' }}>
              No comments recorded for this section.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
