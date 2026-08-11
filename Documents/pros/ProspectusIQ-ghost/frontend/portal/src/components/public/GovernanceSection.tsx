import React from 'react';
import { Shield, Lock, FileCheck, Users, Eye } from 'lucide-react';

export const GovernanceSection: React.FC = () => {
  const capabilities = [
    { title: 'Role-Based Access', desc: 'Granular permissions for Promoters, Legal Counsel, Auditors, and Lead Merchant Bankers.', icon: Users },
    { title: 'Immutable Auditability', desc: 'Append-only timestamped activity logs with cryptographic hash tracking for every edit.', icon: Lock },
    { title: 'Source Traceability', desc: 'Direct linkage from drafted claims back to audited financial sheets and corporate filings.', icon: Eye },
    { title: 'Intermediary Accountability', desc: 'Strict human sign-off gates ensuring AI cannot auto-submit or bypass regulatory review.', icon: FileCheck }
  ];

  return (
    <section id="security" style={{
      background: 'radial-gradient(ellipse at 30% 50%, rgba(26,64,53,0.3) 0%, transparent 60%), linear-gradient(180deg, #0E1014 0%, #141820 100%)',
      padding: '80px 48px',
      color: '#F5F2EA',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            Enterprise Governance
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
            Security, Integrity &amp; Auditability
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '6px' }}>
            Enterprise-grade governance for institutional SEBI filing compliance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                style={{
                  backgroundColor: 'rgba(20,24,32,0.85)',
                  border: '1.5px solid #2A2D35',
                  borderRadius: '20px',
                  padding: '28px 22px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <Icon size={24} color="#C9A84C" style={{ marginBottom: '16px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
                  {c.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
