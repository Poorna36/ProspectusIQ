import React from 'react';
import { AlertTriangle, ArrowRight, GitCompare, UserCheck } from 'lucide-react';

interface ValueConflictCardProps {
  fieldName: string;
  sourceA: { name: string; value: string; location: string };
  sourceB: { name: string; value: string; location: string };
  onCompareSources?: () => void;
  onAssignReviewer?: () => void;
}

export const ValueConflictCard: React.FC<ValueConflictCardProps> = ({
  fieldName = 'Revenue FY 2025–26',
  sourceA = { name: 'Audited AOC-4 Statements', value: '₹42.80 Crore', location: 'Sheet 2 • Cell F17' },
  sourceB = { name: 'Management Data Sheet', value: '₹43.10 Crore', location: 'Annexure B • Row 8' },
  onCompareSources,
  onAssignReviewer
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--status-review-bg)',
      border: '1px solid var(--status-review-border)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--status-review-color)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--status-review-color)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            VALUE CONFLICT DETECTED
          </span>
        </div>

        <span style={{ fontSize: '11px', color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>
          DISCREPANCY HIGH RISK
        </span>
      </div>

      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-text)', marginBottom: '12px' }}>
        Field: {fieldName}
      </h4>

      {/* Conflicting Values Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-stone)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)', fontWeight: 600 }}>Source A: {sourceA.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            {sourceA.value}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>{sourceA.location}</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-stone)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)', fontWeight: 600 }}>Source B: {sourceB.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-brick-red)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            {sourceB.value}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-secondary-text)', fontFamily: 'var(--font-mono)' }}>{sourceB.location}</div>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--color-primary-text)', marginBottom: '14px', lineHeight: '1.4' }}>
        This claim cannot be approved or drafted until the discrepancy between the audited financial statement and management sheet is resolved by the auditor.
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCompareSources || (() => alert('Opening side-by-side PDF source comparison viewer...'))}
          style={{
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-stone)',
            backgroundColor: 'var(--color-surface-white)',
            color: 'var(--color-primary-text)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <GitCompare size={14} /> Compare Sources Side-by-Side
        </button>

        <button
          onClick={onAssignReviewer || (() => alert('Discrepancy assigned to Auditor (Priya Shah) for formal clearance.'))}
          style={{
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--status-review-color)',
            backgroundColor: 'var(--status-review-color)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <UserCheck size={14} /> Assign to Auditor for Resolution
        </button>
      </div>
    </div>
  );
};
