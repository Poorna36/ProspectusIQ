import React from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { ProvenanceNetworkCanvas } from './ProvenanceNetworkCanvas';

interface HeroSectionProps {
  onOpenWorkbench: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWorkbench }) => {
  return (
    <div style={{ backgroundColor: '#0E1014', color: '#F5F2EA' }}>
      
      {/* ── 100vh FULL SCREEN HERO BANNER ── */}
      <section style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(26,64,53,0.4) 0%, transparent 65%), radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.15) 0%, transparent 55%), linear-gradient(180deg, #0E1014 0%, #141820 100%)',
        borderBottom: '1px solid #1E2028',
        color: '#F5F2EA',
        padding: '0 48px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Background decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(42,45,53,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,53,0.35) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          
          {/* Eyebrow badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
            <span style={{
              fontSize: '11px', fontWeight: 800, color: '#C9A84C',
              textTransform: 'uppercase', letterSpacing: '3px',
              fontFamily: 'var(--font-mono)'
            }}>
              SEBI SME IPO · DRHP Automation · Institutional Compliance AI
            </span>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(48px, 6.5vw, 84px)',
            fontWeight: 900,
            color: '#F5F2EA',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.04',
            letterSpacing: '-2.5px',
            marginBottom: '24px',
          }}>
            From source evidence
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #F5D77F 50%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              to filing-ready disclosure.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7',
            maxWidth: '660px', margin: '0 auto 44px auto'
          }}>
            Trace every material claim through its source, deterministic checks, and intermediary approvals.
            Built for SEBI ICDR 2018 SME prospectus compliance.
          </p>

          {/* 3 Main Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '44px' }}>
            {/* 1. SME PROMOTER */}
            <button
              onClick={onOpenWorkbench}
              style={{
                padding: '18px 40px', borderRadius: '14px',
                border: '1px solid #2D6E50',
                background: 'linear-gradient(135deg, #1A4035 0%, #23543D 100%)',
                color: '#F5F2EA', fontSize: '15px', fontWeight: 800,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 0 28px rgba(35,84,61,0.6), 0 8px 24px rgba(0,0,0,0.5)',
                transition: 'all 0.25s ease', letterSpacing: '0.2px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 44px rgba(35,84,61,0.8), 0 8px 32px rgba(0,0,0,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 0 28px rgba(35,84,61,0.6), 0 8px 24px rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              SME PROMOTER <ArrowRight size={18} />
            </button>

            {/* 2. Workbench */}
            <button
              onClick={onOpenWorkbench}
              style={{
                padding: '18px 40px', borderRadius: '14px',
                border: '1.5px solid rgba(201,168,76,0.5)',
                background: 'rgba(201,168,76,0.1)',
                color: '#F5D77F', fontSize: '15px', fontWeight: 800,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 0 20px rgba(201,168,76,0.2)',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(201,168,76,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Workbench <ArrowRight size={18} />
            </button>

            {/* 3. Explore controlled work */}
            <a
              href="#disclosure-graph"
              style={{
                fontSize: '13px', fontWeight: 700, color: '#9CA3AF',
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '14px 22px', borderRadius: '12px',
                border: '1px solid #2A2D35',
                transition: 'all 0.2s',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#2A2D35'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            >
              Explore controlled work <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {['Deterministic Validation', 'Source Provenance', 'Human Certification', 'SEBI ICDR Aligned'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.6)' }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.8 }}>
            <span style={{ fontSize: '10px', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
              Scroll down for Interactive Graph
            </span>
            <ChevronDown size={18} color="#C9A84C" style={{ animation: 'bounce 2s infinite' }} />
          </div>

        </div>
      </section>

      {/* ── SCROLL SECTION: INTERACTIVE DISCLOSURE PROVENANCE GRAPH ── */}
      <section id="disclosure-graph" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(26,64,53,0.3) 0%, transparent 60%), linear-gradient(180deg, #141820 0%, #0E1014 100%)',
        borderBottom: '1px solid #1E2028',
        padding: '80px 48px',
      }}>
        <div style={{ maxWidth: '1340px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
              Live Traceability Engine
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
              Interactive Disclosure Provenance Graph
            </h2>
            <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px', maxWidth: '640px', margin: '8px auto 0' }}>
              Inspect how every financial clause maps directly from statutory AOC-4 filings through SEBI rules into final DRHP prose.
            </p>
          </div>

          {/* Provenance Graph Card */}
          <div style={{
            background: 'rgba(20,24,32,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid #2A2D35',
            borderRadius: '20px',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)',
            overflow: 'hidden',
          }}>
            {/* Header bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid #1E2028',
              background: 'rgba(26,64,53,0.2)',
            }}>
              <div style={{ display: 'flex', gap: '7px' }}>
                {['#FF5F57','#FFBD2E','#28C840'].map(c => (
                  <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c, opacity: 0.85 }} />
                ))}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
                INTERACTIVE DISCLOSURE PROVENANCE GRAPH
              </span>
              <span style={{ fontSize: '10px', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>
                LIVE AUDITED DATA → DRHP 3.4.1
              </span>
            </div>

            <ProvenanceNetworkCanvas />
          </div>

        </div>
      </section>

    </div>
  );
};
