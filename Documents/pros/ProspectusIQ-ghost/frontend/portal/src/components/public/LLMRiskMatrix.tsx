import React from 'react';

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
      prospectusIQ: 'Deterministic Rules Engine verifies mandatory clause coverage before drafting.'
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
      background: 'radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.12) 0%, transparent 60%), linear-gradient(180deg, #141820 0%, #0E1014 100%)',
      borderBottom: '1px solid #1E2028',
      padding: '80px 48px',
      color: '#F5F2EA',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            Regulatory Risk Mitigation
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
            Why Standard LLM Drafting Fails Regulatory Filings
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px' }}>
            Comparing raw generative outputs vs ProspectusIQ's deterministic assurance engine.
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(20,24,32,0.9)',
          border: '1.5px solid #2A2D35',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#141820', color: '#F5F2EA', borderBottom: '1px solid #2A2D35' }}>
                <th style={{ padding: '18px 24px', width: '26%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Regulatory Failure Point</th>
                <th style={{ padding: '18px 24px', width: '37%', backgroundColor: 'rgba(239,68,68,0.12)', color: '#F87171', fontWeight: 800 }}>
                  ❌ Standard LLM-Only Output
                </th>
                <th style={{ padding: '18px 24px', width: '37%', backgroundColor: 'rgba(52,211,153,0.12)', color: '#34D399', fontWeight: 800 }}>
                  ✓ ProspectusIQ Controlled Engine
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonItems.map((item, index) => (
                <tr key={item.risk} style={{ borderBottom: index < comparisonItems.length - 1 ? '1px solid #2A2D35' : 'none' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 700, color: '#FAFAF9' }}>
                    {item.risk}
                  </td>
                  <td style={{ padding: '18px 24px', backgroundColor: 'rgba(239,68,68,0.04)', color: '#FCA5A5', lineHeight: '1.6' }}>
                    {item.llmOnly}
                  </td>
                  <td style={{ padding: '18px 24px', backgroundColor: 'rgba(52,211,153,0.04)', color: '#6EE7B7', lineHeight: '1.6', fontWeight: 500 }}>
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
