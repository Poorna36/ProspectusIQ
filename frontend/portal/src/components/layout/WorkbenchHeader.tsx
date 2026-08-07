import React from 'react';
import { WorkbenchRoute } from '../../types/ui';
import { Shield, Building2, User, ExternalLink, Menu, Sidebar, CheckCircle2, Lock } from 'lucide-react';

interface WorkbenchHeaderProps {
  currentRoute: WorkbenchRoute;
  onNavigate: (route: WorkbenchRoute) => void;
  onOpenPublicSite: () => void;
  issuerName?: string;
  listingTarget?: string;
  draftVersion?: string;
  workflowStage?: string;
  completionPercent?: number;
  currentReviewer?: string;
  isLeftPaneOpen?: boolean;
  isRightPaneOpen?: boolean;
  onToggleLeftPane?: () => void;
  onToggleRightPane?: () => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenPublicSite,
  issuerName = 'ABC Industries Pvt Ltd',
  listingTarget = 'NSE Emerge',
  draftVersion = 'DRHP v12',
  workflowStage = 'Legal Review',
  completionPercent = 93,
  currentReviewer = 'Priya Shah (Lead Counsel)',
  isLeftPaneOpen = true,
  isRightPaneOpen = true,
  onToggleLeftPane,
  onToggleRightPane
}) => {
  return (
    <header style={{
      backgroundColor: 'var(--color-primary-charcoal)',
      borderBottom: '1px solid #292C33',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Level Header */}
      <div style={{
        height: '48px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #292C33'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-deep-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Shield size={14} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
            Prospectus<span style={{ color: 'var(--color-antique-gold)' }}>IQ</span>
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginLeft: '6px' }}>
            Intermediary Workbench
          </span>
        </div>

        {/* Level 1 Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {(['dashboard', 'intake', 'editor', 'rules', 'certification'] as WorkbenchRoute[]).map((route) => {
            const isActive = currentRoute === route;
            const labels: Record<WorkbenchRoute, string> = {
              dashboard: 'Dashboard',
              intake: 'Data Intake',
              editor: 'Filing Editor',
              rules: 'Rules Engine',
              certification: 'Certification'
            };

            return (
              <button
                key={route}
                onClick={() => onNavigate(route)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#292C33' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  transition: 'all 0.15s ease'
                }}
              >
                {labels[route]}
              </button>
            );
          })}
        </nav>

        {/* Public Site Link & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onOpenPublicSite}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Public Assurance Site <ExternalLink size={11} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#E5E7EB' }}>
            <User size={14} color="var(--color-antique-gold)" />
            <span>{currentReviewer}</span>
          </div>
        </div>
      </div>

      {/* Context Level Header (Level 2 Sub-Bar) */}
      <div style={{
        height: '38px',
        padding: '0 24px',
        backgroundColor: '#292C33',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#D1D5DB'
      }}>
        {/* Left: Active Issuer & Context Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Responsive Pane Controls */}
          {currentRoute === 'editor' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '12px', borderRight: '1px solid #3F424A' }}>
              <button
                onClick={onToggleLeftPane}
                title="Toggle Sections Sidebar"
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #4B5563',
                  backgroundColor: isLeftPaneOpen ? '#374151' : 'transparent',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Menu size={12} /> Sections
              </button>

              <button
                onClick={onToggleRightPane}
                title="Toggle Audit Panel"
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #4B5563',
                  backgroundColor: isRightPaneOpen ? '#374151' : 'transparent',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sidebar size={12} /> Audit Panel
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#FFFFFF' }}>
            <Building2 size={13} color="var(--color-antique-gold)" />
            {issuerName}
          </div>

          <span style={{ color: '#6B7280' }}>•</span>
          <span>Target: <strong style={{ color: '#E5E7EB' }}>{listingTarget}</strong></span>
          <span style={{ color: '#6B7280' }}>•</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{draftVersion}</span>
          <span style={{ color: '#6B7280' }}>•</span>
          <span style={{
            fontSize: '11px',
            backgroundColor: '#374151',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            color: '#F3F4F6',
            fontWeight: 600
          }}>
            Stage: {workflowStage}
          </span>
        </div>

        {/* Right: Completion Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Readiness:</span>
          <div style={{ width: '80px', height: '6px', backgroundColor: '#111827', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercent}%`, height: '100%', backgroundColor: 'var(--status-passed-color)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-passed-color)' }}>
            {completionPercent}%
          </span>
        </div>
      </div>
    </header>
  );
};
