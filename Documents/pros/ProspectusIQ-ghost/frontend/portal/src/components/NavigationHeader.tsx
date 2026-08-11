import React from 'react';
import { UserRole, Filing } from '../types';
import { ShieldCheck, Stamp, Building2, UserCheck, Layers, FileCheck } from 'lucide-react';

interface NavigationHeaderProps {
  currentRole: UserRole;
  onToggleRole: (role: UserRole) => void;
  filing: Filing;
  onOpenCertifyModal: () => void;
  allCleared: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentRole,
  onToggleRole,
  filing,
  onOpenCertifyModal,
  allCleared
}) => {
  return (
    <header style={{
      backgroundColor: 'var(--color-ink-obsidian)',
      borderBottom: '1px solid #1E293B',
      color: '#FFFFFF',
      padding: '0 24px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Filing Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sharp)',
            background: 'linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold-deep) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-ink-obsidian)',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-serif)', letterSpacing: '0.5px', color: '#FFFFFF' }}>
              Prospectus<span style={{ color: 'var(--color-gold-bright)' }}>IQ</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-gold-border)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              SEBI SME IPO Platform
            </div>
          </div>
        </div>

        <div style={{ height: '28px', width: '1px', backgroundColor: '#334155' }} />

        {/* Filing Context info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building2 size={16} color="var(--color-gold-bright)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9' }}>
              {filing.companyName}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              CIN: {filing.cin} • Issue Size: {filing.targetIssueSize}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Completion Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#1E293B', padding: '6px 16px', borderRadius: '20px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileCheck size={14} color="var(--color-gold-bright)" />
          Filing Completion:
        </div>
        <div style={{ width: '100px', height: '8px', backgroundColor: '#0F172A', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${filing.completionPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-gold-primary), var(--color-gold-bright))',
            borderRadius: '4px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-gold-bright)', fontFamily: 'var(--font-mono)' }}>
          {filing.completionPercent}%
        </div>
      </div>

      {/* Right Controls: Role Switcher & Certify Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Role Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0F172A',
          padding: '3px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid #334155'
        }}>
          <button
            onClick={() => onToggleRole('PROMOTER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: currentRole === 'PROMOTER' ? 'var(--color-gold-primary)' : 'transparent',
              color: currentRole === 'PROMOTER' ? 'var(--color-ink-obsidian)' : '#94A3B8'
            }}
          >
            <UserCheck size={14} />
            Interface A: Promoter Portal
          </button>
          
          <button
            onClick={() => onToggleRole('INTERMEDIARY')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: currentRole === 'INTERMEDIARY' ? 'var(--color-gold-primary)' : 'transparent',
              color: currentRole === 'INTERMEDIARY' ? 'var(--color-ink-obsidian)' : '#94A3B8'
            }}
          >
            <Layers size={14} />
            Interface B: Workbench
          </button>
        </div>

        {/* Certification Action Button */}
        {currentRole === 'INTERMEDIARY' && (
          <button
            onClick={onOpenCertifyModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-gold-bright)',
              background: 'linear-gradient(135deg, var(--color-gold-primary) 0%, var(--color-gold-deep) 100%)',
              color: 'var(--color-ink-obsidian)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold)',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Stamp size={16} />
            Certify & Lock Filing
          </button>
        )}
      </div>
    </header>
  );
};
