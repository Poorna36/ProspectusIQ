import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';

export const UnstructuredNotesAssist: React.FC = () => {
  const [rawText, setRawText] = useState(
    `Board Meeting Notes (July 15, 2026):
- Company approved expansion into Singapore & Vietnam market. Budget allocated: SGD 450,000.
- Resolved to increase R&D expenditure to 15% of annual revenue for LLM fine-tuning.
- Litigations: Closed commercial arbitration with former supplier Synapse Tech with zero liability.
- Promoter shareholding pledged: 0% pledged as of June 30, 2026.`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<string | null>(null);

  const handleProcessNotes = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStructuredOutput(`AI CLASSIFICATION & CHAPTER MAPPING SUMMARY:

1. [OBJECTS_OF_ISSUE] -> Overseas Expansion Budget: SGD 450,000 (~₹2.80 Cr) mapped to Net Proceeds Capital Expenditure.
2. [BUSINESS_OVERVIEW] -> R&D Commitment (15% revenue) classified under Technology & Intellectual Property.
3. [LITIGATION_DISCLOSURES] -> Synapse Tech Arbitration: Categorized as Resolved/Cleared with Zero Liability.
4. [PROMOTER_DETAILS] -> Encumbrance Check: 0% Share Pledging verified against SEBI ICDR Regulation 14(1).`);
    }, 1200);
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={20} color="var(--color-gold-primary)" /> Organize & Cleanup Unstructured Notes
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Dump raw board minutes, auditor letters, or messy notes. The AI engine will parse, classify, and map them to the correct SEBI DRHP chapters.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Input Textarea */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '8px' }}>
            Unstructured Raw Notes Input:
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              fontSize: '13px',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
            placeholder="Paste raw notes here..."
          />

          <button
            onClick={handleProcessNotes}
            disabled={isProcessing}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              backgroundColor: isProcessing ? '#CBD5E1' : 'var(--color-gold-primary)',
              color: 'var(--color-ink-obsidian)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            {isProcessing ? (
              <>
                <Sparkles className="animate-spin" size={16} /> Parsing & Classifying...
              </>
            ) : (
              <>
                <Wand2 size={16} /> Run AI Classification & Extract Clauses
              </>
            )}
          </button>
        </div>

        {/* Right: AI Structured Output */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '8px' }}>
            Structured AI Chapter Mapping:
          </label>

          <div style={{
            height: '240px',
            backgroundColor: 'var(--color-paper-bg)',
            borderRadius: 'var(--radius-sharp)',
            border: '1px solid var(--color-gold-border)',
            padding: '14px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-line',
            color: 'var(--color-ink-obsidian)',
            overflowY: 'auto'
          }}>
            {structuredOutput || (
              <span style={{ color: 'var(--color-ink-muted)', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                Click "Run AI Classification" to automatically map raw text into structured DRHP chapters.
              </span>
            )}
          </div>

          {structuredOutput && (
            <button
              onClick={() => alert('Successfully mapped and injected clauses into active filing sections!')}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-cleared-border)',
                backgroundColor: 'var(--color-cleared-bg)',
                color: 'var(--color-cleared-green)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={16} /> Inject Extracted Clauses into Draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
