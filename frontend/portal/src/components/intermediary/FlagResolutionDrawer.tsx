import React from 'react';
import { Flag } from '../../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, CornerDownRight, Check, XCircle } from 'lucide-react';

interface FlagResolutionDrawerProps {
  flags: Flag[];
  onResolveFlag: (flagId: string) => void;
}

export const FlagResolutionDrawer: React.FC<FlagResolutionDrawerProps> = ({
  flags,
  onResolveFlag
}) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-hairline)', paddingBottom: '12px' }}>
        <h4 style={{ fontSize: '16px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="var(--color-gold-primary)" /> Regulatory Flag Workbench ({flags.length})
        </h4>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)' }}>
          SEBI ICDR Stage 2 & 3
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {flags.map((flag) => {
          const isResolved = flag.status === 'RESOLVED';

          return (
            <div
              key={flag.id}
              style={{
                borderRadius: 'var(--radius-card)',
                border: isResolved
                  ? '1px solid var(--color-cleared-border)'
                  : flag.severity === 'CRITICAL' ? '1px solid var(--color-blocked-border)' : '1px solid var(--color-flag-border)',
                backgroundColor: isResolved
                  ? 'var(--color-cleared-bg)'
                  : flag.severity === 'CRITICAL' ? 'var(--color-blocked-bg)' : 'var(--color-flag-bg)',
                padding: '16px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: isResolved ? 'var(--color-cleared-green)' : flag.severity === 'CRITICAL' ? 'var(--color-blocked-red)' : 'var(--color-flag-amber)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {isResolved ? 'RESOLVED' : `${flag.severity} FLAG`}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {flag.id}
                  </span>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => onResolveFlag(flag.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sharp)',
                      border: 'none',
                      backgroundColor: 'var(--color-cleared-green)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={12} /> Resolve Flag
                  </button>
                )}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '6px' }}>
                {flag.title}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '10px', lineHeight: '1.4' }}>
                {flag.description}
              </div>

              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-gold-deep)',
                backgroundColor: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sharp)',
                border: '1px solid var(--color-border-hairline)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CornerDownRight size={12} /> Ref: {flag.clauseReference}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
