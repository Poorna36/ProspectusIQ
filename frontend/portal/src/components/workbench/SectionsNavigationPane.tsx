import React from 'react';
import { SectionData } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { ChevronRight, FileText } from 'lucide-react';

interface SectionsNavigationPaneProps {
  sections: SectionData[];
  activeSectionKey: string;
  onSelectSection: (key: string) => void;
}

export const SectionsNavigationPane: React.FC<SectionsNavigationPaneProps> = ({
  sections,
  activeSectionKey,
  onSelectSection
}) => {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--color-surface-white)',
      borderRight: '1px solid var(--color-border-stone)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-border-stone)',
        fontSize: '11px',
        fontWeight: 800,
        color: 'var(--color-secondary-text)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        DRHP Sections ({sections.length})
      </div>

      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sections.map((sec) => {
          const isActive = sec.key === activeSectionKey;
          const openFlags = sec.flags.filter((f) => f.status === 'OPEN');
          const hasCritical = openFlags.some((f) => f.severity === 'CRITICAL');

          return (
            <button
              key={sec.key}
              onClick={() => onSelectSection(sec.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--color-deep-forest)' : '1px solid transparent',
                backgroundColor: isActive ? 'var(--color-warm-ivory)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: 'var(--color-primary-text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {sec.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span>{sec.chapter}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                {sec.certified ? (
                  <StatusBadge variant="certified" size="sm" />
                ) : hasCritical ? (
                  <StatusBadge variant="failed" size="sm" customLabel={`${openFlags.length}`} />
                ) : openFlags.length > 0 ? (
                  <StatusBadge variant="review" size="sm" customLabel={`${openFlags.length}`} />
                ) : (
                  <StatusBadge variant="passed" size="sm" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
