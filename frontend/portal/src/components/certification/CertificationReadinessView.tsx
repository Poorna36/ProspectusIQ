import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, FileCode, Award, UserCheck, Download } from 'lucide-react';

interface CertificationReadinessViewProps {
  readinessPercent?: number;
  blockerCount?: number;
  warningCount?: number;
  documentHash?: string;
  version?: string;
  isCertified?: boolean;
  onExecuteCertification?: () => void;
}

export const CertificationReadinessView: React.FC<CertificationReadinessViewProps> = ({
  readinessPercent = 93,
  blockerCount = 1,
  warningCount = 2,
  documentHash = '8b3c912a4e98210984712409852f312',
  version = 'DRHP v12',
  isCertified = false,
  onExecuteCertification
}) => {
  const isLocked = blockerCount > 0 && !isCertified;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SEBI Regulatory Certification Readiness
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '4px' }}>
            Filing Sign-Off & Lock Protocol
          </h2>
        </div>

        <StatusBadge variant={isCertified ? 'certified' : isLocked ? 'failed' : 'approved'} />
      </div>

      {/* Progress & Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--color-surface-white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-stone)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>Readiness Score</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)' }}>
            {readinessPercent}%
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-stone)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>Critical Blockers</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: blockerCount > 0 ? 'var(--color-brick-red)' : 'var(--status-passed-color)', fontFamily: 'var(--font-mono)' }}>
            {blockerCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-stone)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>Warnings</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-review-color)', fontFamily: 'var(--font-mono)' }}>
            {warningCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-stone)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>Draft Version</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {version}
          </div>
        </div>
      </div>

      {/* Review Sign-off Checklist */}
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '16px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
          Intermediary Sign-off Audit Checklist
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--status-passed-color)" /> Deterministic Rule Checks Evaluated</span>
            <StatusBadge variant="passed" size="sm" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--status-passed-color)" /> Financial Statement Evidence Linked & Matched</span>
            <StatusBadge variant="source" size="sm" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--status-passed-color)" /> Legal Counsel Review Recorded (Priya Shah)</span>
            <StatusBadge variant="approved" size="sm" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isLocked ? <AlertTriangle size={16} color="var(--color-brick-red)" /> : <CheckCircle2 size={16} color="var(--status-passed-color)" />}
              Merchant Banker Final Approval & Blocker Clearance
            </span>
            <StatusBadge variant={isLocked ? 'failed' : 'approved'} size="sm" customLabel={isLocked ? '1 Blocker Pending' : 'Approved'} />
          </div>
        </div>
      </div>

      {/* Document Hash Box */}
      <div style={{
        backgroundColor: 'var(--color-primary-charcoal)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
          DOCUMENT INTEGRITY CHECKSUM & TIMESTAMP HASH:
        </div>
        <div>0x{documentHash}</div>
        <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '6px' }}>
          Generated: August 6, 2026, 17:42 IST • Immutable Ledger Verification
        </div>
      </div>

      {/* Action Button */}
      <div style={{ paddingTop: '8px' }}>
        {isLocked ? (
          <button
            disabled
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-stone)',
              backgroundColor: '#E5E7EB',
              color: '#6B7280',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Lock size={18} /> Certification Locked — Resolve {blockerCount} Blocker Before Sign-off
          </button>
        ) : (
          <button
            onClick={onExecuteCertification}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-antique-gold)',
              backgroundColor: 'var(--color-antique-gold)', // Gold used ONLY for approved certification
              color: 'var(--color-primary-charcoal)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Award size={20} /> Record Final Intermediary Certification & Lock Version
          </button>
        )}
      </div>
    </div>
  );
};
