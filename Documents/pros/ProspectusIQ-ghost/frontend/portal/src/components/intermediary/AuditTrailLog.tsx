import React from 'react';
import { AuditLogItem } from '../../types';
import { History, Shield, Lock, Cpu, User, FileCode } from 'lucide-react';

interface AuditTrailLogProps {
  logs: AuditLogItem[];
}

export const AuditTrailLog: React.FC<AuditTrailLogProps> = ({ logs }) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="var(--color-gold-primary)" /> Immutable Regulatory Audit Trail & Proof Chain
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Cryptographically signed record of all AI generations, rule checks, human redlines, and certifications.
          </p>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#1E293B', color: '#FFFFFF', padding: '6px 12px', borderRadius: 'var(--radius-sharp)', fontFamily: 'var(--font-mono)' }}>
          SEBI LEDGER v4.2
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              backgroundColor: 'var(--color-paper-bg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: log.role.startsWith('AI') ? 'var(--color-gold-subtle)' : '#1E293B',
              border: log.role.startsWith('AI') ? '1px solid var(--color-gold-border)' : 'none',
              color: log.role.startsWith('AI') ? 'var(--color-gold-deep)' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {log.role.startsWith('AI') ? <Cpu size={18} /> : <User size={18} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-obsidian)' }}>
                  {log.actor} <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontWeight: 400 }}>({log.role})</span>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                  {log.timestamp}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--color-ink-obsidian)', marginBottom: '8px' }}>
                <strong>{log.action}:</strong> {log.details}
              </div>

              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-gold-deep)',
                backgroundColor: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-border-hairline)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Lock size={12} /> HASH: {log.hash}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
