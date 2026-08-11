import React, { useState } from 'react';
import { SectionData } from '../../types';
import { Send, CheckCircle2, ShieldCheck, ArrowRight, FileText, Info } from 'lucide-react';

interface PhaseSubmitPanelProps {
  section: SectionData;
  onClearAndSubmit: () => void;
  onSwitchToWorkbench: () => void;
}

export const PhaseSubmitPanel: React.FC<PhaseSubmitPanelProps> = ({
  section,
  onClearAndSubmit,
  onSwitchToWorkbench,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    onClearAndSubmit();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        backgroundColor: '#111827',
        borderRadius: '16px',
        border: '1px solid #253550',
        padding: '36px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: '#F5F5F4',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid #1E2D45',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            STEP 5 OF 5 — SUBMIT PHASE &amp; INTERMEDIARY HANDOFF
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Send size={22} color="#F97316" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAF9', margin: 0 }}>
              {section.title}: Submit Phase Disclosure
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '6px', maxWidth: '780px' }}>
            Finalize this phase and submit the AI-generated disclosures, drafting answers, and verifier audit checks to Lead Legal Counsel &amp; BRLMs.
          </p>
        </div>

        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: section.status === 'CLEARED' ? '#34D399' : '#F97316',
            backgroundColor: section.status === 'CLEARED' ? 'rgba(52,211,153,0.12)' : 'rgba(249,115,22,0.12)',
            padding: '8px 18px',
            borderRadius: '20px',
            border: `1px solid ${section.status === 'CLEARED' ? 'rgba(52,211,153,0.3)' : 'rgba(249,115,22,0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <CheckCircle2 size={15} /> Status: {section.status === 'CLEARED' ? 'CLEARED & READY' : 'DRAFT READY FOR SUBMISSION'}
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '16px', color: '#34D399' }}>
          <CheckCircle2 size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
          <h4 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', color: '#FAFAF9' }}>
            Phase Successfully Submitted!
          </h4>
          <p style={{ fontSize: '14px', color: '#A8A29E', maxWidth: '540px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            <strong>{section.title}</strong> has been cleared and transferred to the Intermediary Workbench for Lead Counsel legal certification.
          </p>

          <button
            onClick={onSwitchToWorkbench}
            style={{
              padding: '12px 26px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(249,115,22,0.4)',
            }}
          >
            Switch to Intermediary Workbench <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div>
          {/* Phase Summary Checklist Card */}
          <div style={{ backgroundColor: '#0D1421', borderRadius: '14px', border: '1px solid #1E2D45', padding: '24px', marginBottom: '28px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FAFAF9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#F97316" /> Phase Handoff Summary Checklist
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #253550' }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 700 }}>1. DRAFTING FORM</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>Answers Recorded</div>
                <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>{Object.keys(section.inputs || {}).length} Fields Saved</div>
              </div>

              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #253550' }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 700 }}>2. AI DRHP PROSE</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>2x Clause Ready</div>
                <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>Grounded in AOC-4 &amp; SEBI Rules</div>
              </div>

              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #253550' }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 700 }}>3. SEBI VERIFIER</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>Audit Inspected</div>
                <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>Schedule VI Verified</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={15} color="#F97316" />
              Submitting updates this phase to <strong>CLEARED</strong> status in the DRHP Filing Dashboard.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={onSwitchToWorkbench}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid #57534E',
                backgroundColor: '#172035',
                color: '#FAFAF9',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Intermediary Workbench View
            </button>

            <button
              onClick={handleSubmit}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(249,115,22,0.45)',
              }}
            >
              <Send size={16} /> Submit &amp; Clear Phase 5 Handoff
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
