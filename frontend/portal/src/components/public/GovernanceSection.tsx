import React from 'react';
import { Shield, Lock, FileCheck, Users, Eye, FileText } from 'lucide-react';

export const GovernanceSection: React.FC = () => {
  const capabilities = [
    { title: 'Role-Based Access', desc: 'Granular permissions for Promoters, Legal Counsel, Auditors, and Lead Merchant Bankers.', icon: Users },
    { title: 'Immutable Auditability', desc: 'Append-only timestamped activity logs with cryptographic hash tracking for every edit.', icon: Lock },
    { title: 'Source Traceability', desc: 'Direct linkage from drafted claims back to audited financial sheets and corporate filings.', icon: Eye },
    { title: 'Intermediary Accountability', desc: 'Strict human sign-off gates ensuring AI cannot auto-submit or bypass regulatory review.', icon: FileCheck }
  ];

  return (
    <section id="security" style={{
      backgroundColor: 'var(--color-surface-white)',
      padding: '72px 32px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-deep-forest)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Enterprise Governance
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>
            Security, Integrity & Auditability
          </h2>
        </div>

        {/* Editorial 4-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                style={{
                  borderTop: '1px solid var(--color-border-stone)',
                  paddingTop: '18px'
                }}
              >
                <Icon size={20} color="var(--color-deep-forest)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '15px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '6px' }}>
                  {c.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-secondary-text)', lineHeight: '1.5' }}>
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
