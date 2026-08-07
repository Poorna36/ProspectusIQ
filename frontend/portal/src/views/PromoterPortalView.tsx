import React, { useState } from 'react';
import { Filing, SectionData } from '../types';
import { GuidedInputWizard } from '../components/promoter/GuidedInputWizard';
import { AIDraftPreview } from '../components/promoter/AIDraftPreview';
import { FinancialsVizPanel } from '../components/promoter/FinancialsVizPanel';
import { UnstructuredNotesAssist } from '../components/promoter/UnstructuredNotesAssist';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Send, Sparkles, FileSpreadsheet, Wand2, FormInput, Eye } from 'lucide-react';

interface PromoterPortalViewProps {
  filing: Filing;
  onUpdateSection: (updatedSection: SectionData) => void;
  onSwitchToWorkbench: () => void;
}

export const PromoterPortalView: React.FC<PromoterPortalViewProps> = ({
  filing,
  onUpdateSection,
  onSwitchToWorkbench
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState<string>('RISK_FACTORS');
  const [activeTab, setActiveTab] = useState<'INPUT_FORM' | 'AI_DRAFT' | 'FINANCIALS_VIZ' | 'RAW_NOTES'>('AI_DRAFT');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  const activeSection = filing.sections.find((s) => s.key === activeSectionKey) || filing.sections[1];

  const handleSaveInputs = (inputs: Record<string, string | number>) => {
    setIsDrafting(true);
    setTimeout(() => {
      setIsDrafting(false);
      const updated: SectionData = {
        ...activeSection,
        status: 'AI_DRAFT_READY',
        inputs,
        aiDraftText: `${activeSection.aiDraftText}\n\n[UPDATED CLASSIFIED CLAUSE]: Top customer revenue share confirmed at ${inputs.topCustomersShare}%. DSO Days: ${inputs.dsoDays}. Patent status: ${inputs.patentDetails}.`
      };
      onUpdateSection(updated);
      setActiveTab('AI_DRAFT');
    }, 1500);
  };

  const handleAddComment = (comment: string) => {
    const updated: SectionData = {
      ...activeSection,
      promoterComments: [...(activeSection.promoterComments || []), comment]
    };
    onUpdateSection(updated);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 68px)' }}>
      {/* Left Navigation Sidebar */}
      <aside style={{
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--color-border-hairline)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-gold-deep)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            SEBI DRHP Chapters
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filing.sections.map((sec) => {
              const isActive = sec.key === activeSectionKey;
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSectionKey(sec.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sharp)',
                    border: isActive ? '1px solid var(--color-gold-primary)' : '1px solid transparent',
                    backgroundColor: isActive ? 'var(--color-gold-subtle)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Status Dot Indicator */}
                    {sec.status === 'CLEARED' ? (
                      <CheckCircle2 size={16} color="var(--color-cleared-green)" />
                    ) : sec.flags.some((f) => f.severity === 'CRITICAL') ? (
                      <XCircle size={16} color="var(--color-blocked-red)" />
                    ) : (
                      <AlertTriangle size={16} color="var(--color-flag-amber)" />
                    )}

                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 500,
                        color: 'var(--color-ink-obsidian)'
                      }}>
                        {sec.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                        {sec.chapter}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: sec.status === 'CLEARED' ? 'var(--color-cleared-green)' : 'var(--color-gold-deep)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {sec.completionPercent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Time to completion & Submit to Intermediary */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border-hairline)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--color-gold-primary)" /> Est. Completion: <strong>~12 mins</strong>
          </div>

          <button
            onClick={onSwitchToWorkbench}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-sharp)',
              border: 'none',
              backgroundColor: 'var(--color-gold-primary)',
              color: 'var(--color-ink-obsidian)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <Send size={14} /> Submit to Intermediary
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ padding: '28px', backgroundColor: 'var(--color-paper-bg)', overflowY: 'auto' }}>
        {/* Top Tab Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border-hairline)'
        }}>
          <button
            onClick={() => setActiveTab('AI_DRAFT')}
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
              backgroundColor: activeTab === 'AI_DRAFT' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'AI_DRAFT' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <Eye size={16} /> AI Draft Preview
          </button>

          <button
            onClick={() => setActiveTab('INPUT_FORM')}
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
              backgroundColor: activeTab === 'INPUT_FORM' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'INPUT_FORM' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <FormInput size={16} /> Guided SME Input Wizard
          </button>

          <button
            onClick={() => setActiveTab('FINANCIALS_VIZ')}
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
              backgroundColor: activeTab === 'FINANCIALS_VIZ' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'FINANCIALS_VIZ' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <FileSpreadsheet size={16} /> Financial Visualization
          </button>

          <button
            onClick={() => setActiveTab('RAW_NOTES')}
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
              backgroundColor: activeTab === 'RAW_NOTES' ? 'var(--color-ink-obsidian)' : 'transparent',
              color: activeTab === 'RAW_NOTES' ? 'var(--color-gold-bright)' : 'var(--color-ink-muted)'
            }}
          >
            <Wand2 size={16} /> Unstructured Notes Assist
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'AI_DRAFT' && (
          <AIDraftPreview section={activeSection} onAddComment={handleAddComment} />
        )}

        {activeTab === 'INPUT_FORM' && (
          <GuidedInputWizard section={activeSection} onSaveInputs={handleSaveInputs} isDrafting={isDrafting} />
        )}

        {activeTab === 'FINANCIALS_VIZ' && (
          <FinancialsVizPanel />
        )}

        {activeTab === 'RAW_NOTES' && (
          <UnstructuredNotesAssist />
        )}
      </main>
    </div>
  );
};
