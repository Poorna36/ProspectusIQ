import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface ParagraphRegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParagraphText: string;
  onAcceptRegeneration: (revisedText: string) => void;
}

export const ParagraphRegenerateModal: React.FC<ParagraphRegenerateModalProps> = ({
  isOpen,
  onClose,
  selectedParagraphText,
  onAcceptRegeneration
}) => {
  const [instruction, setInstruction] = useState('Quantify financial dependence and clarify customer contract termination terms.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [revisedText, setRevisedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setRevisedText(
        `${selectedParagraphText}\n\n[REVISED CLAUSE]: Furthermore, contract termination requires a 180-day prior written notice with full settlement of outstanding receivables, mitigating immediate liquidity shock.`
      );
    }, 1200);
  };

  const handleAccept = () => {
    if (revisedText) {
      onAcceptRegeneration(revisedText);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(24, 26, 31, 0.75)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-stone)',
        width: '100%',
        maxWidth: '680px',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--color-primary-charcoal)',
          color: '#FFFFFF',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #292C33'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-antique-gold)" />
            <h4 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
              Regenerate Disclosure Paragraph
            </h4>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Selected Paragraph Context:
            </label>
            <div style={{
              backgroundColor: 'var(--color-warm-ivory)',
              border: '1px solid var(--color-border-stone)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-primary-text)',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              "{selectedParagraphText}"
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-text)', marginBottom: '6px' }}>
              AI Generation Guidance & Regulatory Instructions:
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-stone)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* Evidence Checkboxes */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary-text)', marginBottom: '6px' }}>
              Select Approved Evidence Sources to Enforce:
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> Audited Financial Statements</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> Management Data Sheet</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> Legal Due Diligence Report</label>
            </div>
          </div>

          {/* Generated Comparison Box */}
          {revisedText && (
            <div style={{
              backgroundColor: '#E8F5EE',
              border: '1px solid var(--status-passed-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              fontSize: '13px',
              fontFamily: 'var(--font-serif)',
              color: 'var(--status-approved-color)'
            }}>
              <div style={{ fontWeight: 700, fontSize: '11px', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✓ Generated Revised Clause Draft:
              </div>
              {revisedText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'var(--color-warm-ivory)',
          borderTop: '1px solid var(--color-border-stone)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-stone)',
              backgroundColor: 'var(--color-surface-white)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          {!revisedText ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: 'var(--color-secondary-charcoal)', // AI action uses Charcoal #292C33, not green
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isGenerating ? 'Generating Revised Draft...' : 'Generate Revised Draft'}
            </button>
          ) : (
            <button
              onClick={handleAccept}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: 'var(--color-deep-forest)', // Primary approval action uses Deep Forest
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={16} /> Accept Revised Paragraph
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
