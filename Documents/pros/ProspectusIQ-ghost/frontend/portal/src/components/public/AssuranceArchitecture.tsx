import React from 'react';
import { Cpu, ShieldAlert, Layers } from 'lucide-react';

export const AssuranceArchitecture: React.FC = () => {
  return (
    <section style={{
      background: 'radial-gradient(ellipse at 30% 50%, rgba(26,64,53,0.35) 0%, transparent 60%), linear-gradient(180deg, #0E1014 0%, #141820 100%)',
      borderBottom: '1px solid #1E2028',
      padding: '80px 48px',
      color: '#F5F2EA',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            System Integrity Architecture
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
            Three-Layer Assurance Architecture
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px' }}>
            Enforcing deterministic rules, dual-model verification, and legal workbench review.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          {/* Layer 1 */}
          <div style={{
            backgroundColor: 'rgba(20,24,32,0.85)',
            border: '1.5px solid #2A2D35',
            borderRadius: '20px',
            padding: '28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', fontFamily: 'var(--font-mono)' }}>
                LAYER 01
              </span>
              <Cpu size={22} color="#C9A84C" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>
              Deterministic Rules Engine
            </h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.65', margin: 0 }}>
              Zero-latency hardcoded validation enforcing SEBI ICDR guidelines, NSE Emerge paid-up capital limits, and statutory financial ratio checks before any text is drafted.
            </p>
          </div>

          {/* Layer 2 */}
          <div style={{
            backgroundColor: 'rgba(20,24,32,0.85)',
            border: '1.5px solid #2A2D35',
            borderRadius: '20px',
            padding: '28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)' }}>
                LAYER 02
              </span>
              <ShieldAlert size={22} color="#F97316" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>
              Dual-Model AI Engine
            </h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.65', margin: 0 }}>
              Generator model drafts structured prospectus clauses, while a separate Verifier model cross-checks text against historical SEBI Observation Letters to catch omissions.
            </p>
          </div>

          {/* Layer 3 */}
          <div style={{
            backgroundColor: 'rgba(20,24,32,0.85)',
            border: '1.5px solid #2A2D35',
            borderRadius: '20px',
            padding: '28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                LAYER 03
              </span>
              <Layers size={22} color="#34D399" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>
              Intermediary Review Workbench
            </h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.65', margin: 0 }}>
              High-density legal environment for Merchant Bankers and Legal Counsel to redline text, resolve compliance flags, inspect evidence provenance, and execute digital sign-offs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
