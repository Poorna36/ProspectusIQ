import React from 'react';
import { XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const LLMRiskMatrix: React.FC = () => {
  const comparisonItems = [
    {
      risk: 'Hallucinated Financial Figures',
      llmOnly: 'Invents unverified EBITDA growth percentages or historical revenue numbers.',
      prospectusIQ: 'Hardcoded extraction linked strictly to Audited AOC-4 & Restated Statements.'
    },
    {
      risk: 'Missing Mandatory Disclosures',
      llmOnly: 'Omits required SEBI ICDR Schedule VI clauses (e.g. Promoter Group pledging status).',
      prospectusIQ: 'Stage 1 Rules Engine verifies mandatory clause coverage before drafting.'
    },
    {
      risk: 'Unquantified Risk Claims',
      llmOnly: 'Generates vague statements without financial impact metrics.',
      prospectusIQ: 'Requires explicit financial loss percentages & customer concentration ratios.'
    },
    {
      risk: 'Lack of Source Traceability',
      llmOnly: 'Black-box text generation with zero document sheet or cell citations.',
      prospectusIQ: 'Every financial claim is clickable to inspect exact document source & cell location.'
    },
    {
      risk: 'No Accountable Approvals',
      llmOnly: 'Uncontrolled output ready for copy-paste without legal accountability.',
      prospectusIQ: 'Immutable audit trail signed off by Lead Counsel & Merchant Banker.'
    }
  ];

  return (
    <section id="product" style={{
      backgroundColor: 'var(--color-warm-ivory)',
      borderBottom: '1px solid var(--color-border-stone)',
      padding: '64px 32px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-burgundy)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Regulatory Risk Mitigation
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
            Why Uncontrolled LLM Drafting Fails Regulatory Filings
          </h2>
        </div>

        <div style={{
          backgroundColor: 'var(--color-surface-white)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary-charcoal)', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
                <th style={{ padding: '14px 20px', width: '25%' }}>Regulatory Failure Point</th>
                <th style={{ padding: '14px 20px', width: '37.5%', backgroundColor: '#292C33', color: '#FCA5A5' }}>
                  ❌ Standard LLM-Only Output
                </th>
                <th style={{ padding: '14px 20px', width: '37.5%', backgroundColor: 'var(--color-deep-forest)', color: '#A7F3D0' }}>
                  ✓ ProspectusIQ Controlled Engine
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonItems.map((item, index) => (
                <tr key={item.risk} style={{ borderBottom: index < comparisonItems.length - 1 ? '1px solid var(--color-border-stone)' : 'none' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--color-primary-text)' }}>
                    {item.risk}
                  </td>
                  <td style={{ padding: '16px 20px', backgroundColor: '#FDF2F0', color: 'var(--color-brick-red)', lineHeight: '1.4' }}>
                    {item.llmOnly}
                  </td>
                  <td style={{ padding: '16px 20px', backgroundColor: '#E8F5EE', color: 'var(--status-approved-color)', lineHeight: '1.4', fontWeight: 500 }}>
                    {item.prospectusIQ}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
