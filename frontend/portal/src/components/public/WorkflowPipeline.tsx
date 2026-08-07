import React from 'react';
import { Database, Cpu, Sparkles, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export const WorkflowPipeline: React.FC = () => {
  const steps = [
    { num: '01', title: 'Company Data', icon: Database, desc: 'Structured OCR & financial intake (AOC-4, GSTIN, MCA21)' },
    { num: '02', title: 'Rules Engine', icon: Cpu, desc: 'Deterministic validation (ICDR & NSE Emerge criteria)' },
    { num: '03', title: 'AI-Assisted Drafting', icon: Sparkles, desc: 'Dual-model clause generation (Generator + Verifier)' },
    { num: '04', title: 'Verification', icon: ShieldCheck, desc: 'Evidence entailment check & mandatory disclosure audit' },
    { num: '05', title: 'Human Certification', icon: UserCheck, desc: 'Merchant Banker & Counsel redline sign-off & seal' }
  ];

  return (
    <section id="architecture" style={{
      backgroundColor: 'var(--color-surface-white)',
      borderBottom: '1px solid var(--color-border-stone)',
      padding: '72px 32px'
    }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-deep-forest)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            5-Stage Assurance Workflow
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
            Controlled Disclosure Lifecycle
          </h2>
        </div>

        {/* Connected Horizontal Timeline Pipeline (Zero Boxy Cards) */}
        <div style={{ position: 'relative', padding: '0 10px' }}>
          {/* Horizontal Connecting Rail */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '40px',
            right: '40px',
            height: '2px',
            backgroundColor: 'var(--color-border-stone)',
            zIndex: 1
          }} />

          {/* Timeline Process Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', position: 'relative', zIndex: 2 }}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* Circle Stage Node */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-white)',
                    border: '2px solid var(--color-deep-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 0 0 4px var(--color-surface-white)',
                    position: 'relative'
                  }}>
                    <Icon size={20} color="var(--color-deep-forest)" />
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: 'var(--color-primary-charcoal)',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {step.num}
                    </span>
                  </div>

                  {/* Stage Details */}
                  <div style={{ borderTop: '1px solid var(--color-border-stone)', paddingTop: '12px', width: '100%' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '6px' }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-secondary-text)', lineHeight: '1.5' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
