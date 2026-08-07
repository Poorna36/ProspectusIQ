import React, { useState } from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { BadgeVisualVariant } from '../../types/ui';
import { FileText, Eye, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export const EvidenceInterfacePreview: React.FC = () => {
  const [activeBadge, setActiveBadge] = useState<BadgeVisualVariant>('source');

  const badgeInfo: Record<BadgeVisualVariant, { title: string; desc: string; exampleText: string }> = {
    ai: {
      title: '✦ AI Generated Draft State',
      desc: 'Neutral graphite indicator denoting text drafted by the Generator LLM. Styled cleanly without artificial high-confidence coloring.',
      exampleText: 'The Company has developed proprietary deep-learning models for enterprise data processing...'
    },
    source: {
      title: '⛓ Source Matched Evidence',
      desc: 'Muted teal badge indicating the factual claim or financial number is explicitly tied to an uploaded document sheet & cell location.',
      exampleText: 'Our top 3 customers contributed 41.2% of our total restated revenue for FY25...'
    },
    passed: {
      title: '● Deterministic Rule Passed',
      desc: 'Institutional green indicator confirming the disclosure satisfies hardcoded SEBI ICDR regulations.',
      exampleText: 'Paid-up equity share capital post-issue is ₹18.50 Crore, complying with NSE Emerge threshold...'
    },
    approved: {
      title: '✓ Human Approved Sign-Off',
      desc: 'Deep forest badge indicating full review, edit, and sign-off by the Lead Merchant Banker or Legal Counsel.',
      exampleText: 'Litigation disclosures reviewed and cleared with zero liability as of June 30, 2026.'
    },
    review: {
      title: '▲ Review Required Warning',
      desc: 'Ochre warning requiring human intermediary inspection before submission.',
      exampleText: 'Customer concentration risk factor requires explicit loss percentage quantification...'
    },
    failed: {
      title: '✕ Rule Failed Blocker',
      desc: 'Brick red blocker indicating a critical statutory violation that locks certification until resolved.',
      exampleText: 'EBITDA calculation in Restated Summary excludes ₹18.5 Lakhs extraordinary ESOP provision...'
    },
    superseded: {
      title: '↺ Superseded Draft',
      desc: 'Stone grey badge for historical draft paragraphs replaced by newer human redlines.',
      exampleText: 'Legacy draft version 3 superseded by revised inter-party contract agreement annexure...'
    },
    certified: {
      title: '◈ Certified & Version Locked',
      desc: 'Antique gold accent indicating the section is certified, locked, and immutably hashed.',
      exampleText: 'Certified DRHP section sealed by Lead Merchant Banker Vikramaditya Rao.'
    }
  };

  const selectedInfo = badgeInfo[activeBadge];

  return (
    <section id="sample-audit" style={{
      backgroundColor: 'var(--color-warm-ivory)',
      borderBottom: '1px solid var(--color-border-stone)',
      padding: '64px 32px'
    }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-deep-forest)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Interactive Interface Demonstration
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
            Controlled Status & Evidence System
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-secondary-text)', marginTop: '6px' }}>
            Click on any badge below to explore how ProspectusIQ communicates trust and regulatory states.
          </p>
        </div>

        {/* Badge Selector Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          {(['ai', 'source', 'passed', 'approved', 'review', 'failed', 'superseded', 'certified'] as BadgeVisualVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setActiveBadge(v)}
              style={{
                background: activeBadge === v ? 'var(--color-surface-white)' : 'transparent',
                border: activeBadge === v ? '2px solid var(--color-deep-forest)' : '1px solid var(--color-border-stone)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                cursor: 'pointer',
                boxShadow: activeBadge === v ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <StatusBadge variant={v} />
            </button>
          ))}
        </div>

        {/* Display Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-white)',
          border: '1px solid var(--color-border-stone)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)' }}>
              {selectedInfo.title}
            </h3>
            <StatusBadge variant={activeBadge} />
          </div>

          <p style={{ fontSize: '14px', color: 'var(--color-secondary-text)', lineHeight: '1.5', marginBottom: '20px' }}>
            {selectedInfo.desc}
          </p>

          <div style={{
            backgroundColor: 'var(--color-warm-ivory)',
            border: '1px solid var(--color-border-stone)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--color-primary-text)',
            lineHeight: '1.7'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Sample DRHP Clause Context Preview:
            </div>
            "{selectedInfo.exampleText}"
          </div>
        </div>
      </div>
    </section>
  );
};
