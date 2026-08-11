import React from 'react';
import { DueDiligenceRecord } from '../../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, FileSearch, Scale } from 'lucide-react';

interface DueDiligencePanelProps {
  records: DueDiligenceRecord[];
}

export const DueDiligencePanel: React.FC<DueDiligencePanelProps> = ({ records }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border-hairline)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSearch size={20} color="var(--color-gold-primary)" /> Automated Regulatory Due Diligence & API Verification
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Real-time automated integration with government databases (MCA21 Portal, GSTN, E-Courts National Judicial Grid).
          </p>
        </div>

        <button
          onClick={() => alert('Refreshing live API due diligence queries against MCA21 & GSTN...')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sharp)',
            border: '1px solid var(--color-gold-border)',
            backgroundColor: 'var(--color-gold-subtle)',
            color: 'var(--color-gold-deep)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} /> Re-query Live APIs
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {records.map((rec) => (
          <div
            key={rec.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border-hairline)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sharp)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {rec.source}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-obsidian)' }}>
                  {rec.queryType}
                </span>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: rec.status === 'CLEAR' ? 'var(--color-cleared-green)' : 'var(--color-flag-amber)',
                backgroundColor: rec.status === 'CLEAR' ? 'var(--color-cleared-bg)' : 'var(--color-flag-bg)',
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} /> {rec.status}
              </span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
              Target Entity: {rec.entityName}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
              {rec.details}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-hairline)', fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>Verified: {rec.timestamp}</span>
              <span style={{ color: 'var(--color-gold-deep)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Raw JSON <ExternalLink size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
