import React, { useState, useEffect, useCallback } from 'react';
import { WorkbenchRoute } from './types/ui';
import { Filing, SectionData } from './types';
import { ProspectusIQApi, getAuthToken, clearAuthToken } from './services/api';
import { LoginView, LoggedInUser } from './views/LoginView';

// Public Components
import { PublicLandingView } from './views/PublicLandingView';

// Promoter Components
import { PromoterPortalView } from './views/PromoterPortalView';

// Intermediary Workbench Components
import { WorkbenchHeader } from './components/layout/WorkbenchHeader';
import { WorkbenchDashboardView } from './views/WorkbenchDashboardView';
import { WorkbenchIntakeView } from './views/WorkbenchIntakeView';
import { WorkbenchEditorView } from './views/WorkbenchEditorView';
import { WorkbenchRulesView } from './views/WorkbenchRulesView';
import { WorkbenchCertificationView } from './views/WorkbenchCertificationView';
import { LoadingSkeleton } from './components/shared/LoadingSkeleton';
import { ErrorState } from './components/shared/ErrorState';
import { GlobalDrawers } from './components/shared/GlobalDrawers';
import { NotificationToast, ToastMessage } from './components/shared/NotificationToast';

// Print CSS
const PRINT_STYLE = `
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  .print-watermark {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%,-50%) rotate(-35deg);
    font-size: 72px; font-weight: 900; opacity: 0.06;
    color: #000; pointer-events: none; z-index: 9999;
    white-space: nowrap; letter-spacing: 4px;
  }
}
`;

type AppMode = 'PUBLIC_SITE' | 'LOGIN' | 'PROMOTER' | 'WORKBENCH';

