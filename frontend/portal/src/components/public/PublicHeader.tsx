import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '../shared/BrandLogo';

interface PublicHeaderProps {
  onOpenWorkbench: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenWorkbench }) => {
  return (
    <header style={{
      backgroundColor: 'rgba(14,16,20,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(42,45,53,0.8)',
      color: '#FFFFFF',
      padding: '0 44px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand Emblem & Logo */}
      <BrandLogo
        size="md"
        showSubtitle={true}
        subtitleText="Institutional RegTech"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Navigation links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { label: 'Product', href: '#product' },
          { label: 'Architecture', href: '#architecture' },
          { label: 'Security', href: '#security' },
          { label: 'Sample Audit', href: '#sample-audit' },
        ].map(item => (
          <a
            key={item.href}
            href={item.href}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              color: '#9CA3AF', textDecoration: 'none',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#FAFAF9'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Enter Platform CTA */}
      <button
        onClick={onOpenWorkbench}
        style={{
          padding: '11px 24px', borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          color: '#FFFFFF', fontSize: '13px', fontWeight: 800,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(249,115,22,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Enter Platform <ArrowRight size={15} />
      </button>
    </header>
  );
};
