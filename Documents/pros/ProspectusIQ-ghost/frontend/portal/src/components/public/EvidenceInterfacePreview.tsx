import React, { useState } from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { BadgeVisualVariant } from '../../types/ui';

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
      background: 'radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.1) 0%, transparent 60%), linear-gradient(180deg, #141820 0%, #0E1014 100%)',
      borderBottom: '1px solid #1E2028',
      padding: '80px 48px',
      color: '#F5F2EA',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            Interactive Interface Demonstration
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
            Controlled Status &amp; Evidence System
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px' }}>
            Click on any badge below to explore how ProspectusIQ communicates trust and regulatory states.
          </p>
        </div>

        {/* Badge Selector Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '36px'
        }}>
          {(['ai', 'source', 'passed', 'approved', 'review', 'failed', 'superseded', 'certified'] as BadgeVisualVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setActiveBadge(v)}
              style={{
                background: activeBadge === v ? 'rgba(201,168,76,0.15)' : 'rgba(20,24,32,0.6)',
                border: activeBadge === v ? '2px solid #C9A84C' : '1px solid #2A2D35',
                borderRadius: '10px',
                padding: '8px 16px',
                cursor: 'pointer',
                boxShadow: activeBadge === v ? '0 0 16px rgba(201,168,76,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <StatusBadge variant={v} />
            </button>
          ))}
        </div>

        {/* Display Card */}
        <div style={{
          backgroundColor: 'rgba(20,24,32,0.9)',
          border: '1.5px solid #2A2D35',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)' }}>
              {selectedInfo.title}
            </h3>
            <StatusBadge variant={activeBadge} />
          </div>

          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', marginBottom: '24px' }}>
            {selectedInfo.desc}
          </p>

          <div style={{
            backgroundColor: '#141820',
            border: '1px solid #2A2D35',
            borderRadius: '12px',
            padding: '24px',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            color: '#F5F2EA',
            lineHeight: '1.7'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', marginBottom: '10px' }}>
              Sample DRHP Clause Context Preview:
            </div>
            "{selectedInfo.exampleText}"
          </div>
        </div>
      </div>
    </section>
  );
};
