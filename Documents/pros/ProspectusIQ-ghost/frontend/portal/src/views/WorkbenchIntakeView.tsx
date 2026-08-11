import React from 'react';
import { DataIntakeChecklist } from '../components/intake/DataIntakeChecklist';
import { ValueConflictCard } from '../components/intake/ValueConflictCard';
import { Database } from 'lucide-react';
import { Filing } from '../types';

interface WorkbenchIntakeViewProps {
  filing: Filing;
}

export const WorkbenchIntakeView: React.FC<WorkbenchIntakeViewProps> = ({ filing }) => {
  const openFlags = filing.sections.flatMap((s) => s.flags).filter((f) => f.severity === 'CRITICAL' && f.status === 'OPEN');

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '24px', color: 'var(--color-primary-charcoal)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={22} color="var(--color-deep-forest)" /> Structured Data Intake & Conflict Verification
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-secondary-text)' }}>
          Category-level extraction checklist and automated source value conflict resolution.
        </p>
      </div>

      {/* Render Value Conflict Card if Critical Flags Exist */}
      {openFlags.length > 0 && (
        <ValueConflictCard
          fieldName={openFlags[0].title}
          sourceA={{ name: 'Audited Financial Statements', value: 'Values Discrepant', location: openFlags[0].clauseReference }}
          sourceB={{ name: 'Management Data Sheet', value: 'Pending Reconciliation', location: 'Annexure B' }}
        />
      )}

      {/* Intake Category Checklist */}
      <div style={{
        backgroundColor: 'var(--color-surface-white)',
        border: '1px solid var(--color-border-stone)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', color: 'var(--color-primary-text)', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
          Document Intake Status Checklist
        </h3>

        <DataIntakeChecklist filing={filing} />
      </div>
    </div>
  );
};
