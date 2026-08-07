import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'No records or results matched the selected filters.',
  action
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface-white)',
      border: '1px solid var(--color-border-stone)',
      borderRadius: 'var(--radius-md)',
      padding: '40px 24px',
      textAlign: 'center',
      color: 'var(--color-secondary-text)'
    }}>
      <FileQuestion size={36} color="var(--color-secondary-text)" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary-text)', marginBottom: '6px' }}>{title}</h4>
      <p style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto 16px auto', lineHeight: '1.4' }}>{description}</p>
      {action}
    </div>
  );
};
