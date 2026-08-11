import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { ArrowLeft, FileText, CheckCircle2, UserCheck, ExternalLink, ShieldCheck, Eye } from 'lucide-react';

interface EvidenceInspectorPanelProps {
  claimTitle: string;
  displayedValue: string;
  sourceDocument: string;
  onBackToAuditPanel: () => void;
}

export const EvidenceInspectorPanel: React.FC<EvidenceInspectorPanelProps> = ({
  claimTitle,
  displayedValue,
  sourceDocument,
  onBackToAuditPanel
}) => {
  return (
    <aside style={{
      width: '440px',
      backgroundColor: 'var(--color-surface-white)',
      borderLeft: '1px solid var(--color-border-stone)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Top Back Action Header */}
      <div style={{
        padding: '14px 18px',
        backgroundColor: 'var(--color-primary-charcoal)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #292C33'
      }}>
        <button
          onClick={onBackToAuditPanel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-warm-ivory)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={16} /> Back to Audit Panel
        </button>

        <StatusBadge variant="source" size="sm" />
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Evidence Provenance Inspector
          </span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginTop: '4px' }}>
            {claimTitle}
          </h3>
        </div>

        {/* Fact Card */}
        <div style={{
          backgroundColor: 'var(--color-warm-ivory)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-md)',
          padding: '18px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)', marginBottom: '4px' }}>Displayed Claim Value in DRHP:</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)' }}>
            {displayedValue}
          </div>

          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-border-stone)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong style={{ color: 'var(--color-secondary-text)' }}>Raw Extracted Value:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>41.2004% (₹1,709.88 Lakhs)</span></div>
            <div><strong style={{ color: 'var(--color-secondary-text)' }}>Extraction Method:</strong> Automated PDF Table Extraction (OCR v4.1)</div>
            <div><strong style={{ color: 'var(--color-secondary-text)' }}>Extraction Confidence:</strong> 99.4%</div>
          </div>
        </div>

        {/* Source Document Details */}
        <div style={{
          backgroundColor: 'var(--color-surface-white)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-md)',
          padding: '18px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-text)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} color="var(--status-source-color)" /> Source Document Location:
          </div>

          <div style={{ fontSize: '13px', color: 'var(--color-primary-text)', fontWeight: 600, marginBottom: '4px' }}>
            {sourceDocument}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
            Location: Sheet 2 • Cell F17 • Row 14 (Page 42)
          </div>

          <button
            onClick={() => alert('Opening raw document viewer for Audited AOC-4 Statement FY25 at Sheet 2 Cell F17...')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-stone)',
              backgroundColor: 'var(--color-warm-ivory)',
              color: 'var(--color-primary-text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={13} /> View Source PDF Sheet
          </button>
        </div>

        {/* Audit Verification Trail */}
        <div style={{
          backgroundColor: 'var(--color-surface-white)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-md)',
          padding: '18px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-text)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--status-passed-color)" /> Rule Evaluations & Usage:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StatusBadge variant="passed" size="sm" customLabel="SEBI ICDR Sch VI (Customer Conc.)" />
            </div>
            <div style={{ color: 'var(--color-secondary-text)' }}>Used in 4 DRHP Sections: Risk Factors, Business Overview, Financial Highlights, Objects.</div>
            <div style={{ marginTop: '6px', color: 'var(--status-approved-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCheck size={14} /> Verified by Priya Shah (Lead Counsel) on Aug 6, 2026
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
