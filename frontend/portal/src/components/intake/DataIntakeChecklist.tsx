import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { FileText, Upload } from 'lucide-react';
import { Filing } from '../../types';

interface DataIntakeChecklistProps {
  filing: Filing;
}

export const DataIntakeChecklist: React.FC<DataIntakeChecklistProps> = ({ filing }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {filing.sections.map((sec) => {
        const flagCount = sec.flags.length;
        const openFlags = sec.flags.filter((f) => f.status === 'OPEN');
        const isCleared = sec.status === 'CLEARED';

        return (
          <div
            key={sec.key}
            style={{
              backgroundColor: 'var(--color-surface-white)',
              border: '1px solid var(--color-border-stone)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="var(--color-deep-forest)" />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-text)' }}>
                  {sec.title} ({sec.chapter})
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary-text)' }}>
                  {sec.completionPercent}% Complete
                </span>
                <StatusBadge variant={isCleared ? 'approved' : openFlags.length > 0 ? 'review' : 'passed'} />
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-warm-ivory)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: `${sec.completionPercent}%`, height: '100%', backgroundColor: isCleared ? 'var(--status-passed-color)' : 'var(--color-deep-forest)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-secondary-text)' }}>
              <span>Assigned Reviewer: {sec.certifiedBy || 'Priya Shah (Lead Counsel)'}</span>
              <button
                onClick={() => alert(`Uploading document for ${sec.title}...`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-deep-forest)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Upload size={12} /> Upload Supplementary Document
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
