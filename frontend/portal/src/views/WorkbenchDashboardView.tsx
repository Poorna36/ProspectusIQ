import React from 'react';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ArrowUpRight } from 'lucide-react';
import { Filing } from '../types';

interface WorkbenchDashboardViewProps {
  filing: Filing;
  onNavigateToEditor: () => void;
}

export const WorkbenchDashboardView: React.FC<WorkbenchDashboardViewProps> = ({ filing, onNavigateToEditor }) => {
  const allFlags = filing.sections.flatMap((s) => s.flags);
  const blockerCount = allFlags.filter((f) => f.severity === 'CRITICAL' && f.status === 'OPEN').length;
  const passedRuleCount = filing.sections.length * 5 - blockerCount;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)' }}>
          Active SME IPO Engagements Overview
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)' }}>
          Institutional portfolio dashboard for Lead Merchant Banker & Counsel.
        </p>
      </div>

      {/* Dynamic Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricCard label="Active IPO Filing" value={filing.companyName} subtext={`Target: ${filing.targetIssueSize}`} />
        <MetricCard label="Filing Readiness" value={`${filing.completionPercent}%`} badge={<StatusBadge variant="review" size="sm" customLabel="In Review" />} />
        <MetricCard label="Critical Blockers" value={blockerCount} subtext="Locks certification until cleared" badge={<StatusBadge variant={blockerCount > 0 ? "failed" : "passed"} size="sm" />} />
        <MetricCard label="Rule Evaluations" value={`${passedRuleCount} / ${filing.sections.length * 5}`} badge={<StatusBadge variant="passed" size="sm" />} />
      </div>

      {/* Dynamic Engagements Portfolio Table */}
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border-stone)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--color-primary-text)',
          fontFamily: 'var(--font-serif)'
        }}>
          Active Filing Portfolio
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-warm-ivory)', borderBottom: '1px solid var(--color-border-stone)', color: 'var(--color-secondary-text)' }}>
              <th style={{ padding: '12px 16px' }}>Filing ID</th>
              <th style={{ padding: '12px 16px' }}>Issuer Name</th>
              <th style={{ padding: '12px 16px' }}>Target Issue</th>
              <th style={{ padding: '12px 16px' }}>Overall Status</th>
              <th style={{ padding: '12px 16px' }}>Readiness</th>
              <th style={{ padding: '12px 16px' }}>Open Blockers</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-border-stone)', backgroundColor: '#FDFBF0' }}>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{filing.id}</td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-primary-text)' }}>{filing.companyName} ⭐</td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{filing.targetIssueSize}</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warm-ivory)', border: '1px solid var(--color-border-stone)' }}>
                  {filing.overallStatus}
                </span>
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-passed-color)' }}>{filing.completionPercent}%</td>
              <td style={{ padding: '14px 16px' }}>
                {blockerCount > 0 ? (
                  <StatusBadge variant="failed" size="sm" customLabel={`${blockerCount} Blocker`} />
                ) : (
                  <StatusBadge variant="passed" size="sm" customLabel="0 Blockers" />
                )}
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                  onClick={onNavigateToEditor}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'var(--color-deep-forest)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Open Filing Editor <ArrowUpRight size={13} />
                </button>
              </td>
            </tr>
            {/* Fake companies for demo volume */}
            <tr style={{ borderBottom: '1px solid var(--color-border-stone)', backgroundColor: '#FFFFFF' }}>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>FL-2026-NVR-42</td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-primary-text)' }}>Novaris Healthtech Ltd</td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹45.0 Cr</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>IN_REVIEW</span>
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#F59E0B' }}>42%</td>
              <td style={{ padding: '14px 16px' }}><StatusBadge variant="failed" size="sm" customLabel="2 Blockers" /></td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button disabled style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#94A3B8', fontSize: '12px', fontWeight: 600, cursor: 'not-allowed' }}>Locked</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-stone)', backgroundColor: '#F9FAFB' }}>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>FL-2026-ECO-19</td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-primary-text)' }}>EcoPower Dynamics</td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹120.0 Cr</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB' }}>DRAFTING</span>
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748B' }}>15%</td>
              <td style={{ padding: '14px 16px' }}><StatusBadge variant="passed" size="sm" customLabel="0 Blockers" /></td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button disabled style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#94A3B8', fontSize: '12px', fontWeight: 600, cursor: 'not-allowed' }}>Locked</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-stone)', backgroundColor: '#FFFFFF' }}>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>FL-2026-SYN-08</td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-primary-text)' }}>Synergy Retail Group</td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹85.5 Cr</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>CERTIFIED</span>
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10B981' }}>100%</td>
              <td style={{ padding: '14px 16px' }}><StatusBadge variant="passed" size="sm" customLabel="0 Blockers" /></td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button disabled style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#94A3B8', fontSize: '12px', fontWeight: 600, cursor: 'not-allowed' }}>Sealed</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
