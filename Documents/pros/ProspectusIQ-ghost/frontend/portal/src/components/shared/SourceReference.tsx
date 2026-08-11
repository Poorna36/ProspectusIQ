import React from 'react';
import { FileText } from 'lucide-react';

interface SourceReferenceProps {
  documentName: string;
  location?: string;
  onClick?: () => void;
}

export const SourceReference: React.FC<SourceReferenceProps> = ({ documentName, location, onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--status-source-color)',
        backgroundColor: 'var(--status-source-bg)',
        border: '1px solid var(--status-source-border)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-sm)',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <FileText size={12} />
      <span>{documentName}</span>
      {location && <span style={{ color: 'var(--color-secondary-text)' }}>({location})</span>}
    </span>
  );
};
