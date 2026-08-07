import React, { useState } from 'react';
import { Filing, SectionData } from '../types';
import { PaneMode } from '../types/ui';
import { SectionsNavigationPane } from '../components/workbench/SectionsNavigationPane';
import { DocumentEditorPane } from '../components/workbench/DocumentEditorPane';
import { AuditPanel } from '../components/workbench/AuditPanel';
import { EvidenceInspectorPanel } from '../components/workbench/EvidenceInspectorPanel';
import { ParagraphRegenerateModal } from '../components/workbench/ParagraphRegenerateModal';

interface WorkbenchEditorViewProps {
  filing: Filing;
  isLeftPaneOpen: boolean;
  isRightPaneOpen: boolean;
  onUpdateSection: (updatedSection: SectionData) => void;
}

export const WorkbenchEditorView: React.FC<WorkbenchEditorViewProps> = ({
  filing,
  isLeftPaneOpen,
  isRightPaneOpen,
  onUpdateSection
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState<string>('RISK_FACTORS');
  const [rightPaneMode, setRightPaneMode] = useState<PaneMode>('audit');
  const [selectedClaim, setSelectedClaim] = useState<{ title: string; value: string; source: string } | null>(null);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [targetParagraphText, setTargetParagraphText] = useState('');

  const activeSection = filing.sections.find((s) => s.key === activeSectionKey) || filing.sections[1];

  const handleSelectEvidenceClaim = (title: string, value: string, source: string) => {
    setSelectedClaim({ title, value, source });
    setRightPaneMode('evidence');
  };

  const handleOpenRegenerateModal = (paragraphText: string) => {
    setTargetParagraphText(paragraphText);
    setIsRegenerateModalOpen(true);
  };

  const handleSaveParagraphEdit = (newText: string) => {
    const updated: SectionData = {
      ...activeSection,
      humanRedlineText: newText,
      status: 'CLEARED'
    };
    onUpdateSection(updated);
  };

  const handleResolveFlag = (flagId: string) => {
    const updatedFlags = activeSection.flags.map((f) =>
      f.id === flagId ? { ...f, status: 'RESOLVED' as const, resolvedBy: 'Priya Shah (Lead Counsel)' } : f
    );
    const allResolved = updatedFlags.every((f) => f.status === 'RESOLVED');

    const updated: SectionData = {
      ...activeSection,
      flags: updatedFlags,
      status: allResolved ? 'CLEARED' : activeSection.status
    };
    onUpdateSection(updated);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 86px)', overflow: 'hidden' }}>
      {/* 240px Left Navigation Pane */}
      {isLeftPaneOpen && (
        <SectionsNavigationPane
          sections={filing.sections}
          activeSectionKey={activeSectionKey}
          onSelectSection={(key) => {
            setActiveSectionKey(key);
            setRightPaneMode('audit');
          }}
        />
      )}

      {/* Flexible Center Document Editor Surface */}
      <DocumentEditorPane
        section={activeSection}
        onSelectEvidenceClaim={handleSelectEvidenceClaim}
        onOpenRegenerateModal={handleOpenRegenerateModal}
        onSaveParagraphEdit={handleSaveParagraphEdit}
      />

      {/* Right Panel: 360px Audit Panel OR 440px Evidence Inspector Panel */}
      {isRightPaneOpen && (
        rightPaneMode === 'evidence' && selectedClaim ? (
          <EvidenceInspectorPanel
            claimTitle={selectedClaim.title}
            displayedValue={selectedClaim.value}
            sourceDocument={selectedClaim.source}
            onBackToAuditPanel={() => setRightPaneMode('audit')}
          />
        ) : (
          <AuditPanel
            section={activeSection}
            onSelectEvidenceClaim={handleSelectEvidenceClaim}
            onResolveFlag={handleResolveFlag}
          />
        )
      )}

      {/* Paragraph AI Regeneration Modal */}
      <ParagraphRegenerateModal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        selectedParagraphText={targetParagraphText}
        onAcceptRegeneration={(revisedText) => {
          handleSaveParagraphEdit(revisedText);
        }}
      />
    </div>
  );
};