// ── EMPTY filing used for NEW users ────────────────────────────────────────
const EMPTY_MOCK_FILING: Filing = {
  id: 'FL-2026-ABC-01',
  companyName: 'TechNova Solutions Ltd',
  cin: 'U72900MH2024PTC123456',
  gstin: '27AAACT1234F1Z5',
  sector: 'Technology & AI Solutions',
  targetIssueSize: '₹28.5 Cr',
  completionPercent: 0,
  overallStatus: 'DRAFT_IN_PROGRESS',
  sections: [
    { key: 'CH_01', title: 'Cover Page & General Information', chapter: 'Phase 1', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_02', title: 'Industry & Business Overview', chapter: 'Phase 2', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_03', title: 'Capital Structure & Shareholding', chapter: 'Phase 3', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_04', title: 'Management & Corporate Governance', chapter: 'Phase 4', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_05', title: 'Financial Information & Restatements', chapter: 'Phase 5', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'RISK_FACTORS', title: 'Risk Factors & Material Disclosures', chapter: 'Phase 6', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_07', title: 'Legal & Outstanding Litigation', chapter: 'Phase 7', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_08', title: 'Regulatory & Compliance Disclosures', chapter: 'Phase 8', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_04_OBJ', title: 'Objects of the Issue — Detailed Utilisation', chapter: 'Phase 9', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
  ],
};

// ── DEMO filing — 5 of 9 phases pre-filled ──────────────────────────────────
const DEMO_MOCK_FILING: Filing = {
  id: 'FL-2026-ABC-01',
  companyName: 'TechNova Solutions Ltd',
  cin: 'U72900MH2024PTC123456',
  gstin: '27AAACT1234F1Z5',
  sector: 'Technology & AI Solutions',
  targetIssueSize: '₹28.5 Cr',
  completionPercent: 56,
  overallStatus: 'DRAFT_IN_PROGRESS',
  sections: [
    {
      key: 'CH_01',
      title: 'Cover Page & General Information',
      chapter: 'Phase 1',
      status: 'CLEARED',
      completionPercent: 100,
      aiDraftText: '',
      certified: true,
      flags: [],
      inputs: {
        companyName: 'TechNova Solutions Limited',
        cin: 'U72900MH2024PTC123456',
        incorporationDetails: 'January 14, 2024 in Pune, Maharashtra',
        registeredOffice: 'Plot No. 42, Tech Park Phase II, MIDC Chakan, Pune – 411057',
        contactEmail: 'compliance@technova.ai | www.technova.ai',
        businessSector: 'Technology & Enterprise AI Solutions',
        leadManager: 'Choice Capital Advisors Pvt Ltd (SEBI Reg: INM000012345)',
        registrarName: 'Link Intime India Private Limited',
        auditorName: 'M/s. Mehta & Associates, CA (FRN: 106234W)',
        peerReviewAuditor: 'Peer Review Certificate No. 014920 valid till March 2027',
        stockExchange: 'NSE Emerge (SME Platform)',
        offerType: '100% Fresh Issue of Equity Shares',
        issueSizeCr: '28.50',
        faceValue: '10',
      },
    },
    {
      key: 'CH_02',
      title: 'Industry & Business Overview',
      chapter: 'Phase 2',
      status: 'CLEARED',
      completionPercent: 100,
      aiDraftText: '',
      certified: true,
      flags: [],
      inputs: {
        industrySector: 'Enterprise AI, Cloud SaaS & Automated Telemetry',
        coreProducts: 'Automated Telemetry (54%), GPU Compute (32%), SaaS (14%)',
        topCustomersShare: '41.2',
        customerConcentration: 'Top client accounts for 22.4%; average relationship tenure 4.5 years',
        facilitiesLocation: '16,000 sq.ft facility at Chakan, Pune with 16x H100 GPU nodes',
        employeeCount: '142 permanent software engineers and AI research scientists',
        dsoDays: '78',
        patentDetails: '2 Patents filed (No. 202421098765) + 4 Registered Trademarks',
        competitiveStrengths: 'Proprietary model architecture, low-latency telemetry, 99.9% SLA',
        growthStrategy: 'Expand enterprise SaaS sales to BFSI clients in UAE and Singapore',
        vendorDependence: 'Cloud infrastructure hosted on AWS & Yotta Data Services',
        computeCapacity: '1.2 Petaflops AI compute cluster capacity',
        exportRevenueShare: '18.5',
        esgPolicy: 'ISO 27001 Cybersecurity & SOC2 Type II compliance',
      },
    },
    {
      key: 'CH_03',
      title: 'Capital Structure & Shareholding',
      chapter: 'Phase 3',
      status: 'CLEARED',
      completionPercent: 100,
      aiDraftText: '',
      certified: true,
      flags: [],
      inputs: {
        authorizedCapital: '1000.00 (1,00,00,000 Equity Shares of ₹10)',
        paidUpCapitalPre: '680.00 (68,00,000 Equity Shares)',
        promoterShareholdingPre: '84.50',
        promoterGroupHolding: '7.20',
        nonPromoterHolders: '3 institutional angel investors holding 8.30%',
        bonusHistory: 'Bonus issue of 4:1 executed on November 20, 2024',
        recentAllotmentPrice: '₹65 per equity share allotted to VC fund on Dec 2024',
        esopDetails: '2,50,000 ESOP options granted under TechNova ESOP Scheme 2024',
        promoterLockIn: '20% post-issue capital locked-in for 3 years; balance for 1 year',
        pledgedShares: 'Nil — Zero promoter equity shares pledged',
      },
    },
    {
      key: 'CH_04',
      title: 'Management & Corporate Governance',
      chapter: 'Phase 4',
      status: 'AI_DRAFT_READY',
      completionPercent: 78,
      aiDraftText: '',
      certified: false,
      flags: [],
      inputs: {
        cmdName: 'Mr. Rajesh Sharma (DIN: 08912345)',
        execDirectorsCount: '2 Executive Directors with 18+ years average domain experience',
        independentDirectors: '3 Independent Directors (50% of Board) including 1 Woman Director',
        keyKMPs: 'CFO: Mr. Vikram Mehta (CA); CS: Ms. Ananya Deshmukh (FCS)',
        auditCommittee: 'Chaired by Independent Director Mr. Suresh Rao (Ex-SEBI Officer)',
        nominationCommittee: '3 Non-Executive Independent Directors',
        stakeholderCommittee: 'Formed per SEBI ICDR regulations for SME issuers',
        directorRemuneration: '48.00',
        governanceStatement: 'Fully compliant with Companies Act 2013 and SEBI LODR 2015',
        relatedPartyMgmt: 'Office premise lease agreement with Promoter at market rate (₹1.2L/mo)',
      },
    },
    {
      key: 'CH_05',
      title: 'Financial Information & Restatements',
      chapter: 'Phase 5',
      status: 'AI_DRAFT_READY',
      completionPercent: 88,
      aiDraftText: '',
      certified: false,
      flags: [],
      inputs: {
        revenueFY25: '48.20',
        revenueFY24: '34.10',
        revenueFY23: '22.80',
        ebitdaMargin: '23.6',
        patFY25: '7.45',
        ronwPercent: '24.8',
        navPerShare: '44.12',
        totalDebtCr: '6.80',
        debtToEquity: '0.23',
        workingCapitalCr: '11.40',
        cashBalances: '3.25',
        contingentLiabilities: '0.185 (Income Tax Dispute under appeal)',
        auditorQualifications: 'Unqualified clean audit opinion issued by Statutory Auditor',
        capexHistory: '14.60 Crores in GPU compute infrastructure over last 3 FYs',
      },
    },
    // Phases 6–9: Empty for demo user
    { key: 'RISK_FACTORS', title: 'Risk Factors & Material Disclosures', chapter: 'Phase 6', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_07', title: 'Legal & Outstanding Litigation', chapter: 'Phase 7', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_08', title: 'Regulatory & Compliance Disclosures', chapter: 'Phase 8', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
    { key: 'CH_04_OBJ', title: 'Objects of the Issue — Detailed Utilisation', chapter: 'Phase 9', status: 'IN_PROGRESS', completionPercent: 0, aiDraftText: '', certified: false, flags: [], inputs: {} },
  ],
};

// Session storage keys for route persistence
const SESSION_APP_MODE_KEY = 'piq_app_mode';
const SESSION_WB_ROUTE_KEY = 'piq_wb_route';

export function App() {
  // Restore appMode from sessionStorage on refresh
  const [appMode, setAppMode] = useState<AppMode>(() => {
    const saved = sessionStorage.getItem(SESSION_APP_MODE_KEY) as AppMode | null;
    return saved || 'PUBLIC_SITE';
  });
  const [workbenchRoute, setWorkbenchRoute] = useState<WorkbenchRoute>(() => {
    const saved = sessionStorage.getItem(SESSION_WB_ROUTE_KEY) as WorkbenchRoute | null;
    return saved || 'dashboard';
  });
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [filing, setFiling] = useState<Filing>(DEMO_MOCK_FILING);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLeftPaneOpen, setIsLeftPaneOpen] = useState(true);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(true);

  // Global UI state
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    setActiveToast({ id: Date.now().toString(), title, message, type });
  }, []);

  const handleExportPDF = () => {
    showToast('Exporting SEBI Package', 'Compiling 18-chapter DRHP + Compliance Certificate…', 'info');
    setTimeout(() => window.print(), 600);
  };

  // Persist appMode to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_APP_MODE_KEY, appMode);
  }, [appMode]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_WB_ROUTE_KEY, workbenchRoute);
  }, [workbenchRoute]);

  const changeMode = (mode: AppMode) => {
    setAppMode(mode);
    sessionStorage.setItem(SESSION_APP_MODE_KEY, mode);
  };

  const fetchFilingData = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const data = await ProspectusIQApi.getActiveFiling('FL-2026-ABC-01');
      if (data && data.sections && data.sections.length > 0) {
        setFiling(data);
      }
      // If API returns nothing, keep the user-role-appropriate filing
    } catch (err: any) {
      console.warn('Backend API fetch error, using mock filing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (user: LoggedInUser) => {
    setCurrentUser(user);
    const nextMode: AppMode = user.role === 'PROMOTER' ? 'PROMOTER' : 'WORKBENCH';

    // Demo user (the only account) gets pre-filled demo data.
    // A new/different user would get EMPTY_MOCK_FILING.
    // Here we use email to decide — the demo email gets the demo filing.
    const isDemoUser = user.email === 'techmister23@gmail.com';
    setFiling(isDemoUser ? DEMO_MOCK_FILING : EMPTY_MOCK_FILING);

    changeMode(nextMode);
    await fetchFilingData();
  };

  const handleLogout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setFiling(DEMO_MOCK_FILING);
    changeMode('PUBLIC_SITE');
    sessionStorage.removeItem(SESSION_APP_MODE_KEY);
    sessionStorage.removeItem(SESSION_WB_ROUTE_KEY);
  };

  const handleUpdateSection = (updatedSection: SectionData) => {
    if (!filing) return;
    const updatedSections = filing.sections.map((s) =>
      s.key === updatedSection.key ? updatedSection : s
    );
    const clearedCount = updatedSections.filter((s) => s.status === 'CLEARED').length;
    const newPercent = Math.round((clearedCount / updatedSections.length) * 100);
    setFiling({ ...filing, sections: updatedSections, completionPercent: newPercent });
  };

  const handleExecuteCertification = async () => {
    if (!filing) return;
    try {
      await ProspectusIQApi.certifyFiling(filing.id, 'LEGAL_COUNSEL');
    } catch (e) {}
    const certifiedSections = filing.sections.map((s) => ({
      ...s,
      certified: true,
      certifiedBy: currentUser?.fullName || 'Lead Counsel',
      certifiedAt: new Date().toISOString(),
    }));
    setFiling({ ...filing, sections: certifiedSections, completionPercent: 100, overallStatus: 'CERTIFIED_SEALED' });
  };

  // ── PUBLIC LANDING ───────────────────────────────────────────────────────
  if (appMode === 'PUBLIC_SITE') {
    return (
      <PublicLandingView
        onOpenWorkbench={() => changeMode('LOGIN')}
      />
    );
  }

  // ── LOGIN PAGE ───────────────────────────────────────────────────────────
  if (appMode === 'LOGIN') {
    return (
      <LoginView
        onLogin={handleLogin}
        onBackToHome={() => changeMode('PUBLIC_SITE')}
      />
    );
  }

  // ── GLOBAL OVERLAYS (Drawers + Toast) ────────────────────────────────────
  const globalOverlays = (
    <>
      <style>{PRINT_STYLE}</style>
      <div className="print-watermark">{filing?.companyName || 'ProspectusIQ'}</div>
      <GlobalDrawers
        isMessagingOpen={isMessagingOpen}
        isAuditOpen={isAuditOpen}
        onCloseMessaging={() => setIsMessagingOpen(false)}
        onCloseAudit={() => setIsAuditOpen(false)}
      />
      <NotificationToast toast={activeToast} onClose={() => setActiveToast(null)} />
    </>
  );

  // ── PROMOTER PORTAL ──────────────────────────────────────────────────────
  if (appMode === 'PROMOTER') {
    if (isLoading) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-warm-ivory)', padding: '64px', maxWidth: '800px', margin: '0 auto' }}>
          <LoadingSkeleton count={6} />
        </div>
      );
    }
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-warm-ivory)', animation: 'fadeIn 0.25s ease forwards' }}>
        {globalOverlays}
        {/* Promoter Header */}
        <header className="no-print" style={{
          backgroundColor: 'var(--color-primary-charcoal)',
          borderBottom: '1px solid #292C33',
          padding: '0 32px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-deep-forest)', border: '1px solid #34845F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>P</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#fff' }}>
              Prospectus<span style={{ color: 'var(--color-antique-gold)' }}>IQ</span>
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginLeft: '6px', borderLeft: '1px solid #3A3D45', paddingLeft: '10px' }}>
              Promoter Portal
            </span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Promoter header action buttons */}
            {[{ label: '💬 Messages', onClick: () => setIsMessagingOpen(true) },
              { label: '📜 Audit Log', onClick: () => setIsAuditOpen(true) },
              { label: '🖨️ Export PDF', onClick: handleExportPDF },
            ].map(({ label, onClick }) => (
              <button key={label} onClick={onClick} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #4B5563', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>{label}</button>
            ))}
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Welcome, <strong style={{ color: '#E5E7EB' }}>{currentUser?.fullName}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #4B5563', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: '12px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </header>
        <PromoterPortalView
          filing={filing}
          onUpdateSection={handleUpdateSection}
          onSwitchToWorkbench={() => changeMode('WORKBENCH')}
          onToast={showToast}
        />
      </div>
    );
  }

  // ── INTERMEDIARY WORKBENCH ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-warm-ivory)', animation: 'fadeIn 0.25s ease forwards' }}>
      {globalOverlays}
      <div className="no-print">
        <WorkbenchHeader
          currentRoute={workbenchRoute}
          onNavigate={(route) => {
            setWorkbenchRoute(route);
            sessionStorage.setItem(SESSION_WB_ROUTE_KEY, route);
          }}
          onGoHome={handleLogout}
          onOpenPublicSite={() => changeMode('PUBLIC_SITE')}
          onLogout={handleLogout}
          issuerName={filing?.companyName || 'Loading...'}
          listingTarget="NSE Emerge"
          draftVersion="DRHP v12"
          workflowStage="Legal Review"
          completionPercent={filing?.completionPercent || 0}
          currentReviewer={currentUser?.fullName || 'Intermediary'}
          isLeftPaneOpen={isLeftPaneOpen}
          isRightPaneOpen={isRightPaneOpen}
          onToggleLeftPane={() => setIsLeftPaneOpen(!isLeftPaneOpen)}
          onToggleRightPane={() => setIsRightPaneOpen(!isRightPaneOpen)}
          onOpenMessaging={() => setIsMessagingOpen(true)}
          onOpenAudit={() => setIsAuditOpen(true)}
          onExportPDF={handleExportPDF}
        />
      </div>

      {isLoading ? (
        <div style={{ padding: '64px', maxWidth: '800px', margin: '0 auto' }}>
          <LoadingSkeleton count={6} />
        </div>
      ) : apiError && !filing ? (
        <div style={{ padding: '64px', maxWidth: '700px', margin: '0 auto' }}>
          <ErrorState title="Backend Service Offline" message={apiError} onRetry={fetchFilingData} />
        </div>
      ) : filing ? (
        <>
          {workbenchRoute === 'dashboard' && (
            <WorkbenchDashboardView
              filing={filing}
              onNavigateToEditor={() => setWorkbenchRoute('editor')}
            />
          )}
          {workbenchRoute === 'intake' && <WorkbenchIntakeView filing={filing} />}
          {workbenchRoute === 'editor' && (
            <WorkbenchEditorView
              filing={filing}
              isLeftPaneOpen={isLeftPaneOpen}
              isRightPaneOpen={isRightPaneOpen}
              onUpdateSection={handleUpdateSection}
            />
          )}
          {workbenchRoute === 'rules' && <WorkbenchRulesView filing={filing} />}
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
