import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, badge }) => {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface-white)',
      border: '1px solid var(--color-border-stone)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-secondary-text)', fontWeight: 600 }}>{label}</span>
        {badge}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
