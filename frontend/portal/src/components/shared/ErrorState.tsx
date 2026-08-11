import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Service Connection Interrupted',
  message = 'Unable to fetch real-time compliance results from backend endpoint.',
  onRetry
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--status-failed-bg)',
      border: '1px solid var(--status-failed-border)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      color: 'var(--status-failed-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{title}</h4>
          <p style={{ fontSize: '13px', lineHeight: '1.4', marginBottom: '12px' }}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--status-failed-color)',
                backgroundColor: '#FFFFFF',
                color: 'var(--status-failed-color)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Retry Endpoint Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
