import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProvenanceNetworkCanvas } from './ProvenanceNetworkCanvas';

interface HeroSectionProps {
  onOpenWorkbench: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWorkbench }) => {
  return (
    <section style={{
      backgroundColor: '#181A1F',
      borderBottom: '1px solid #292C33',
      color: '#F5F2EA',
      padding: '56px 48px 48px 48px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Asymmetrical Editorial Header & Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '58% 42%',
          gap: '32px',
          alignItems: 'flex-end',
          marginBottom: '36px'
        }}>
          {/* Left Column: Headlines & Copy */}
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--color-muted-burgundy)' }} />
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#AAA69D',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'var(--font-sans)'
              }}>
                REGULATORY DISCLOSURE WORKBENCH
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: '60px',
              fontWeight: 800,
              color: '#F5F2EA',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.02',
              letterSpacing: '-1.6px',
              marginBottom: '16px'
            }}>
              From source evidence<br />
              to filing-ready disclosure.
            </h1>

            {/* Supporting Copy */}
            <p style={{
              fontSize: '16px',
              color: '#AAA69D',
              lineHeight: '1.5',
              maxWidth: '580px'
            }}>
              Trace every material claim through its source, deterministic checks and intermediary approvals.
            </p>
          </div>

          {/* Right Column: Actions (Left-aligned as requested) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={onOpenWorkbench}
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #34845F',
                  backgroundColor: 'var(--color-deep-forest)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                Open Intermediary Workbench <ArrowRight size={16} />
              </button>

              <a
                href="#architecture"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F5F2EA',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderBottom: '1px solid #AAA69D',
                  paddingBottom: '2px'
                }}
              >
                Explore controlled workflow <ArrowUpRight size={14} />
              </a>
            </div>

            <div style={{ fontSize: '11px', color: '#88847C', fontFamily: 'var(--font-mono)' }}>
              Deterministic Validation · Source Provenance · Human Certification
            </div>
          </div>
        </div>

        {/* Interactive WebGL Disclosure Provenance Network Visualization */}
        <div style={{
          backgroundColor: '#1E2127',
          border: '1px solid #292C33',
          borderRadius: 'var(--radius-md)',
          padding: '24px 16px 16px 16px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px 12px 16px',
            borderBottom: '1px solid #292C33',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#88847C'
          }}>
            <span style={{ fontWeight: 700, color: '#F5F2EA' }}>
              INTERACTIVE DISCLOSURE PROVENANCE GRAPH
            </span>
            <span>LIVE TRACE: AUDITED AOC-4 SHEET 2 → DRHP CLAUSE 3.4.1 → RULE SME-DISC-014</span>
          </div>

          <ProvenanceNetworkCanvas />
        </div>
      </div>
    </section>
  );
};
