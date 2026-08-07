import React, { useState } from 'react';
import { SectionData, Flag } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, MessageSquare, Send, Eye, Shield } from 'lucide-react';

interface AIDraftPreviewProps {
  section: SectionData;
  onAddComment: (comment: string) => void;
}

export const AIDraftPreview: React.FC<AIDraftPreviewProps> = ({
  section,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(section.flags[0] || null);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      {/* Left: AI Draft Document Viewer */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border-hairline)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Document Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border-hairline)',
          backgroundColor: 'var(--color-paper-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gold-deep)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              SEBI DRHP Formatted Clause Output
            </span>
            <h3 style={{ fontSize: '17px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)' }}>
              {section.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* AI Confidence Badge */}
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-cleared-green)',
              backgroundColor: 'var(--color-cleared-bg)',
              border: '1px solid var(--color-cleared-border)',
              padding: '4px 10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={14} /> AI Verifier Score: {section.aiConfidence || 88}%
            </div>

            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sharp)'
            }}>
              READ-ONLY PROMOTER GUARD
            </div>
          </div>
        </div>

        {/* Verifier Warning Banner */}
        {section.verifierNote && (
          <div style={{
            backgroundColor: 'var(--color-flag-bg)',
            borderBottom: '1px solid var(--color-flag-border)',
            padding: '12px 24px',
            fontSize: '13px',
            color: 'var(--color-flag-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={18} />
            <div>
              <strong>Stage 1 AI Verifier Warning:</strong> {section.verifierNote}
            </div>
          </div>
        )}

        {/* Document Content */}
        <div style={{
          padding: '24px',
          fontSize: '15px',
          lineHeight: '1.8',
          color: 'var(--color-ink-obsidian)',
          fontFamily: 'var(--font-serif)',
          whiteSpace: 'pre-line',
          backgroundColor: '#FFFFFF',
          minHeight: '340px'
        }}>
          {section.aiDraftText || 'Draft pending generation...'}
        </div>

        {/* Promoter Comment Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border-hairline)',
          backgroundColor: 'var(--color-paper-bg)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={14} /> Clarification or Notes for Intermediary Reviewer:
          </div>

          {section.promoterComments && section.promoterComments.length > 0 && (
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {section.promoterComments.map((c, i) => (
                <div key={i} style={{
                  fontSize: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border-hairline)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sharp)',
                  color: 'var(--color-ink-obsidian)'
                }}>
                  💬 <strong>Promoter Note:</strong> {c}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Promoters cannot alter AI text directly. Type your clarification request here..."
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-border-hairline)',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sharp)',
                border: 'none',
                backgroundColor: 'var(--color-ink-obsidian)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} /> Send Note
            </button>
          </form>
        </div>
      </div>

      {/* Right: Compliance Flags Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border-hairline)',
          padding: '18px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} color="var(--color-flag-amber)" /> Stage 1 & 2 Flags ({section.flags.length})
            </h4>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)' }}>
              SEBI ICDR Rules
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {section.flags.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: 'var(--color-cleared-bg)',
                borderRadius: 'var(--radius-sharp)',
                color: 'var(--color-cleared-green)',
                fontSize: '13px'
              }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 6px auto', display: 'block' }} />
                No flags detected. Section is cleared!
              </div>
            ) : (
              section.flags.map((flag) => (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sharp)',
                    border: selectedFlag?.id === flag.id
                      ? '2px solid var(--color-gold-primary)'
                      : `1px solid ${flag.severity === 'CRITICAL' ? 'var(--color-blocked-border)' : 'var(--color-flag-border)'}`,
                    backgroundColor: flag.severity === 'CRITICAL' ? 'var(--color-blocked-bg)' : 'var(--color-flag-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: flag.severity === 'CRITICAL' ? 'var(--color-blocked-red)' : 'var(--color-flag-amber)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {flag.severity} FLAG
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                      {flag.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '4px' }}>
                    {flag.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', lineHeight: '1.4' }}>
                    {flag.clauseReference}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Flag Details Box */}
        {selectedFlag && (
          <div style={{
            backgroundColor: 'var(--color-paper-bg)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-gold-border)',
            padding: '16px',
            fontSize: '12px'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--color-gold-deep)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> AI Verifier Regulatory Remediation:
            </div>
            <p style={{ color: 'var(--color-ink-obsidian)', marginBottom: '10px' }}>
              {selectedFlag.description}
            </p>
            {selectedFlag.suggestedFix && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderLeft: '3px solid var(--color-gold-primary)',
                padding: '8px 10px',
                color: 'var(--color-ink-obsidian)',
                fontStyle: 'italic'
              }}>
                <strong>Recommended Fix:</strong> "{selectedFlag.suggestedFix}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
