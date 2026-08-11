import React from 'react';
import { WorkbenchRoute } from '../../types/ui';
import { Shield, Building2, ExternalLink, Menu, Sidebar, MessageSquare, ScrollText, Download } from 'lucide-react';
import { BrandLogo } from '../shared/BrandLogo';

interface WorkbenchHeaderProps {
  currentRoute: WorkbenchRoute;
  onNavigate: (route: WorkbenchRoute) => void;
  onOpenPublicSite: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
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
  onOpenMessaging?: () => void;
  onOpenAudit?: () => void;
  onExportPDF?: () => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenPublicSite,
  onGoHome,
  onLogout,
  issuerName = 'ABC Industries Pvt Ltd',
  listingTarget = 'NSE Emerge',
  draftVersion = 'DRHP v12',
  workflowStage = 'Legal Review',
  completionPercent = 93,
  currentReviewer = 'Priya Shah (Lead Counsel)',
  isLeftPaneOpen = true,
  isRightPaneOpen = true,
  onToggleLeftPane,
  onToggleRightPane,
  onOpenMessaging,
  onOpenAudit,
  onExportPDF,
}) => {
  const navItems: { route: WorkbenchRoute; label: string }[] = [
    { route: 'dashboard', label: 'Dashboard' },
    { route: 'intake', label: 'Data Intake' },
    { route: 'editor', label: 'Filing Editor' },
    { route: 'rules', label: 'Rules Engine' },
    { route: 'certification', label: 'Certification' },
  ];

  return (
    <header style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      borderBottom: '1px solid #1E3A5F',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Level Header */}
      <div style={{
        height: '52px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Brand */}
        <BrandLogo
          size="sm"
          showSubtitle={true}
          subtitleText="Intermediary Workbench"
          onClick={onGoHome || onOpenPublicSite}
        />

        {/* Nav Tabs — pill style with backgrounds */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
          {navItems.map(({ route, label }) => {
            const isActive = currentRoute === route;
            return (
              <button
                key={route}
                onClick={() => onNavigate(route)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#1D4ED8' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(29,78,216,0.35)' : 'none',
                  letterSpacing: isActive ? '0' : '0.1px',
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#E2E8F0'; }}
                onMouseOut={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right: User info + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Action Buttons */}
          {[{
            icon: <MessageSquare size={15} />, label: 'Messages', onClick: onOpenMessaging,
          }, {
            icon: <ScrollText size={15} />, label: 'Audit Log', onClick: onOpenAudit,
          }, {
            icon: <Download size={15} />, label: 'Export PDF', onClick: onExportPDF,
          }].map(({ icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              title={label}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 10px', color: '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s', fontWeight: 600 }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#E2E8F0'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              {icon} {label}
            </button>
          ))}
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
          <button
            onClick={onOpenPublicSite}
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '11px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ExternalLink size={10} /> Public Site
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '5px 12px',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 800, color: '#fff',
            }}>
              {currentReviewer.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 500 }}>{currentReviewer}</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
              backgroundColor: 'rgba(29,78,216,0.3)', color: '#93C5FD',
              padding: '2px 7px', borderRadius: '5px', letterSpacing: '0.5px',
              border: '1px solid rgba(29,78,216,0.4)'
            }}>BRLM</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                padding: '5px 12px', borderRadius: '7px',
                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent',
                color: '#64748B', fontSize: '11px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Context Sub-Bar */}
      <div style={{
        height: '36px',
        padding: '0 24px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#94A3B8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentRoute === 'editor' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '12px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={onToggleLeftPane}
                style={{
                  padding: '3px 10px', borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isLeftPaneOpen ? 'rgba(29,78,216,0.25)' : 'transparent',
                  color: isLeftPaneOpen ? '#93C5FD' : '#64748B',
                  fontSize: '11px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <Menu size={11} /> Phases
              </button>
              <button
                onClick={onToggleRightPane}
                style={{
                  padding: '3px 10px', borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isRightPaneOpen ? 'rgba(29,78,216,0.25)' : 'transparent',
                  color: isRightPaneOpen ? '#93C5FD' : '#64748B',
                  fontSize: '11px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <Sidebar size={11} /> Audit Panel
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#E2E8F0' }}>
            <Building2 size={12} color="#60A5FA" />
            {issuerName}
          </div>
          <span style={{ color: '#334155' }}>•</span>
          <span>Target: <strong style={{ color: '#E2E8F0' }}>{listingTarget}</strong></span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{draftVersion}</span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            backgroundColor: 'rgba(249,115,22,0.15)', color: '#FB923C',
            padding: '2px 8px', borderRadius: '5px',
            border: '1px solid rgba(249,115,22,0.2)'
          }}>
            {workflowStage}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#475569' }}>Readiness:</span>
          <div style={{ width: '80px', height: '5px', backgroundColor: '#0F172A', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${completionPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1D4ED8 0%, #60A5FA 100%)',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#60A5FA', fontSize: '11px' }}>
            {completionPercent}%
          </span>
        </div>
      </div>
    </header>
  );
};
