import React, { useState } from 'react';
import { SectionData } from '../../types';
import { Sparkles, ArrowRight, CheckCircle, Info, FileText } from 'lucide-react';

interface GuidedInputWizardProps {
  section: SectionData;
  onSaveInputs: (inputs: Record<string, string | number>) => void;
  isDrafting: boolean;
}

export const GuidedInputWizard: React.FC<GuidedInputWizardProps> = ({
  section,
  onSaveInputs,
  isDrafting
}) => {
  const [topCustomersShare, setTopCustomersShare] = useState('41.2');
  const [patentDetails, setPatentDetails] = useState('2 Patents filed in India (No. 202421098765)');
  const [dsoDays, setDsoDays] = useState('78');
  const [rawNotes, setRawNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInputs({
      topCustomersShare,
      patentDetails,
      dsoDays,
      rawNotes
    });
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)' }}>
            Stage 1 Input Form: {section.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Provide raw company metrics. Our Dual-Model AI (Generator + Verifier) will draft compliant DRHP clauses.
          </p>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-gold-deep)',
          backgroundColor: 'var(--color-gold-subtle)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sharp)',
          border: '1px solid var(--color-gold-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} /> Guided SME Form
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
              Top 3 Customers Revenue Share (%) *
            </label>
            <input
              type="text"
              value={topCustomersShare}
              onChange={(e) => setTopCustomersShare(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-border-hairline)',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)'
              }}
              placeholder="e.g. 41.2"
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '4px', display: 'block' }}>
              Trigger SEBI ICDR Customer Concentration Disclosure Rules
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
              Average Receivable Days (DSO) *
            </label>
            <input
              type="text"
              value={dsoDays}
              onChange={(e) => setDsoDays(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-border-hairline)',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)'
              }}
              placeholder="e.g. 78"
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '4px', display: 'block' }}>
              Used to evaluate working capital liquidity risks
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
            Intellectual Property & Patents Status
          </label>
          <input
            type="text"
            value={patentDetails}
            onChange={(e) => setPatentDetails(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              fontSize: '14px'
            }}
            placeholder="Specify patent filing numbers or trademarks"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
            Additional Unstructured Notes / Regulatory Clarifications
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
            placeholder="Paste board minutes, key contract clauses, or notes here for AI processing..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border-hairline)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} color="var(--color-gold-primary)" />
            Submitting triggers Stage 1 AI Generator + Verifier evaluation loop.
          </div>

          <button
            type="submit"
            disabled={isDrafting}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              backgroundColor: isDrafting ? '#CBD5E1' : 'var(--color-gold-primary)',
              color: 'var(--color-ink-obsidian)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isDrafting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            {isDrafting ? (
              <>
                <Sparkles className="animate-spin" size={16} /> Stage 1: AI Drafting in Progress...
              </>
            ) : (
              <>
                Save & Trigger AI Pipeline <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
