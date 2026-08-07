import React from 'react';
import { Cpu, ShieldAlert, Layers } from 'lucide-react';

export const AssuranceArchitecture: React.FC = () => {
  return (
    <section style={{
      backgroundColor: 'var(--color-surface-white)',
      borderBottom: '1px solid var(--color-border-stone)',
      padding: '72px 32px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-deep-forest)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            System Integrity Architecture
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
            Three-Layer Assurance Architecture
          </h2>
        </div>

        {/* Editorial Column Layout (Clean hairlines, zero heavy boxy fills) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {/* Layer 1 */}
          <div style={{ borderTop: '2px solid var(--color-primary-charcoal)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>
                LAYER 01
              </span>
              <Cpu size={18} color="var(--color-primary-charcoal)" />
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
              Deterministic Rules Engine
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)', lineHeight: '1.6' }}>
              Zero-latency hardcoded validation enforcing SEBI ICDR guidelines, NSE Emerge paid-up capital limits, and statutory financial ratio checks before any text is drafted.
            </p>
          </div>

          {/* Layer 2 */}
          <div style={{ borderTop: '2px solid var(--color-deep-forest)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>
                LAYER 02
              </span>
              <ShieldAlert size={18} color="var(--color-deep-forest)" />
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
              Dual-Model AI Engine
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)', lineHeight: '1.6' }}>
              Generator model drafts structured prospectus clauses, while a separate Verifier model cross-checks text against historical SEBI Observation Letters to catch omissions.
            </p>
          </div>

          {/* Layer 3 */}
          <div style={{ borderTop: '2px solid var(--color-muted-burgundy)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>
                LAYER 03
              </span>
              <Layers size={18} color="var(--color-muted-burgundy)" />
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
              Intermediary Review Workbench
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)', lineHeight: '1.6' }}>
              High-density legal environment for Merchant Bankers and Legal Counsel to redline text, resolve compliance flags, inspect evidence provenance, and execute digital sign-offs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
