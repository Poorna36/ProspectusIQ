import React, { useState } from 'react';
import { SectionData } from '../../types';
import { Sparkles, ArrowRight, Info, FileText, CheckCircle2 } from 'lucide-react';

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
  const [rawNotes, setRawNotes] = useState(
    `Company Overview & Background:\nTechNova Solutions Limited is an established enterprise AI and cloud-native software solutions provider incorporated in Pune, Maharashtra. We specialize in automated diagnostic telemetry, GPU-based high-performance computing, and enterprise SaaS analytics for mid-market clients across BFSI and healthcare sectors.\n\nKey Strategic Priorities:\n1. Expand R&D operations at Chakan, Pune with 16x H100 GPU compute clusters.\n2. Strengthen working capital buffer to support 60-day inventory holding cycles.\n3. Repay high-cost debt to optimize debt coverage ratios prior to NSE Emerge listing.`
  );

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
      backgroundColor: '#1E1B18',
      borderRadius: '16px',
      border: '1px solid #44403C',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      color: '#F5F5F4',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#F97316" /> Company Information &amp; Custom Draft Editor — {section.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '4px' }}>
            Enter raw corporate metrics or paste full disclosure text. AI will ground claims against SEBI ICDR 2018 regulations.
          </p>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#F97316',
          backgroundColor: 'rgba(249,115,22,0.12)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(249,115,22,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} /> Guided SME Input
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Key Numerical Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D6D3D1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Top 3 Customers Share (%) *
            </label>
            <input
              type="text"
              value={topCustomersShare}
              onChange={(e) => setTopCustomersShare(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #57534E',
                backgroundColor: '#2A2723',
                color: '#FAFAF9',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
              placeholder="e.g. 41.2"
              required
            />
            <span style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px', display: 'block' }}>
              SEBI ICDR concentration rule
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D6D3D1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Receivable Days (DSO) *
            </label>
            <input
              type="text"
              value={dsoDays}
              onChange={(e) => setDsoDays(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #57534E',
                backgroundColor: '#2A2723',
                color: '#FAFAF9',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
              placeholder="e.g. 78"
              required
            />
            <span style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px', display: 'block' }}>
              Working capital liquidity check
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D6D3D1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Patents / IP Details
            </label>
            <input
              type="text"
              value={patentDetails}
              onChange={(e) => setPatentDetails(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #57534E',
                backgroundColor: '#2A2723',
                color: '#FAFAF9',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Specify patent filing numbers"
            />
            <span style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px', display: 'block' }}>
              Statutory patent reference
            </span>
          </div>
        </div>

        {/* Big Large Text Editor Area */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAF9', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Full Company Direct Disclosure &amp; Raw Information Editor *</span>
            <span style={{ fontSize: '11px', color: '#F97316', fontWeight: 600 }}>Multi-paragraph text supported</span>
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              minHeight: '260px',
              padding: '18px 20px',
              borderRadius: '12px',
              border: '1.5px solid #F97316',
              backgroundColor: '#141210',
              color: '#F5F5F4',
              fontSize: '14px',
              lineHeight: '1.8',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'vertical',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
            }}
            placeholder="Type or paste company details, operational background, board decisions, or custom disclosures here..."
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #44403C', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="#F97316" />
            Saved inputs automatically enrich the AI generation pipeline and verifier checks.
          </div>

          <button
            type="submit"
            disabled={isDrafting}
            style={{
              padding: '13px 28px',
              borderRadius: '10px',
              border: 'none',
              background: isDrafting ? '#57534E' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isDrafting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
              transition: 'all 0.2s'
            }}
          >
            {isDrafting ? (
              <>
                <Sparkles className="animate-spin" size={16} /> Generating DRHP Prose...
              </>
            ) : (
              <>
                Save Inputs &amp; Generate DRHP Draft <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
