import React from 'react';
import { Database, Cpu, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

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
      background: 'radial-gradient(ellipse at 30% 50%, rgba(26,64,53,0.3) 0%, transparent 60%), linear-gradient(180deg, #0E1014 0%, #141820 100%)',
      borderBottom: '1px solid #1E2028',
      padding: '80px 48px',
      color: '#F5F2EA',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            5-Stage Assurance Workflow
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
            Controlled Disclosure Lifecycle
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px' }}>
            From company raw financial intake to legal counsel sign-off &amp; DRHP certification.
          </p>
        </div>

        {/* Connected Horizontal Timeline Pipeline */}
        <div style={{ position: 'relative', padding: '0 10px' }}>
          {/* Horizontal Connecting Line */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '50px',
            right: '50px',
            height: '2px',
            background: 'linear-gradient(90deg, #1A4035 0%, #C9A84C 50%, #1A4035 100%)',
            zIndex: 1
          }} />

          {/* Timeline Process Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', position: 'relative', zIndex: 2 }}>
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  backgroundColor: 'rgba(20,24,32,0.85)',
                  border: '1px solid #2A2D35',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}>
                  {/* Circle Stage Node */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#141820',
                    border: '2px solid #C9A84C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 0 16px rgba(201,168,76,0.3)',
                    position: 'relative'
                  }}>
                    <Icon size={20} color="#C9A84C" />
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#C9A84C',
                      color: '#0E1014',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {step.num}
                    </span>
                  </div>

                  {/* Stage Details */}
                  <div style={{ borderTop: '1px solid #2A2D35', paddingTop: '14px', width: '100%' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', marginBottom: '6px' }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>
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
