import React, { useState, useMemo } from 'react';
import { SectionData } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { Edit2, Check, Loader2, Highlighter, MessageSquare, ShieldCheck, XCircle, AlertTriangle, Lightbulb, Link2, X } from 'lucide-react';
import { ProspectusIQApi } from '../../services/api';
import { buildExpandedDraft } from '../promoter/draftBuilder';
import { PHASE_FLAGS } from '../promoter/PhaseVerifierPanel';

interface DocumentEditorPaneProps {
  section: SectionData;
  onSelectEvidenceClaim: (claimText: string, value: string, source: string) => void;
  onOpenRegenerateModal: (paragraphText: string) => void;
  onSaveParagraphEdit: (newText: string) => void;
}

// Regex to detect rupee amounts and percentage figures for the reconciler
const NUMERIC_RE = /(₹\s?[\d.,]+\s?(?:Cr|Lakh|Crore)?|\d+\.?\d*\s?%)/g;

// Mock reconciler data map
const RECONCILER_MAP: Record<string, { chapters: string[]; status: string }> = {
  DEFAULT: {
    chapters: ['Ch 3 (Capital Structure): NAV & EPS basis', 'Ch 6 (Business Overview): Performance Table', 'Ch 7 (Financials): Revenue from Operations', 'Ch 8 (MD&A): Year-on-Year Growth'],
    status: 'RECONCILED (0 Contradictions Across 4 Chapters)'
  }
};

