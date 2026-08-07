import React from 'react';
import { UserCheck } from 'lucide-react';

interface ReviewerIdentityProps {
  name: string;
  role: string;
  timestamp?: string;
}

export const ReviewerIdentity: React.FC<ReviewerIdentityProps> = ({ name, role, timestamp }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-deep-forest)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700
      }}>
        {name.charAt(0)}
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-primary-text)' }}>{name}</div>
        <div style={{ fontSize: '10px', color: 'var(--color-secondary-text)' }}>
          {role} {timestamp && `• ${timestamp}`}
        </div>
      </div>
    </div>
  );
};
