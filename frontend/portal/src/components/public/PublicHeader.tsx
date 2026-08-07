import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

interface PublicHeaderProps {
  onOpenWorkbench: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenWorkbench, onNavigateSection }) => {
  return (
    <header style={{
      backgroundColor: 'var(--color-primary-charcoal)',
      borderBottom: '1px solid #292C33',
      color: '#FFFFFF',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-deep-forest)',
          border: '1px solid #34845F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Shield size={18} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
          Prospectus<span style={{ color: 'var(--color-antique-gold)' }}>IQ</span>
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--color-secondary-text)',
          borderLeft: '1px solid #3A3D45',
          paddingLeft: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Institutional RegTech Assurance
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13px', fontWeight: 500, color: '#D1D5DB' }}>
        <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
        <a href="#architecture" style={{ color: 'inherit', textDecoration: 'none' }}>Architecture</a>
        <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Security & Governance</a>
        <a href="#sample-audit" style={{ color: 'inherit', textDecoration: 'none' }}>Sample Audit</a>
      </nav>

      {/* Primary Action Button (Deep Forest #23483E) */}
      <button
        onClick={onOpenWorkbench}
        style={{
          padding: '8px 18px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #34845F',
          backgroundColor: 'var(--color-deep-forest)',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.15s ease'
        }}
      >
        Open Intermediary Workbench <ArrowRight size={14} />
      </button>
    </header>
  );
};
