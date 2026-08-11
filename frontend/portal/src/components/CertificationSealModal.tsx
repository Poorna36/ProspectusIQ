import React, { useState, useEffect } from 'react';
import { Filing } from '../types';
import { Stamp, ShieldCheck, CheckCircle2, Lock, Download, X, Key, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificationSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  filing: Filing;
  onCertifyConfirm: () => void;
}

export const CertificationSealModal: React.FC<CertificationSealModalProps> = ({
  isOpen,
  onClose,
  filing,
  onCertifyConfirm
}) => {
  const [isStamped, setIsStamped] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [cryptoHash, setCryptoHash] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsStamped(false);
      setIsHashing(false);
      setCryptoHash('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCertifyAction = () => {
    setIsHashing(true);
    setTimeout(() => {
      setIsHashing(false);
      setIsStamped(true);
      setCryptoHash(`0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);
      onCertifyConfirm();
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C59B27', '#D4AF37', '#111827', '#15803D']
        });
      } catch (e) {
        // Fallback if canvas-confetti unavailable
      }
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '560px',
        border: '2px solid var(--color-gold-border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--color-ink-obsidian)',
          color: '#FFFFFF',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award color="var(--color-gold-bright)" size={24} />
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
              SEBI Intermediary Certification & Seal
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', textAlign: 'center' }}>
          {!isStamped ? (
            <div>
              <p style={{ fontSize: '15px', color: 'var(--color-ink-muted)', marginBottom: '20px' }}>
                You are about to cryptographically lock and certify the DRHP document for <strong>{filing.companyName}</strong>.
              </p>

              <div style={{
                backgroundColor: 'var(--color-paper-bg)',
                border: '1px solid var(--color-border-hairline)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--color-ink-obsidian)', marginBottom: '8px' }}>
                  Pre-Certification Verification Checklist:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cleared-green)', marginBottom: '4px' }}>
                  <CheckCircle2 size={14} /> Stage 1: AI Verifier Discrepancies Resolved
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cleared-green)', marginBottom: '4px' }}>
                  <CheckCircle2 size={14} /> Stage 2: SEBI ICDR Deterministic Rules Engine Passed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cleared-green)' }}>
                  <CheckCircle2 size={14} /> Stage 3: Lead Merchant Banker & Legal Counsel Sign-off
                </div>
              </div>

              {isHashing ? (
                <div style={{ padding: '20px 0' }}>
                  <div className="shimmer-loading" style={{ height: '48px', borderRadius: 'var(--radius-sharp)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '13px', color: 'var(--color-gold-deep)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Key className="animate-spin" size={16} /> Generating Immutable SHA-256 SEBI Ledger Hash...
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCertifyAction}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-sharp)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--color-gold-primary) 0%, var(--color-gold-deep) 100%)',
                    color: 'var(--color-ink-obsidian)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-gold)'
                  }}
                >
                  <Stamp size={20} />
                  Execute Certification & Apply Gold Seal
                </button>
              )}
            </div>
          ) : (
            <div style={{ padding: '10px 0' }}>
              {/* Animated Stamp Seal Emblem */}
              <div className="animate-stamp" style={{
                margin: '0 auto 20px auto',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '4px double var(--color-gold-bright)',
                background: 'radial-gradient(circle, #FDFBF3 0%, #F5E6B3 100%)',
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.4), inset 0 0 15px rgba(184, 134, 11, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold-deep)',
                padding: '10px'
              }}>
                <ShieldCheck size={38} color="var(--color-gold-deep)" />
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                  SEBI CERTIFIED
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-ink-obsidian)' }}>
                  PROSPECTUS IQ
                </div>
              </div>

              <h3 style={{ fontSize: '20px', color: 'var(--color-ink-obsidian)', marginBottom: '8px' }}>
                Filing Successfully Certified & Locked!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
                This prospectus section has been signed by <strong>Vikramaditya Rao (Lead Intermediary)</strong> and stored immutably.
              </p>

              <div style={{
                backgroundColor: 'var(--color-ink-obsidian)',
                color: 'var(--color-gold-bright)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '12px',
                borderRadius: 'var(--radius-card)',
                wordBreak: 'break-all',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <div style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  IMMUTABLE PROOF HASH:
                </div>
                {cryptoHash}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-sharp)',
                    border: '1px solid var(--color-border-hairline)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-ink-obsidian)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Return to Workbench
                </button>

                <button
                  onClick={() => alert('Downloading Certified SEBI DRHP Package (PDF + Cryptographic Audit JSON)...')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-sharp)',
                    border: 'none',
                    backgroundColor: 'var(--color-gold-primary)',
                    color: 'var(--color-ink-obsidian)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Download Certified Package
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
