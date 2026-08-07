import React from 'react';
import { Filing } from '../../types';
import { Building, ShieldCheck, Clock, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface MultiFilingDashboardProps {
  filing: Filing;
  onSelectFiling: (filingId: string) => void;
}

export const MultiFilingDashboard: React.FC<MultiFilingDashboardProps> = ({
  filing,
  onSelectFiling
}) => {
  const filingsList = [
    filing,
    {
      id: 'FL-2026-GREEN-02',
      companyName: 'GreenWatt CleanTech Private Limited',
      cin: 'U40106GJ2022PTC087123',
      gstin: '24AAACG1234F1Z9',
      sector: 'Renewable Energy & Solar Assets',
      targetIssueSize: '₹42.00 Crore',
      completionPercent: 45,
      overallStatus: 'DRAFTING'
    },
    {
      id: 'FL-2026-CRAFT-03',
      companyName: 'CraftLogistics India Limited',
      cin: 'U60231KA2020PLC045890',
      gstin: '29AABCC5678H1Z2',
      sector: 'Cold-Chain & Third-Party Logistics',
      targetIssueSize: '₹19.80 Crore',
      completionPercent: 92,
      overallStatus: 'INTERMEDIARY_REVIEW'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '20px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)' }}>
            Merchant Banker & Legal Counsel Multi-Filing Portfolio
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Active SME IPO DRHP filings under lead manager review.
          </p>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold-deep)', backgroundColor: 'var(--color-gold-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--color-gold-border)' }}>
          3 Assigned Filings
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {filingsList.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelectFiling(f.id)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              border: f.id === filing.id ? '2px solid var(--color-gold-primary)' : '1px solid var(--color-border-hairline)',
              padding: '20px',
              boxShadow: f.id === filing.id ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gold-deep)', fontFamily: 'var(--font-mono)' }}>
                {f.id}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: f.overallStatus === 'INTERMEDIARY_REVIEW' ? 'var(--color-flag-amber)' : 'var(--color-cleared-green)',
                backgroundColor: f.overallStatus === 'INTERMEDIARY_REVIEW' ? 'var(--color-flag-bg)' : 'var(--color-cleared-bg)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sharp)'
              }}>
                {f.overallStatus.replace('_', ' ')}
              </span>
            </div>

            <h4 style={{ fontSize: '16px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
              {f.companyName}
            </h4>

            <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
              Sector: {f.sector} • Target: {f.targetIssueSize}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Completion</span>
                <span style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-mono)' }}>{f.completionPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${f.completionPercent}%`, height: '100%', backgroundColor: 'var(--color-gold-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border-hairline)', fontSize: '12px', fontWeight: 600, color: 'var(--color-gold-deep)' }}>
              <span>Open Review Workbench</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
