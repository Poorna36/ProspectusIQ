import React, { useState } from 'react';
import { SectionData } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { Sparkles, Edit2, Check, RotateCcw, Link2, MessageSquare } from 'lucide-react';

interface DocumentEditorPaneProps {
  section: SectionData;
  onSelectEvidenceClaim: (claimText: string, value: string, source: string) => void;
  onOpenRegenerateModal: (paragraphText: string) => void;
  onSaveParagraphEdit: (newText: string) => void;
}

export const DocumentEditorPane: React.FC<DocumentEditorPaneProps> = ({
  section,
  onSelectEvidenceClaim,
  onOpenRegenerateModal,
  onSaveParagraphEdit
}) => {
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(section.humanRedlineText || section.aiDraftText || '');

  const textContent = section.humanRedlineText || section.aiDraftText || '';
  const paragraphs = textContent.split('\n\n').filter(Boolean);

  const handleSave = () => {
    onSaveParagraphEdit(editingText);
    setIsEditing(false);
  };

  return (
    <main style={{
      flex: 1,
      backgroundColor: 'var(--color-warm-ivory)',
      padding: '32px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Legal Printed Document Paper Surface */}
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '820px',
        padding: '48px 56px',
        boxShadow: 'var(--shadow-md)',
        minHeight: '700px',
        position: 'relative'
      }}>
        {/* Document Header Metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--color-border-stone)',
          paddingBottom: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SEBI DRHP Formatted Clause
            </span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)' }}>
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

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '24px' }}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-stone)',
                backgroundColor: 'var(--color-warm-ivory)',
                color: 'var(--color-primary-text)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Edit2 size={13} /> Edit Clauses
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-deep-forest)',
                backgroundColor: 'var(--color-deep-forest)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={13} /> Save Redline Edits
            </button>
          )}
        </div>

        {/* Editable or Document Paragraph Blocks */}
        {isEditing ? (
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            rows={16}
            style={{
              width: '100%',
              padding: '16px',
              border: '1px solid var(--color-border-stone)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'var(--color-primary-text)',
              backgroundColor: 'var(--color-warm-ivory)'
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {paragraphs.map((pText, pIdx) => {
              const isHovered = hoveredParagraph === pIdx;
              const isSelected = selectedParagraphIndex === pIdx;

              return (
                <div
                  key={pIdx}
                  onMouseEnter={() => setHoveredParagraph(pIdx)}
                  onMouseLeave={() => setHoveredParagraph(null)}
                  onClick={() => setSelectedParagraphIndex(pIdx)}
                  style={{
                    position: 'relative',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid var(--color-deep-forest)' : '1px solid transparent',
                    backgroundColor: isSelected ? '#FDFBF3' : isHovered ? 'var(--color-warm-ivory)' : 'transparent',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                >
                  {/* Paragraph Hover Toolbar (AI Regenerate) */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      top: '-14px',
                      right: '12px',
                      backgroundColor: 'var(--color-secondary-charcoal)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-sm)',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-sm)',
                      zIndex: 10
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRegenerateModal(pText);
                        }}
                        style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                      >
                        <Sparkles size={12} color="var(--color-antique-gold)" /> Regenerate Paragraph
                      </button>
                    </div>
                  )}

                  {/* Paragraph Serif Text */}
                  <p style={{
                    fontSize: '15px',
                    fontFamily: 'var(--font-serif)',
                    lineHeight: '1.8',
                    color: 'var(--color-primary-text)',
                    whiteSpace: 'pre-line'
                  }}>
                    {pText}
                  </p>

                  {/* Evidence Interactive Chips */}
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {pText.includes('41.2%') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvidenceClaim('Customer Concentration Share', '41.2%', 'Audited AOC-4 Statement FY25');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <StatusBadge variant="source" customLabel="41.2% Revenue Share (AOC-4 Sheet 2 Cell F17)" size="sm" />
                      </button>
                    )}

                    {pText.includes('₹18.5') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvidenceClaim('ESOP Non-cash Charge', '₹18.5 Lakhs', 'Restated Summary Annexure II');
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', border: 'none', cursor: 'pointer' }}
                      >
                        <StatusBadge variant="failed" customLabel="₹18.5L ESOP Provision Note Required" size="sm" />
                      </button>
                    )}

                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary-text)', alignSelf: 'center' }}>
                      [SEBI ICDR Sch VI]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Document Footer Integrity Stamp */}
        <div style={{
          marginTop: '40px',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border-stone)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--color-secondary-text)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>DOCUMENT INTEGRITY: 0x8b3c912a4e98...f312</span>
          <span>LAST SAVED: JUST NOW</span>
        </div>
      </div>
    </main>
  );
};
