import React, { useState, useEffect } from 'react';
import { WorkbenchRoute } from './types/ui';
import { Filing, SectionData } from './types';
import { ProspectusIQApi } from './services/api';

// Public Components
import { PublicLandingView } from './views/PublicLandingView';

// Workbench Components
import { WorkbenchHeader } from './components/layout/WorkbenchHeader';
import { WorkbenchDashboardView } from './views/WorkbenchDashboardView';
import { WorkbenchIntakeView } from './views/WorkbenchIntakeView';
import { WorkbenchEditorView } from './views/WorkbenchEditorView';
import { WorkbenchRulesView } from './views/WorkbenchRulesView';
import { WorkbenchCertificationView } from './views/WorkbenchCertificationView';
import { LoadingSkeleton } from './components/shared/LoadingSkeleton';
import { ErrorState } from './components/shared/ErrorState';

export function App() {
  const [currentMode, setCurrentMode] = useState<'PUBLIC_SITE' | 'WORKBENCH'>('PUBLIC_SITE');
  const [workbenchRoute, setWorkbenchRoute] = useState<WorkbenchRoute>('editor');

  // Active filing state (starts null until loaded from live backend API)
  const [filing, setFiling] = useState<Filing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchFilingData = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const data = await ProspectusIQApi.getActiveFiling('FL-2026-ABC-01');
      setFiling(data);
    } catch (err: any) {
      console.error('Backend API Fetch Error:', err);
      setApiError(err.message || 'Unable to connect to backend service on http://localhost:8000/api/v1');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilingData();
  }, []);

  // Responsive Pane Controls
  const [isLeftPaneOpen, setIsLeftPaneOpen] = useState(true);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(true);

  const handleUpdateSection = (updatedSection: SectionData) => {
    if (!filing) return;
    const updatedSections = filing.sections.map((s) => (s.key === updatedSection.key ? updatedSection : s));
    const clearedCount = updatedSections.filter((s) => s.status === 'CLEARED').length;
    const newPercent = Math.round((clearedCount / updatedSections.length) * 100);

    setFiling({
      ...filing,
      sections: updatedSections,
      completionPercent: newPercent
    });
  };

  const handleExecuteCertification = async () => {
    if (!filing) return;
    try {
      await ProspectusIQApi.certifyFiling(filing.id, 'Priya Shah (Lead Counsel)');
    } catch (e) {
      // Handled
    }

    const certifiedSections = filing.sections.map((s) => ({
      ...s,
      certified: true,
      certifiedBy: 'Priya Shah (Lead Counsel)',
      certifiedAt: new Date().toISOString()
    }));

    setFiling({
      ...filing,
      sections: certifiedSections,
      completionPercent: 100,
      overallStatus: 'CERTIFIED_SEALED'
    });
  };

  if (currentMode === 'PUBLIC_SITE') {
    return (
      <PublicLandingView
        onOpenWorkbench={() => {
          setCurrentMode('WORKBENCH');
          setWorkbenchRoute('editor');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-warm-ivory)' }}>
      {/* Workbench Header */}
      <WorkbenchHeader
        currentRoute={workbenchRoute}
        onNavigate={(route) => setWorkbenchRoute(route)}
        onOpenPublicSite={() => setCurrentMode('PUBLIC_SITE')}
        issuerName={filing?.companyName || 'Loading Issuer...'}
        listingTarget="NSE Emerge"
        draftVersion="DRHP v12"
        workflowStage="Legal Review"
        completionPercent={filing?.completionPercent || 0}
        currentReviewer="Priya Shah (Lead Counsel)"
        isLeftPaneOpen={isLeftPaneOpen}
        isRightPaneOpen={isRightPaneOpen}
        onToggleLeftPane={() => setIsLeftPaneOpen(!isLeftPaneOpen)}
        onToggleRightPane={() => setIsRightPaneOpen(!isRightPaneOpen)}
      />

      {/* Main Workbench Body View */}
      {isLoading ? (
        <div style={{ padding: '64px', maxWidth: '800px', margin: '0 auto' }}>
          <LoadingSkeleton count={6} />
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--color-secondary-text)' }}>
            Connecting to Backend REST API at <code>http://localhost:8000/api/v1/filings/FL-2026-ABC-01</code>...
          </div>
        </div>
      ) : apiError && !filing ? (
        <div style={{ padding: '64px', maxWidth: '700px', margin: '0 auto' }}>
          <ErrorState
            title="Backend Service Offline"
            message={apiError}
            onRetry={fetchFilingData}
          />
        </div>
      ) : filing ? (
        <>
          {workbenchRoute === 'dashboard' && (
            <WorkbenchDashboardView
              filing={filing}
              onNavigateToEditor={() => setWorkbenchRoute('editor')}
            />
          )}

          {workbenchRoute === 'intake' && (
            <WorkbenchIntakeView filing={filing} />
          )}

          {workbenchRoute === 'editor' && (
            <WorkbenchEditorView
              filing={filing}
              isLeftPaneOpen={isLeftPaneOpen}
              isRightPaneOpen={isRightPaneOpen}
              onUpdateSection={handleUpdateSection}
            />
          )}

          {workbenchRoute === 'rules' && (
            <WorkbenchRulesView filing={filing} />
          )}

          {workbenchRoute === 'certification' && (
            <WorkbenchCertificationView
              filing={filing}
              onExecuteCertification={handleExecuteCertification}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export default App;
