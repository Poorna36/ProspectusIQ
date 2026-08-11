import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  subtitleText = 'Institutional RegTech',
  onClick
}) => {
  const iconSizes = {
    sm: { width: 34, height: 34, fontSize: '20px' },
    md: { width: 42, height: 42, fontSize: '26px' },
    lg: { width: 50, height: 50, fontSize: '30px' },
  };

  const currentSize = iconSizes[size];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Deep Forest Green Container with New PDF Document SVG Icon in IQ Gold */}
      <div style={{
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
        borderRadius: '11px',
        background: 'linear-gradient(135deg, #1A4035 0%, #23543D 100%)',
        border: '1.5px solid #2D6E50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 16px rgba(35,84,61,0.5)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* PDF/Prospectus Document SVG in Metallic Antique Gold */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Folded Document Outline */}
          <path d="M4 6C4 4.89543 4.89543 4 6 4H14L19 9V18C19 19.1046 18.1046 20 17 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V9H19" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          {/* Inner AI Spark Core */}
          <path d="M11 11L12.2 13.8L15 15L12.2 16.2L11 19L9.8 16.2L7 15L9.8 13.8L11 11Z" fill="#C9A84C" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontSize: currentSize.fontSize,
          fontWeight: 800,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.6px',
          lineHeight: '1',
          color: '#F5F2EA',
        }}>
          Prospectus<span style={{ color: '#C9A84C', marginLeft: '2px', fontWeight: 900 }}>IQ</span>
        </div>

        {showSubtitle && (
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            marginTop: '3px',
          }}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
