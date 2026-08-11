import React from 'react';
import { SectionData } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

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
  // Find the furthest completed phase index — phases before it are accessible
  const lastCompletedIdx = sections.reduce((acc, sec, idx) => {
    if (sec.status === 'CLEARED' || sec.completionPercent > 0) return idx;
    return acc;
  }, 0);

  return (
    <aside style={{
      width: '260px',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #111827 100%)',
      borderRight: '1px solid #1F2937',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px 12px',
        borderBottom: '1px solid #1F2937',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>
          DRHP Filing Phases
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          {sections.filter(s => s.status === 'CLEARED').length} of {sections.length} phases cleared
        </div>
        {/* Overall progress bar */}
        <div style={{ marginTop: '10px', width: '100%', height: '4px', backgroundColor: '#374151', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.round((sections.filter(s => s.status === 'CLEARED').length / sections.length) * 100)}%`,
            background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
            borderRadius: '2px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Phase list */}
      <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {sections.map((sec, idx) => {
          const isActive = sec.key === activeSectionKey;
          const isAccessible = idx <= lastCompletedIdx + 1;
          const isComplete = sec.status === 'CLEARED';
          const hasFlags = sec.flags.filter(f => f.status === 'OPEN').length > 0;
          const phaseNum = idx + 1;

          return (
            <button
              key={sec.key}
              onClick={() => isAccessible && onSelectSection(sec.key)}
              title={!isAccessible ? 'Complete previous phases to unlock' : sec.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: isActive
                  ? '1px solid rgba(59,130,246,0.35)'
                  : '1px solid transparent',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(30,58,138,0.1) 100%)'
                  : 'transparent',
                cursor: isAccessible ? 'pointer' : 'default',
                textAlign: 'left',
                opacity: isAccessible ? 1 : 0.45,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              }}
              onMouseOver={(e) => { if (isAccessible && !isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {/* Phase number circle */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isComplete
                  ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                  : isActive
                    ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
                    : '#374151',
                boxShadow: isComplete
                  ? '0 2px 6px rgba(16,185,129,0.3)'
                  : isActive
                    ? '0 2px 6px rgba(59,130,246,0.3)'
                    : 'none',
              }}>
                {isComplete ? (
                  <CheckCircle2 size={14} color="#fff" />
                ) : !isAccessible ? (
                  <Lock size={11} color="#6B7280" />
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isActive ? '#fff' : '#9CA3AF' }}>{phaseNum}</span>
                )}
              </div>

              {/* Title & subtitle */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#60A5FA' : '#F3F4F6',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.3'
                }}>
                  {sec.title}
                </div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                  {sec.chapter}
                  {hasFlags && <span style={{ color: '#F59E0B', marginLeft: '6px', fontWeight: 700 }}>• {sec.flags.filter(f => f.status === 'OPEN').length} flag</span>}
                </div>
              </div>

              {/* Completion % badge */}
              <div style={{
                fontSize: '10px', fontWeight: 700,
                color: isComplete ? '#34D399' : isActive ? '#60A5FA' : '#6B7280',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0
              }}>
                {sec.completionPercent}%
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
