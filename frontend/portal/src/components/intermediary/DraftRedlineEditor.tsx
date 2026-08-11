import React, { useState } from 'react';
import { SectionData } from '../../types';
import { Edit3, Check, RotateCcw, ShieldCheck, History, Save, Sparkles } from 'lucide-react';

interface DraftRedlineEditorProps {
  section: SectionData;
  onSaveRedline: (newText: string) => void;
}

export const DraftRedlineEditor: React.FC<DraftRedlineEditorProps> = ({
  section,
  onSaveRedline
}) => {
  const [editorText, setEditorText] = useState(
    section.humanRedlineText || section.aiDraftText || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveRedline(editorText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetToAI = () => {
    if (confirm('Reset text to original AI Generator draft?')) {
      setEditorText(section.aiDraftText || '');
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      {/* Editor Top Bar */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'var(--color-paper-bg)',
        borderBottom: '1px solid var(--color-border-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Edit3 size={18} color="var(--color-gold-primary)" />
          <div>
            <h4 style={{ fontSize: '16px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)' }}>
              Intermediary Redline & Track Changes Workbench: {section.title}
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              Stage 3 Human Intermediary Authority • Direct Clause Editing Enabled
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleResetToAI}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-ink-muted)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} /> Revert to Raw AI Draft
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              backgroundColor: isSaved ? 'var(--color-cleared-green)' : 'var(--color-gold-primary)',
              color: 'var(--color-ink-obsidian)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            {isSaved ? (
              <>
                <Check size={16} /> Redline Changes Saved!
              </>
            ) : (
              <>
                <Save size={16} /> Save Redline Draft
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Editable Text Area */}
      <div style={{ padding: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          Certified Clause Text (Intermediary Redline Edition):
        </label>

        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          rows={14}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-sharp)',
            border: '1px solid var(--color-border-hairline)',
            fontSize: '15px',
            fontFamily: 'var(--font-serif)',
            lineHeight: '1.8',
            color: 'var(--color-ink-obsidian)',
            backgroundColor: '#FFFFFF',
            outline: 'none'
          }}
        />

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--color-cleared-green)" />
            Stage 3 Audit Trail: All human redlines are timestamped and signed by the Lead Intermediary.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            Word Count: {editorText.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>
    </div>
  );
};
