import React, { useState } from 'react';
import { Filing, SectionData, DueDiligenceRecord, PeerMetric, AuditLogItem } from '../types';
import { ProspectusIQApi } from '../services/api';
import { MultiFilingDashboard } from '../components/intermediary/MultiFilingDashboard';
import { DraftRedlineEditor } from '../components/intermediary/DraftRedlineEditor';
import { FlagResolutionDrawer } from '../components/intermediary/FlagResolutionDrawer';
import { DueDiligencePanel } from '../components/intermediary/DueDiligencePanel';
import { PeerComparisonTable } from '../components/intermediary/PeerComparisonTable';
import { AuditTrailLog } from '../components/intermediary/AuditTrailLog';
import { Layers, Edit3, ShieldAlert, FileSearch, BarChart2, History, Stamp, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface IntermediaryWorkbenchViewProps {
  filing: Filing;
  dueDiligence: DueDiligenceRecord[];
  peerMetrics: PeerMetric[];
  auditLogs: AuditLogItem[];
  onUpdateSection: (updatedSection: SectionData) => void;
  onOpenCertifyModal: () => void;
}

export const IntermediaryWorkbenchView: React.FC<IntermediaryWorkbenchViewProps> = ({
  filing,
  dueDiligence,
  peerMetrics,
  auditLogs,
  onUpdateSection,
  onOpenCertifyModal
}) => {
  const [activeTab, setActiveTab] = useState<'DRAFT' | 'FLAGS' | 'DUE_DILIGENCE' | 'PEER_COMPARISON' | 'AUDIT_TRAIL' | 'PORTFOLIO'>('DRAFT');
  const [activeSectionKey, setActiveSectionKey] = useState<string>('RISK_FACTORS');

  const activeSection = filing.sections.find((s) => s.key === activeSectionKey) || filing.sections[1];

  const handleSaveRedline = async (newText: string) => {
    try {
      await ProspectusIQApi.saveHumanRedline(filing.id, activeSection.key, newText);
    } catch (e) {
      console.warn('Backend save redline API call handled:', e);
    }
    const updated: SectionData = {
      ...activeSection,
      humanRedlineText: newText,
      status: 'CLEARED'
    };
    onUpdateSection(updated);
  };

  const handleResolveFlag = async (flagId: string) => {
    try {
      await ProspectusIQApi.resolveFlag(filing.id, flagId, 'Resolved by Lead Intermediary');
    } catch (e) {
      console.warn('Backend resolve flag API call handled:', e);
    }
    const updatedFlags = activeSection.flags.map((f) =>
      (f.id === flagId || f.flagId === flagId) ? { ...f, status: 'RESOLVED' as const, resolvedBy: 'Lead Intermediary' } : f
    );
    const allFlagsResolved = updatedFlags.every((f) => f.status === 'RESOLVED');

    const updated: SectionData = {
      ...activeSection,
      flags: updatedFlags,
      status: allFlagsResolved ? 'CLEARED' : activeSection.status
    };
    onUpdateSection(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 68px)', backgroundColor: 'var(--color-paper-bg)' }}>
      {/* Top Workbench Sub-Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border-hairline)',
        padding: '0 28px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '68px',
        zIndex: 90
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('DRAFT')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'DRAFT' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'DRAFT' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <Edit3 size={15} /> Clause Draft & Redline
          </button>

          <button
            onClick={() => setActiveTab('FLAGS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'FLAGS' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'FLAGS' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <ShieldAlert size={15} /> Compliance Flags ({filing.sections.flatMap(s => s.flags).filter(f => f.status === 'OPEN').length})
          </button>

          <button
            onClick={() => setActiveTab('DUE_DILIGENCE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'DUE_DILIGENCE' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'DUE_DILIGENCE' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <FileSearch size={15} /> Due Diligence APIs
          </button>

          <button
            onClick={() => setActiveTab('PEER_COMPARISON')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'PEER_COMPARISON' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'PEER_COMPARISON' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <BarChart2 size={15} /> Peer Valuation Matrix
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'AUDIT_TRAIL' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'AUDIT_TRAIL' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <History size={15} /> Audit Chain
          </button>

          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'PORTFOLIO' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'PORTFOLIO' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <Building size={15} /> All SME Filings
          </button>
        </div>

        {/* Section Picker Pill Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
            Section:
          </span>
          <select
            value={activeSectionKey}
            onChange={(e) => setActiveSectionKey(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sharp)',
              border: '1px solid var(--color-border-hairline)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-ink-obsidian)',
              backgroundColor: '#FFFFFF'
            }}
          >
            {filing.sections.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title} ({s.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Workspace Body */}
      <div style={{ flex: 1, padding: '28px' }}>
        {activeTab === 'DRAFT' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
            <DraftRedlineEditor section={activeSection} onSaveRedline={handleSaveRedline} />
            <FlagResolutionDrawer flags={activeSection.flags} onResolveFlag={handleResolveFlag} />
          </div>
        )}

        {activeTab === 'FLAGS' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FlagResolutionDrawer flags={filing.sections.flatMap(s => s.flags)} onResolveFlag={handleResolveFlag} />
          </div>
        )}

        {activeTab === 'DUE_DILIGENCE' && (
          <DueDiligencePanel records={dueDiligence} />
        )}

        {activeTab === 'PEER_COMPARISON' && (
          <PeerComparisonTable metrics={peerMetrics} />
        )}

        {activeTab === 'AUDIT_TRAIL' && (
          <AuditTrailLog logs={auditLogs} />
        )}

        {activeTab === 'PORTFOLIO' && (
          <MultiFilingDashboard filing={filing} onSelectFiling={() => setActiveTab('DRAFT')} />
        )}
      </div>

      {/* Footer Metrics & Certify Bar */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-border-hairline)',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 0,
        zIndex: 90
      }}>
        {/* Metric Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <ShieldCheck size={16} color="var(--color-cleared-green)" />
            <span style={{ color: 'var(--color-ink-muted)' }}>AI Verifier Accuracy Rate:</span>
            <strong style={{ color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-mono)' }}>94.2%</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <Edit3 size={16} color="var(--color-gold-deep)" />
            <span style={{ color: 'var(--color-ink-muted)' }}>Intermediary Redline Rate:</span>
            <strong style={{ color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-mono)' }}>3.8%</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <CheckCircle2 size={16} color="var(--color-cleared-green)" />
            <span style={{ color: 'var(--color-ink-muted)' }}>Cleared Sections:</span>
            <strong style={{ color: 'var(--color-cleared-green)', fontFamily: 'var(--font-mono)' }}>
              {filing.sections.filter(s => s.status === 'CLEARED').length} / {filing.sections.length}
            </strong>
          </div>
        </div>

        {/* Certify & Lock CTA */}
        <button
          onClick={onOpenCertifyModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: 'var(--radius-sharp)',
            border: 'none',
            background: 'linear-gradient(135deg, var(--color-gold-primary) 0%, var(--color-gold-deep) 100%)',
            color: 'var(--color-ink-obsidian)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-gold)'
          }}
        >
          <Stamp size={16} /> Certify & Seal DRHP Section
        </button>
      </footer>
    </div>
  );
};
