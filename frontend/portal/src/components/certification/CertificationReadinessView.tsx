import React, { useState } from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Award } from 'lucide-react';

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
  const [isSealing, setIsSealing] = useState(false);
  const [sealDone, setSealDone] = useState(false);
  const isLocked = blockerCount > 0 && !isCertified;

  const handleCertify = () => {
    setIsSealing(true);
    setTimeout(() => {
      setSealDone(true);
      setTimeout(() => {
        setIsSealing(false);
        setSealDone(false);
        onExecuteCertification?.();
      }, 1600);
    }, 100);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

      {/* ── Bronze Seal Overlay ── */}
      {(isSealing || sealDone || isCertified) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9990, pointerEvents: isSealing ? 'all' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: isSealing ? 'rgba(0,0,0,0.55)' : 'transparent',
          transition: 'background-color 0.4s ease',
        }}>
          <style>{`
            @keyframes sealDrop {
              0%   { transform: scale(3.5) rotate(-15deg); opacity: 0; }
              60%  { transform: scale(0.92) rotate(3deg); opacity: 1; }
              80%  { transform: scale(1.04) rotate(-1deg); }
              100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes sealPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(169,118,47,0.6); }
              50% { box-shadow: 0 0 0 24px rgba(169,118,47,0); }
            }
          `}</style>
          <div style={{
            animation: 'sealDrop 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards, sealPulse 1.4s ease 0.9s',
            width: '180px', height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #D4A44C 0%, #A9762F 40%, #7A5420 80%, #5C3D15 100%)',
            border: '5px solid #C49A3C',
            boxShadow: '0 12px 40px rgba(169,118,47,0.5), inset 0 2px 8px rgba(255,220,100,0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#FFF8E7',
            textAlign: 'center',
            padding: '16px',
            cursor: 'default',
          }}>
            <ShieldCheck size={40} color="#FFF8E7" style={{ marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
            <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.3, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              CERTIFIED<br />&amp; LOCKED
            </div>
            <div style={{ fontSize: '9px', marginTop: '6px', opacity: 0.8, letterSpacing: '0.8px' }}>SEBI ICDR 2018</div>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-stone)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SEBI Regulatory Certification Readiness
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', marginTop: '4px' }}>
            Filing Sign-Off &amp; Lock Protocol
          </h2>
        </div>
        <StatusBadge variant={isCertified ? 'certified' : isLocked ? 'failed' : 'approved'} />
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Readiness Score', value: `${readinessPercent}%`, color: 'var(--color-primary-text)' },
          { label: 'Critical Blockers', value: blockerCount, color: blockerCount > 0 ? 'var(--color-brick-red)' : 'var(--status-passed-color)' },
          { label: 'Warnings', value: warningCount, color: 'var(--status-review-color)' },
          { label: 'Draft Version', value: version, color: 'var(--color-primary-text)' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--color-surface-white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-stone)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>{stat.label}</div>
            <div style={{ fontSize: i === 3 ? '18px' : '24px', fontWeight: 700, color: stat.color as string, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-stone)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ fontSize: '16px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
          Intermediary Sign-off Audit Checklist
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          {[
            { label: 'Deterministic Rule Checks Evaluated', ok: true, badge: 'passed' as const },
            { label: 'Financial Statement Evidence Linked & Matched', ok: true, badge: 'source' as const },
            { label: 'Legal Counsel Review Recorded (Priya Shah)', ok: true, badge: 'approved' as const },
            { label: 'Merchant Banker Final Approval & Blocker Clearance', ok: !isLocked, badge: isLocked ? 'failed' as const : 'approved' as const, customLabel: isLocked ? `${blockerCount} Blocker Pending` : 'Approved' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {row.ok ? <CheckCircle2 size={16} color="var(--status-passed-color)" /> : <AlertTriangle size={16} color="var(--color-brick-red)" />}
                {row.label}
              </span>
              <StatusBadge variant={row.badge} size="sm" customLabel={row.customLabel} />
            </div>
          ))}
        </div>
      </div>

      {/* Digital e-Sign Modal Card */}
      <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E3A5F', borderRadius: 'var(--radius-md)', padding: '20px', fontSize: '12px', color: '#94A3B8' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          🔒 INTERMEDIARY DIGITAL CERTIFICATION & e-SIGN DECLARATION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div><span style={{ color: '#64748B' }}>Signatory:</span> <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Vikramaditya Sharma</span></div>
          <div><span style={{ color: '#64748B' }}>Role:</span> <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Lead Merchant Banker</span></div>
          <div><span style={{ color: '#64748B' }}>SEBI Reg No:</span> <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}>INM000012345 ✅</span></div>
          <div><span style={{ color: '#64748B' }}>Method:</span> <span style={{ color: '#E2E8F0' }}>Class 3 DSC / Aadhaar eSign Token</span></div>
        </div>
        <div style={{ fontStyle: 'italic', color: '#64748B', lineHeight: '1.6', borderLeft: '3px solid #1E3A5F', paddingLeft: '12px' }}>
          "I hereby certify this DRHP has been audited against SEBI ICDR Regulations 2018. All material disclosures have been quantified and verified."
        </div>
      </div>

      {/* Document Hash */}
      <div style={{ backgroundColor: 'var(--color-primary-charcoal)', color: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '18px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
          DOCUMENT INTEGRITY CHECKSUM &amp; TIMESTAMP HASH:
        </div>
        <div>0x{documentHash}</div>
        <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '6px' }}>
          Generated: August 11, 2026, 17:42 IST • Immutable Ledger Verification
        </div>
      </div>

      {/* Action Button */}
      <div style={{ paddingTop: '8px' }}>
        {isCertified ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'rgba(169,118,47,0.08)', border: '1px solid #A9762F', borderRadius: 'var(--radius-md)', color: '#A9762F', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShieldCheck size={22} /> ✨ CERTIFIED &amp; LOCKED — SEBI DRHP v12 Sealed on Aug 11, 2026
          </div>
        ) : isLocked ? (
          <button disabled style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-stone)', backgroundColor: '#E5E7EB', color: '#6B7280', fontSize: '15px', fontWeight: 700, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Lock size={18} /> Certification Locked — Resolve {blockerCount} Blocker Before Sign-off
          </button>
        ) : (
          <button
            onClick={handleCertify}
            style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-antique-gold)', backgroundColor: 'var(--color-antique-gold)', color: 'var(--color-primary-charcoal)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: 'var(--shadow-md)' }}
          >
            <Award size={20} /> Apply e-Sign &amp; Lock — Record Final Intermediary Certification
          </button>
        )}
      </div>
    </div>
  );
};