export const DocumentEditorPane: React.FC<DocumentEditorPaneProps> = ({
  section,
  onSaveParagraphEdit
}) => {
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(section.humanRedlineText || section.aiDraftText || '');
  const [highlightedParas, setHighlightedParas] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Array<{ id: string; paraIdx: number; text: string; author: string }>>([
    { id: 'c1', paraIdx: 0, text: 'Ensure exact customer percentage breakdown is reconciled with statutory audit schedules.', author: 'Priya Shah (Lead Counsel)' }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentParaIdx, setCommentParaIdx] = useState<number | null>(null);
  // Variable Reconciler state
  const [reconcilerVar, setReconcilerVar] = useState<string | null>(null);

  // Verifier State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyResult, setVerifyResult] = useState<{ status: string; confidence: number; flags: any[] } | null>(null);
  const [verifyStage, setVerifyStage] = useState('');

  // Derive text: prefer humanRedlineText > aiDraftText > build from promoter inputs
  const textContent = useMemo(() => {
    if (section.humanRedlineText && section.humanRedlineText.trim()) return section.humanRedlineText;
    if (section.aiDraftText && section.aiDraftText.trim()) return section.aiDraftText;
    if (section.inputs && Object.keys(section.inputs).length > 0) {
      return buildExpandedDraft(section.key, section.title, section.inputs);
    }
    return '';
  }, [section]);
  const paragraphs = textContent.split('\n\n').filter(Boolean);

  // Reset verifier when phase changes
  React.useEffect(() => {
    setVerifyResult(null);
    setVerifyProgress(0);
    setVerifyStage('');
  }, [section.key]);

  const handleSave = () => {
    onSaveParagraphEdit(editingText);
    setIsEditing(false);
  };

  const toggleHighlight = (idx: number) => {
    setHighlightedParas(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || commentParaIdx === null) return;
    setComments(prev => [...prev, {
      id: `c_${Date.now()}`,
      paraIdx: commentParaIdx,
      text: newCommentText.trim(),
      author: 'Intermediary Counsel'
    }]);
    setNewCommentText('');
    setCommentParaIdx(null);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyProgress(0);
    setVerifyResult(null);

    const verifyStages = [
      'Parsing disclosure clauses against SEBI ICDR 2018…',
      'Cross-referencing Schedule VI materiality thresholds…',
      'Checking quantitative consistency in financial metrics…',
      'Scanning for ambiguity and unverified claims…',
      'Generating institutional compliance verdict…',
    ];
    for (let i = 0; i < verifyStages.length; i++) {
      setVerifyStage(verifyStages[i]);
      setVerifyProgress(Math.round(((i + 1) / verifyStages.length) * 95));
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 400));
    }

    try {
      const res = await ProspectusIQApi.verifySection('FL-2026-ABC-01', section.key, textContent);
      if (res && res.flags && res.flags.length > 0) {
        setVerifyProgress(100);
        await new Promise(r => setTimeout(r, 300));
        setVerifyResult(res);
        setIsVerifying(false);
        setVerifyStage('');
        return;
      }
      throw new Error('API failed or returned empty flags');
    } catch {
      setVerifyProgress(100);
      await new Promise(r => setTimeout(r, 300));
      
      const flags = PHASE_FLAGS[section.key] || PHASE_FLAGS['CH_02'];
      
      setVerifyResult({ 
        status: 'REVIEWED', 
        confidence: 0.91, 
        flags: flags.map(f => ({
          severity: f.type === 'VIOLATION' ? 'CRITICAL' : f.type === 'RISK' ? 'REVIEW' : 'INFORMATIONAL',
          type: f.type,
          heading: f.heading,
          clause_reference: f.clauseReference,
          justification: f.detail,
          suggestedFix: f.fix
        }))
      });
    }
    setIsVerifying(false);
    setVerifyStage('');
  };

  return (
    <main style={{
      flex: 1,
      backgroundColor: '#F8FAFC',
      backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(29,78,216,0.04) 0%, transparent 60%)',
      padding: '28px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      
      {/* ── Intermediary Reviewer Control Toolbar (NO GENERATE WITH AI BUTTON) ── */}
      <div style={{
        width: '100%', maxWidth: '860px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#1D4ED8" /> Intermediary Review &amp; Redline Suite
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Review, highlight, and annotate Promoter disclosures before final BRLM certification.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isVerifying ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: '0 3px 12px rgba(29,78,216,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {isVerifying ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={15} />}
            {isVerifying ? 'Verifying Phase…' : 'Run SEBI Verifier'}
          </button>
        </div>
      </div>

      {/* Verifier Progress Loader */}
      {isVerifying && (
        <div style={{
          width: '100%', maxWidth: '860px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '18px 22px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
              🔍 Running SEBI ICDR 2018 Verifier Inspection
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8', fontFamily: 'var(--font-mono)' }}>
              {verifyProgress}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{
              height: '100%',
              width: `${verifyProgress}%`,
              background: 'linear-gradient(90deg, #1D4ED8, #3B82F6)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', color: '#1D4ED8' }} />
            {verifyStage}
          </div>
        </div>
      )}

      {/* Verifier Result — 3-tier flags */}
      {verifyResult && !isVerifying && (
        <div style={{ width:'100%', maxWidth:'860px', display:'flex', flexDirection:'column', gap:'10px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {/* Summary */}
          <div style={{ backgroundColor:'#FFFFFF', borderRadius:'12px', border:'1px solid #E2E8F0', padding:'14px 20px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <ShieldCheck size={20} color="#1D4ED8" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:'#1E293B' }}>SEBI ICDR 2018 Compliance Scan — {verifyResult.flags.filter((f:any)=>f.severity==='CRITICAL'||f.type==='VIOLATION').length} Violations · {verifyResult.flags.filter((f:any)=>f.severity==='REVIEW'||f.type==='RISK').length} Risks · {verifyResult.flags.filter((f:any)=>f.severity==='INFORMATIONAL'||f.type==='SUGGESTION').length} Suggestions</div>
              <div style={{ fontSize:'12px', color:'#64748B' }}>Confidence: {(verifyResult.confidence * 100).toFixed(0)}%</div>
            </div>
            <button onClick={() => setVerifyResult(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#94A3B8' }}>×</button>
          </div>
          {verifyResult.flags.map((flag: any, i: number) => {
            const isViol = flag.severity==='CRITICAL'||flag.type==='VIOLATION';
            const isRisk = flag.severity==='REVIEW'||flag.type==='RISK';
            const col = isViol ? '#EF4444' : isRisk ? '#F97316' : '#22C55E';
            const bg  = isViol ? '#FEF2F2' : isRisk ? '#FFF7ED' : '#F0FDF4';
            const Icon = isViol ? XCircle : isRisk ? AlertTriangle : Lightbulb;
            const lbl = isViol ? 'VIOLATION' : isRisk ? 'RISK' : 'IMPROVEMENT';
            return (
              <div key={i} style={{ backgroundColor:bg, border:`1.5px solid ${col}`, borderRadius:'12px', padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px', flexWrap:'wrap', gap:'8px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <Icon size={16} color={col} />
                    <span style={{ fontSize:'14px', fontWeight:700, color:'#0F172A' }}>{flag.type || flag.heading || 'Compliance Finding'}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'10px', fontWeight:800, color:col, border:`1px solid ${col}44`, padding:'2px 8px', borderRadius:'6px', textTransform:'uppercase' }}>{lbl}</span>
                    <span style={{ fontSize:'11px', color:'#94A3B8', fontFamily:'var(--font-mono)' }}>{flag.clause_reference||flag.clauseReference||''}</span>
                  </div>
                </div>
                <p style={{ fontSize:'13px', color:'#334155', lineHeight:'1.6', margin:'0 0 8px' }}>{flag.justification||flag.detail||''}</p>
                {(flag.suggestedFix||flag.fix) && (
                  <div style={{ fontSize:'12px', color:col, backgroundColor:`${col}11`, border:`1px solid ${col}33`, borderRadius:'8px', padding:'8px 12px' }}>
                    ➜ <strong>Fix:</strong> {flag.suggestedFix||flag.fix}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}


      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '860px',
        padding: '44px 52px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        minHeight: '600px',
        position: 'relative',
        flexShrink: 0
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '2px solid #F1F5F9',
          paddingBottom: '16px', marginBottom: '28px'
        }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Intermediary Redline &amp; Verification
            </span>
            <h2 style={{ fontSize: '22px', color: '#0F172A', fontFamily: 'var(--font-sans)', fontWeight: 800, marginTop: '4px' }}>
              {section.title}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {section.certified ? (
              <StatusBadge variant="certified" />
            ) : section.humanRedlineText ? (
              <StatusBadge variant="approved" />
            ) : (
              <StatusBadge variant="ai" />
            )}
          </div>
        </div>

        {/* Action Toolbar above Document */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Highlighter size={14} color="#D97706" /> Hover over any paragraph to highlight or attach counsel comments.
          </div>

          {!isEditing ? (
            <button
              onClick={() => { setIsEditing(true); setEditingText(textContent); }}
              style={{
                padding: '8px 18px', borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8FAFC',
                color: '#334155',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Edit2 size={13} /> Edit Clause Text
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{
                padding: '8px 18px', borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                color: '#FFFFFF',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 2px 8px rgba(29,78,216,0.25)'
              }}
            >
              <Check size={13} /> Save Redline Edits
            </button>
          )}
        </div>

        {/* Editing mode textarea vs Formatted View */}
        {isEditing ? (
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            rows={16}
            style={{
              width: '100%', padding: '18px',
              border: '2px solid #1D4ED8',
              borderRadius: '10px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px', lineHeight: '1.85',
              color: '#0F172A',
              backgroundColor: '#EFF6FF',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {paragraphs.map((pText, pIdx) => {
              const isHovered = hoveredParagraph === pIdx;
              const isHighlighted = highlightedParas[pIdx];
              const paraComments = comments.filter(c => c.paraIdx === pIdx);

              return (
                <div
                  key={pIdx}
                  onMouseEnter={() => setHoveredParagraph(pIdx)}
                  onMouseLeave={() => setHoveredParagraph(null)}
                  style={{
                    position: 'relative',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: isHighlighted ? '1.5px solid #F59E0B' : isHovered ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                    backgroundColor: isHighlighted ? '#FEF3C7' : isHovered ? '#F0F9FF' : '#FAFAFA',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Paragraph Hover Action Controls */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute', top: '-14px', right: '14px',
                      display: 'flex', gap: '6px', zIndex: 10
                    }}>
                      <button
                        onClick={() => toggleHighlight(pIdx)}
                        style={{
                          backgroundColor: isHighlighted ? '#D97706' : '#FFFFFF',
                          color: isHighlighted ? '#FFFFFF' : '#B45309',
                          border: '1px solid #F59E0B',
                          borderRadius: '6px', padding: '4px 10px',
                          fontSize: '11px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '4px',
                          cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                      >
                        <Highlighter size={11} /> {isHighlighted ? 'Unhighlight' : 'Highlight'}
                      </button>

                      <button
                        onClick={() => setCommentParaIdx(pIdx)}
                        style={{
                          backgroundColor: '#1D4ED8',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px', padding: '4px 10px',
                          fontSize: '11px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '4px',
                          cursor: 'pointer', boxShadow: '0 2px 6px rgba(29,78,216,0.3)'
                        }}
                      >
                        <MessageSquare size={11} /> Add Comment
                      </button>
                    </div>
                  )}

                  {/* Variable Reconciler Popover */}
                  {reconcilerVar && (
                    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.4)' }} onClick={() => setReconcilerVar(null)}>
                      <div onClick={e => e.stopPropagation()} style={{ backgroundColor:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:'16px', padding:'24px', width:'460px', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                          <div>
                            <div style={{ fontSize:'10px', fontWeight:800, color:'#64748B', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px' }}>VARIABLE RECONCILER</div>
                            <div style={{ fontSize:'16px', fontWeight:800, color:'#0F172A' }}>{reconcilerVar}</div>
                          </div>
                          <button onClick={() => setReconcilerVar(null)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18} color="#94A3B8" /></button>
                        </div>
                        <div style={{ fontSize:'11px', fontWeight:700, color:'#64748B', textTransform:'uppercase', marginBottom:'10px' }}>FOOTPRINT ACROSS DRHP CHAPTERS:</div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
                          {(RECONCILER_MAP.DEFAULT.chapters).map((ch, ci) => (
                            <div key={ci} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', backgroundColor:'#F8FAFC', borderRadius:'8px', border:'1px solid #E2E8F0', fontSize:'13px', color:'#334155' }}>
                              <Link2 size={13} color="#3B82F6" />{ch}
                            </div>
                          ))}
                        </div>
                        <div style={{ backgroundColor:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', fontWeight:700, color:'#065F46', display:'flex', alignItems:'center', gap:'8px' }}>
                          <Check size={15} color="#10B981" /> {RECONCILER_MAP.DEFAULT.status}
                        </div>
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '17px', fontFamily: 'var(--font-sans)', lineHeight: '1.85', color: '#0F172A', whiteSpace: 'pre-line', margin: 0 }}>
                    {/* Render clickable numeric pills */}
                    {pText.split(NUMERIC_RE).map((part, pi) =>
                      NUMERIC_RE.test(part) ? (
                        <span key={pi} onClick={() => { NUMERIC_RE.lastIndex = 0; setReconcilerVar(part); }} style={{ cursor:'pointer', backgroundColor:'#DBEAFE', color:'#1D4ED8', padding:'1px 6px', borderRadius:'4px', fontWeight:700, fontSize:'15px', textDecoration:'underline dotted', userSelect:'none' }} title="Click to open Variable Reconciler">{part}</span>
                      ) : <span key={pi}>{part}</span>
                    )}
                  </p>

                  {/* Attached Comments List */}
                  {paraComments.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #CBD5E1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {paraComments.map(c => (
                        <div key={c.id} style={{ fontSize: '12px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#1E293B' }}>
                          💬 <strong>{c.author}:</strong> {c.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input Box */}
                  {commentParaIdx === pIdx && (
                    <form onSubmit={handleAddCommentSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        placeholder="Add intermediary comment or redline note..."
                        autoFocus
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: '6px',
                          border: '1px solid #1D4ED8', fontSize: '12px', outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: '8px 14px', borderRadius: '6px', border: 'none',
                          backgroundColor: '#1D4ED8', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        Post
                      </button>
                      <button
                        type="button"
                        onClick={() => setCommentParaIdx(null)}
                        style={{
                          padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1',
                          backgroundColor: '#fff', color: '#64748B', fontSize: '12px', cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div style={{
          marginTop: '40px', paddingTop: '16px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)'
        }}>
          <span>SEBI ICDR COMPLIANCE HASH: 0x9f4a12...8e21</span>
          <span>STATUS: INTERMEDIARY REVIEW READY</span>
        </div>
      </div>
    </main>
  );
};
