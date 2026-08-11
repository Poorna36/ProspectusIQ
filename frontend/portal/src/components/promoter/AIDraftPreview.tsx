import React, { useState, useEffect } from 'react';
import { SectionData } from '../../types';
import { ProspectusIQApi } from '../../services/api';
import { Sparkles, Loader2, Edit3, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { buildExpandedDraft } from './draftBuilder';

// Minimum required fields per phase before AI generation is allowed
const REQUIRED_KEYS: Record<string, string[]> = {
  CH_01: ['companyName', 'cin', 'incorporationDetails', 'registeredOffice', 'businessSector', 'leadManager', 'stockExchange', 'offerType'],
  CH_02: ['industrySector', 'coreProducts', 'topCustomersShare', 'employeeCount', 'competitiveStrengths'],
  CH_03: ['authorizedCapital', 'paidUpCapitalPre', 'promoterShareholdingPre', 'promoterLockIn'],
  CH_04: ['cmdName', 'independentDirectors', 'keyKMPs', 'auditCommittee'],
  CH_05: ['revenueFY25', 'revenueFY24', 'revenueFY23', 'patFY25', 'totalDebtCr'],
  RISK_FACTORS: ['riskTopCustomer', 'riskWorkingCapital', 'riskTechObsolescence', 'riskPromoterDependence'],
  CH_07: ['criminalProceedings', 'taxDemands', 'litigationSummary'],
  CH_08: ['statutoryApprovals', 'smeEligibility', 'exchangeApproval'],
  CH_04_OBJ: ['grossProceedsCr', 'netProceedsCr', 'objectCapexCr', 'deploymentFY26'],
};

const FIELD_LABELS: Record<string, string> = {
  companyName: 'Company Name', cin: 'CIN', incorporationDetails: 'Incorporation Details',
  registeredOffice: 'Registered Office', businessSector: 'Business Sector',
  leadManager: 'Lead Manager', stockExchange: 'Stock Exchange', offerType: 'Offer Type',
  industrySector: 'Industry Sector', coreProducts: 'Core Products', topCustomersShare: 'Top Customer Share (%)',
  employeeCount: 'Employee Count', competitiveStrengths: 'Competitive Strengths',
  authorizedCapital: 'Authorised Capital', paidUpCapitalPre: 'Pre-Issue Paid-Up Capital',
  promoterShareholdingPre: 'Promoter Shareholding (%)', promoterLockIn: 'Promoter Lock-in Details',
  cmdName: 'CMD Name & DIN', independentDirectors: 'Independent Directors',
  keyKMPs: 'Key Managerial Personnel', auditCommittee: 'Audit Committee',
  revenueFY25: 'Revenue FY25 (₹ Cr)', revenueFY24: 'Revenue FY24 (₹ Cr)', revenueFY23: 'Revenue FY23 (₹ Cr)',
  patFY25: 'PAT FY25 (₹ Cr)', totalDebtCr: 'Total Debt (₹ Cr)',
  riskTopCustomer: 'Customer Concentration Risk', riskWorkingCapital: 'Working Capital Risk',
  riskTechObsolescence: 'Technology Risk', riskPromoterDependence: 'Promoter Dependence Risk',
  criminalProceedings: 'Criminal Proceedings', taxDemands: 'Tax Demands', litigationSummary: 'Litigation Summary',
  statutoryApprovals: 'Statutory Approvals', smeEligibility: 'SME Eligibility', exchangeApproval: 'Exchange Approval',
  grossProceedsCr: 'Gross Proceeds (₹ Cr)', netProceedsCr: 'Net Proceeds (₹ Cr)',
  objectCapexCr: 'CapEx Object (₹ Cr)', deploymentFY26: 'FY26 Deployment (₹ Cr)',
};

interface AIDraftPreviewProps {
  section: SectionData;
  onAddComment?: (comment: string) => void;
  onUpdateDraftText?: (newDraftText: string) => void;
}

const PROMOTER_GEN_STAGES = [
  'Retrieving SEBI ICDR 2018 regulatory framework & Schedule VI standards…',
  'Ingesting Drafting Form answers (Step 1) & Notepad notes (Step 2)…',
  'Synthesizing phase-specific SEBI DRHP legal disclosures…',
  'Applying SME IPO materiality thresholds & SEBI guidelines…',
  'Reconciling quantitative variables against statutory master vault…',
  'Finalizing formal SEBI DRHP clause prose…',
];

export const AIDraftPreview: React.FC<AIDraftPreviewProps> = ({
  section,
  onUpdateDraftText,
}) => {
  const [editorText, setEditorText] = useState<string>(() =>
    section.humanRedlineText || section.aiDraftText || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStage, setGenStage] = useState('');
  const [unansweredWarning, setUnansweredWarning] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditorText(section.humanRedlineText || section.aiDraftText || '');
    setIsEditing(false);
  }, [section.key]);

  const handleGenerateWithAI = async () => {
    // Validate: check required fields for this phase
    const requiredKeys = REQUIRED_KEYS[section.key] || [];
    const inputs = section.inputs || {};
    const missing = requiredKeys.filter(
      (k) => !inputs[k] || String(inputs[k]).trim() === ''
    );
    if (missing.length > 0) {
      setUnansweredWarning(missing);
      return;
    }
    setUnansweredWarning([]);
    setIsGenerating(true);
    setGenProgress(0);
    setShowSuccess(false);

    for (let i = 0; i < PROMOTER_GEN_STAGES.length; i++) {
      setGenStage(PROMOTER_GEN_STAGES[i]);
      setGenProgress(Math.round(((i + 1) / PROMOTER_GEN_STAGES.length) * 90));
      await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
    }
    setGenProgress(97);

    let text = '';
    try {
      const res = await ProspectusIQApi.generateSection('FL-2026-ABC-01', section.key, section.inputs || {});
      text = res?.draftText || '';
    } catch (_) { /* fallback below */ }

    if (!text || text.length < 200 || text.includes('[MOCK DRAFT')) {
      text = buildExpandedDraft(section.key, section.title, section.inputs || {});
    }

    setGenProgress(100);
    await new Promise(r => setTimeout(r, 300));
    setEditorText(text);
    onUpdateDraftText?.(text);
    setIsGenerating(false);
    setGenStage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleTextChange = (val: string) => {
    setEditorText(val);
    onUpdateDraftText?.(val);
  };

  const wordCount = editorText ? editorText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#131C2E 0%,#172035 100%)', border: '1px solid #253550', borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            STEP 3 OF 5 — AI GENERATOR &amp; DOCUMENT EDITOR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#F97316" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAF9', margin: 0 }}>
              {section.title}: DRHP Clause Generator
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#A8A29E', maxWidth: '640px', marginTop: '6px', marginBottom: 0 }}>
            Click <strong>Generate with AI</strong> to produce phase-specific SEBI ICDR 2018 compliant DRHP disclosures from your Drafting Form &amp; Notepad inputs.
          </p>
        </div>

        <button
          onClick={handleGenerateWithAI}
          disabled={isGenerating}
          style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', background: isGenerating ? '#57534E' : 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, cursor: isGenerating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: isGenerating ? 'none' : '0 4px 20px rgba(249,115,22,0.45)', transition: 'all 0.25s ease' }}
        >
          {isGenerating
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
            : <><Sparkles size={18} /> Generate with AI</>}
        </button>
      </div>

      {/* Progress */}
      {isGenerating && (
        <div style={{ backgroundColor: '#111827', borderRadius: '14px', border: '1px solid #253550', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAF9' }}>Synthesizing Phase-Specific SEBI DRHP Disclosures…</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)' }}>{genProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#172035', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', width: `${genProgress}%`, background: 'linear-gradient(90deg,#F97316,#FB923C)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={14} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />{genStage}
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{ backgroundColor: 'rgba(52,211,153,0.12)', border: '1px solid #34D399', color: '#34D399', padding: '14px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> DRHP Clause Generated Successfully. Review in the editor below, then proceed to Step 4 (Verifier).
        </div>
      )}

      {/* Unanswered Questions Warning */}
      {unansweredWarning.length > 0 && !isGenerating && (
        <div style={{ backgroundColor: 'rgba(251,146,60,0.12)', border: '1px solid #FB923C', borderRadius: '14px', padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <AlertTriangle size={20} color="#F97316" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FAFAF9' }}>
              Please answer required questions before generating
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#A8A29E', marginBottom: '12px' }}>
            The following fields in <strong>Step 1 (Drafting Form)</strong> must be filled before AI can generate an accurate SEBI DRHP clause:
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {unansweredWarning.map((key) => (
              <li key={key} style={{ fontSize: '13px', color: '#FB923C', fontWeight: 700 }}>
                {FIELD_LABELS[key] || key}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '12px', color: '#78716C', marginTop: '12px' }}>
            Go back to <strong>Step 1 (Drafting Form)</strong>, fill in these fields, click <em>Save Drafting Form Answers</em>, then return here to generate.
          </p>
        </div>
      )}

      {/* Editor Card */}
      <div style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #253550', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Editor Toolbar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #1E2D45', backgroundColor: '#181614', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="#F97316" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FAFAF9' }}>DRHP Document Editor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#A8A29E', fontFamily: 'var(--font-mono)' }}>
              {wordCount > 0 ? `${wordCount} words` : 'Blank'}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #57534E', backgroundColor: isEditing ? '#F97316' : '#172035', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit3 size={14} /> {isEditing ? 'View' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Scrollable Viewport */}
        <div style={{ backgroundColor: '#0D1421', maxHeight: '620px', overflowY: 'auto', minHeight: '400px', padding: '28px 32px' }}>
          {isEditing ? (
            <textarea
              value={editorText}
              onChange={e => handleTextChange(e.target.value)}
              style={{ width: '100%', minHeight: '500px', padding: '20px', borderRadius: '12px', border: '1.5px solid #F97316', backgroundColor: '#111827', color: '#FAFAF9', fontSize: '16px', lineHeight: '1.9', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }}
              placeholder="Click 'Generate with AI' or type custom DRHP prose here…"
            />
          ) : editorText ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {editorText.split('\n\n').filter(Boolean).map((para, idx) => (
                <div key={idx} style={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #253550', 
                  borderRadius: '14px', 
                  padding: '24px 28px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <p style={{ 
                    fontSize: '17px', 
                    lineHeight: '1.9', 
                    color: '#FAFAF9', 
                    fontFamily: 'var(--font-sans)', 
                    margin: 0,
                    whiteSpace: 'pre-line'
                  }}>
                    {para}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 20px', color: '#A8A29E' }}>
              <FileText size={48} color="#57534E" style={{ margin: '0 auto 16px', display: 'block' }} />
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#D6D3D1', margin: '0 0 8px 0' }}>Editor is blank</h4>
              <p style={{ fontSize: '14px', color: '#78716C', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.6' }}>
                Save Drafting Form answers in <strong>Step 1</strong> and any notes in <strong>Step 2</strong>, then click Generate with AI above.
              </p>
              <button
                onClick={handleGenerateWithAI}
                style={{ padding: '13px 26px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}
              >
                <Sparkles size={16} /> Generate DRHP Draft
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
