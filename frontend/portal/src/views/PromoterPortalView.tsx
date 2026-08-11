import React, { useState } from 'react';
import { Filing, SectionData } from '../types';
import { PhaseDraftingForm } from '../components/promoter/PhaseDraftingForm';
import { PhaseNotepad } from '../components/promoter/PhaseNotepad';
import { AIDraftPreview } from '../components/promoter/AIDraftPreview';
import { PhaseVerifierPanel } from '../components/promoter/PhaseVerifierPanel';
import { PhaseSubmitPanel } from '../components/promoter/PhaseSubmitPanel';
import { FinancialsVizPanel } from '../components/promoter/FinancialsVizPanel';
import {
  CheckCircle2,
  Send,
  Sparkles,
  FormInput,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  FileText,
  LineChart,
} from 'lucide-react';

interface PromoterPortalViewProps {
  filing: Filing;
  onUpdateSection: (updatedSection: SectionData) => void;
  onSwitchToWorkbench: () => void;
  onToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export type PromoterStep = 'DRAFTING' | 'NOTEPAD' | 'GENERATOR' | 'VERIFIER' | 'SUBMIT';

export const PromoterPortalView: React.FC<PromoterPortalViewProps> = ({
  filing,
  onUpdateSection,
  onSwitchToWorkbench,
  onToast,
}) => {
  // Navigation mode: 'LANDING_DASHBOARD' | 'PHASE_EDITOR' | 'FINANCIALS_ANALYTICS'
  const [viewMode, setViewMode] = useState<'LANDING_DASHBOARD' | 'PHASE_EDITOR' | 'FINANCIALS_ANALYTICS'>('LANDING_DASHBOARD');
  const [activeSectionKey, setActiveSectionKey] = useState<string>('CH_02'); // Default to Phase 2
  const [activeStep, setActiveStep] = useState<PromoterStep>('DRAFTING');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const fallbackSection: SectionData = {
    key: 'CH_02',
    title: 'Industry & Business Overview',
    chapter: 'Phase 2',
    status: 'AI_DRAFT_READY',
    completionPercent: 72,
    aiDraftText: '',
    flags: [],
    certified: false,
  };

  const activeSection = filing && filing.sections && filing.sections.length > 0
    ? filing.sections.find((s) => s.key === activeSectionKey) || filing.sections[0]
    : fallbackSection;

  const clearedPhasesCount = filing.sections.filter((s) => s.status === 'CLEARED').length;
  const inProgressPhasesCount = filing.sections.filter((s) => s.status === 'AI_DRAFT_READY' || s.status === 'IN_PROGRESS').length;
  const pendingInputCount = filing.sections.length - clearedPhasesCount - inProgressPhasesCount;
  const totalPhases = filing.sections.length;
  const progressPercent = Math.round((clearedPhasesCount / totalPhases) * 100);

  const handleSaveInputs = (inputs: Record<string, string | number>) => {
    setIsDrafting(true);
    setTimeout(() => {
      setIsDrafting(false);
      const updated: SectionData = {
        ...activeSection,
        status: 'IN_PROGRESS',
        inputs: {
          ...(activeSection.inputs || {}),
          ...inputs,
        },
      };
      onUpdateSection(updated);
      setActiveStep('NOTEPAD');
    }, 600);
  };

  const handleSaveNotes = (rawNotes: string) => {
    const updated: SectionData = {
      ...activeSection,
      inputs: {
        ...(activeSection.inputs || {}),
        rawNotes,
      },
    };
    onUpdateSection(updated);
    setActiveStep('GENERATOR');
  };

  const handleUpdateDraftText = (newDraftText: string) => {
    const updated: SectionData = {
      ...activeSection,
      aiDraftText: newDraftText,
      humanRedlineText: newDraftText,
      status: 'AI_DRAFT_READY',
      completionPercent: Math.max(activeSection.completionPercent, 80),
    };
    onUpdateSection(updated);
  };

  const handleMarkCleared = () => {
    const updated: SectionData = {
      ...activeSection,
      status: 'CLEARED',
      completionPercent: 100,
    };
    onUpdateSection(updated);
    setActiveStep('SUBMIT');
  };

  const launchPhaseEditor = (key: string, defaultStep: PromoterStep = 'DRAFTING') => {
    setActiveSectionKey(key);
    setActiveStep(defaultStep);
    setViewMode('PHASE_EDITOR');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px)', backgroundColor: '#0D1421', color: '#F5F5F4' }}>
      
      {/* ── TOP HEADER / NAVIGATION & PROGRESS BAR ── */}
      <div
        style={{
          backgroundColor: '#111827',
          borderBottom: '1px solid #1E2D45',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Dashboard Status Button */}
          <button
            onClick={() => setViewMode('LANDING_DASHBOARD')}
            style={{
              padding: '8px 14px',
              borderRadius: '9px',
              border: '1px solid #57534E',
              backgroundColor: viewMode === 'LANDING_DASHBOARD' ? '#F97316' : '#172035',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <LayoutDashboard size={15} /> Dashboard Status
          </button>

          {/* Phase Editor Button */}
          <button
            onClick={() => setViewMode('PHASE_EDITOR')}
            style={{
              padding: '8px 14px',
              borderRadius: '9px',
              border: '1px solid #57534E',
              backgroundColor: viewMode === 'PHASE_EDITOR' ? '#F97316' : '#172035',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <FileText size={15} /> Phase Workspace
          </button>

          {/* Financial Analytics Button */}
          <button
            onClick={() => setViewMode('FINANCIALS_ANALYTICS')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              border: '1px solid #F97316',
              backgroundColor: viewMode === 'FINANCIALS_ANALYTICS' ? '#F97316' : 'rgba(249,115,22,0.12)',
              color: viewMode === 'FINANCIALS_ANALYTICS' ? '#FFFFFF' : '#F97316',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <LineChart size={15} /> Financial Analytics
          </button>

          {viewMode === 'PHASE_EDITOR' && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                padding: '8px 12px',
                borderRadius: '9px',
                border: '1px solid #253550',
                backgroundColor: '#131C2E',
                color: '#D6D3D1',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Minimise Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isSidebarCollapsed ? 'Show Phases' : 'Minimise'}
              </span>
            </button>
          )}

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)' }}>
              DRHP Filing Status: {clearedPhasesCount} of {totalPhases} Phases Cleared
            </div>
            <div style={{ fontSize: '11px', color: '#A8A29E' }}>
              TechNova Solutions Ltd · SEBI ICDR SME Portal
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, maxWidth: '460px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '12px', backgroundColor: '#172035', borderRadius: '6px', overflow: 'hidden', padding: '2px', border: '1px solid #253550' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
                borderRadius: '4px',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 12px rgba(249,115,22,0.6)',
              }}
            />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)' }}>
            {progressPercent}%
          </span>
        </div>

        {/* Submit to Intermediary CTA */}
        <button
          onClick={onSwitchToWorkbench}
          style={{
            padding: '11px 22px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
          }}
        >
          <Send size={14} /> Submit to Intermediary
        </button>
      </div>

      {/* ── FINANCIALS ANALYTICS VIEW ── */}
      {viewMode === 'FINANCIALS_ANALYTICS' && (
        <div style={{ flex: 1, padding: '36px 44px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <FinancialsVizPanel />
        </div>
      )}

      {/* ── LANDING DASHBOARD VIEW ── */}
      {viewMode === 'LANDING_DASHBOARD' && (
        <div style={{ flex: 1, padding: '36px 44px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          
          {/* Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #131C2E 0%, #172035 100%)',
              border: '1px solid #253550',
              borderRadius: '20px',
              padding: '32px 36px',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                SME Promoter Filing Dashboard
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', margin: 0 }}>
                TechNova Solutions Limited — DRHP Status Overview
              </h1>
              <p style={{ fontSize: '14px', color: '#A8A29E', marginTop: '8px', maxWidth: '640px', lineHeight: '1.6' }}>
                Track live compliance clearance across all 9 DRHP phases. Click any phase below to open its 5-step workspace: Drafting Form, Notepad, AI Generator, SEBI Verifier, and Submit.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                onClick={() => setViewMode('FINANCIALS_ANALYTICS')}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '1px solid #F97316',
                  backgroundColor: 'rgba(249,115,22,0.1)',
                  color: '#FAFAF9',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LineChart size={18} color="#F97316" /> View Financial Analytics
              </button>
              <button
                onClick={() => launchPhaseEditor('CH_02', 'DRAFTING')}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
                }}
              >
                Launch Phase Editor <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
            <div style={{ backgroundColor: '#131C2E', border: '1px solid #1E2D45', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#A8A29E', fontSize: '12px', fontWeight: 700 }}>
                TOTAL DRHP PHASES <FileText size={16} color="#F97316" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FAFAF9', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
                9 Phases
              </div>
              <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '4px' }}>SEBI ICDR Framework</div>
            </div>

            <div style={{ backgroundColor: '#131C2E', border: '1px solid #047857', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34D399', fontSize: '12px', fontWeight: 700 }}>
                CLEARED PHASES <CheckCircle size={16} color="#34D399" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#34D399', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
                {clearedPhasesCount} / 9
              </div>
              <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '4px' }}>Verified &amp; Cleared</div>
            </div>

            <div style={{ backgroundColor: '#131C2E', border: '1px solid #F97316', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#F97316', fontSize: '12px', fontWeight: 700 }}>
                AI DRAFTED / READY <Clock size={16} color="#F97316" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#F97316', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
                {inProgressPhasesCount} Phase
              </div>
              <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '4px' }}>Phase 2 Draft Ready</div>
            </div>

            <div style={{ backgroundColor: '#131C2E', border: '1px solid #57534E', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#A8A29E', fontSize: '12px', fontWeight: 700 }}>
                PENDING INPUT <AlertCircle size={16} color="#A8A29E" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#D6D3D1', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
                {pendingInputCount} Phases
              </div>
              <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '4px' }}>Requires Form Input</div>
            </div>
          </div>

          {/* 9 Phases Grid Overview */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FAFAF9', margin: 0 }}>
                Phase-by-Phase Compliance Tracker
              </h3>
              <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 600 }}>
                💡 Click any phase card below to open its 5-step workspace
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {filing.sections.map((sec, idx) => {
                const phaseNum = idx + 1;
                const isCleared = sec.status === 'CLEARED';
                const isAiReady = sec.status === 'AI_DRAFT_READY';

                return (
                  <div
                    key={sec.key}
                    onClick={() => launchPhaseEditor(sec.key, 'DRAFTING')}
                    style={{
                      backgroundColor: '#131C2E',
                      border: `1.5px solid ${isCleared ? '#047857' : isAiReady ? '#F97316' : '#1E2D45'}`,
                      borderRadius: '16px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#F97316';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.25)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = isCleared ? '#047857' : isAiReady ? '#F97316' : '#1E2D45';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          PHASE {phaseNum}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            backgroundColor: isCleared ? 'rgba(52,211,153,0.12)' : isAiReady ? 'rgba(249,115,22,0.12)' : '#172035',
                            color: isCleared ? '#34D399' : isAiReady ? '#F97316' : '#A8A29E',
                            border: `1px solid ${isCleared ? 'rgba(52,211,153,0.3)' : isAiReady ? 'rgba(249,115,22,0.3)' : '#253550'}`,
                          }}
                        >
                          {isCleared ? 'CLEARED' : isAiReady ? 'AI DRAFT READY' : 'EMPTY / PENDING'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF9', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                        {sec.title}
                      </h4>

                      <p style={{ fontSize: '12px', color: '#A8A29E', lineHeight: '1.6', margin: 0 }}>
                        {sec.aiDraftText ? `${sec.aiDraftText.substring(0, 110)}...` : 'Editor empty. Click to enter statutory form inputs and generate 2x DRHP draft.'}
                      </p>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #172035', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#D6D3D1', fontFamily: 'var(--font-mono)' }}>
                        {sec.completionPercent}% Complete
                      </span>

                      <div
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          backgroundColor: isAiReady ? '#F97316' : '#172035',
                          color: isAiReady ? '#FFFFFF' : '#F97316',
                          border: '1px solid #F97316',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Open Phase <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE EDITOR WORKSPACE ── */}
      {viewMode === 'PHASE_EDITOR' && (
        <div style={{ display: 'flex', flex: 1 }}>
          
          {/* Left Collapsible Navigation Sidebar */}
          <aside
            style={{
              width: isSidebarCollapsed ? '64px' : '280px',
              background: 'linear-gradient(180deg, #0E1A2E 0%, #0A1120 100%)',
              borderRight: '1px solid #1E2D45',
              padding: isSidebarCollapsed ? '16px 8px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'width 0.25s ease',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div>
              {!isSidebarCollapsed && (
                <>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                    DRHP Workflow Phases
                  </div>
                  <div style={{ fontSize: '11px', color: '#A8A29E', marginBottom: '14px' }}>
                    Select phase to input, draft, or verify
                  </div>
                </>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filing.sections.map((sec, idx) => {
                  const isActive = sec.key === activeSectionKey;
                  const isComplete = sec.status === 'CLEARED';
                  const phaseNum = idx + 1;

                  return (
                    <button
                      key={sec.key}
                      onClick={() => setActiveSectionKey(sec.key)}
                      title={`Phase ${phaseNum}: ${sec.title}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                        padding: isSidebarCollapsed ? '10px 0' : '10px 12px',
                        borderRadius: '10px',
                        border: isActive ? '1px solid #F97316' : '1px solid transparent',
                        backgroundColor: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isComplete
                              ? 'linear-gradient(135deg, #047857, #34D399)'
                              : isActive
                              ? 'linear-gradient(135deg, #F97316, #FB923C)'
                              : '#172035',
                            boxShadow: isActive ? '0 2px 8px rgba(249,115,22,0.4)' : 'none',
                          }}
                        >
                          {isComplete ? (
                            <CheckCircle2 size={14} color="#fff" />
                          ) : (
                            <span style={{ fontSize: '11px', fontWeight: 800, color: isActive ? '#fff' : '#A8A29E' }}>{phaseNum}</span>
                          )}
                        </div>
                        {!isSidebarCollapsed && (
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? '#F97316' : '#FAFAF9', lineHeight: '1.3' }}>
                              {sec.title}
                            </div>
                            <div style={{ fontSize: '10px', color: '#A8A29E' }}>Phase {phaseNum}</div>
                          </div>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: isComplete ? '#34D399' : isActive ? '#F97316' : '#78716C', fontFamily: 'var(--font-mono)' }}>
                          {sec.completionPercent}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {!isSidebarCollapsed && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #1E2D45' }}>
                <button
                  onClick={onSwitchToWorkbench}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '9px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 10px rgba(249,115,22,0.3)',
                  }}
                >
                  <Send size={13} /> Submit All Phases
                </button>
              </div>
            )}
          </aside>

          {/* Main Workspace Area */}
          <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', backgroundColor: '#0D1421' }}>
            
            {/* Top Phase Header & 5-Step Tool Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Phase {filing.sections.findIndex((s) => s.key === activeSection.key) + 1}: {activeSection.title}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FAFAF9', margin: '2px 0 0 0' }}>
                  SME Promoter Phase Workspace &amp; Drafting
                </h2>
              </div>

              {/* 5 SEQUENTIAL STEP TABS */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#111827',
                  padding: '6px',
                  borderRadius: '14px',
                  border: '1px solid #1E2D45',
                  overflowX: 'auto',
                }}
              >
                {[
                  { id: 'DRAFTING', icon: <FormInput size={14} />, label: '1. Drafting' },
                  { id: 'NOTEPAD', icon: <FileText size={14} />, label: '2. Notepad' },
                  { id: 'GENERATOR', icon: <Sparkles size={14} />, label: '3. Generator' },
                  { id: 'VERIFIER', icon: <ShieldCheck size={14} />, label: '4. Verifier' },
                  { id: 'SUBMIT', icon: <Send size={14} />, label: '5. Submit' },
                ].map((tab) => {
                  const isSelected = activeStep === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStep(tab.id as PromoterStep)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#F97316' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#A8A29E',
                        boxShadow: isSelected ? '0 2px 10px rgba(249,115,22,0.4)' : 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Drafting Form (10-20 phase-relevant questions) */}
            {activeStep === 'DRAFTING' && (
              <PhaseDraftingForm
                section={activeSection}
                onSaveInputs={handleSaveInputs}
                isDrafting={isDrafting}
              />
            )}

            {/* Step 2: Notepad */}
            {activeStep === 'NOTEPAD' && (
              <PhaseNotepad
                section={activeSection}
                onSaveNotes={handleSaveNotes}
                onToast={onToast}
              />
            )}

            {/* Step 3: AI Generator & Editor (Blank default editor & 2x length prose) */}
            {activeStep === 'GENERATOR' && (
              <AIDraftPreview
                section={activeSection}
                onUpdateDraftText={handleUpdateDraftText}
              />
            )}

            {/* Step 4: SEBI Verifier & Review (Dedicated Verify button & audit report) */}
            {activeStep === 'VERIFIER' && (
              <PhaseVerifierPanel
                section={activeSection}
                onMarkCleared={handleMarkCleared}
              />
            )}

            {/* Step 5: Submit Phase */}
            {activeStep === 'SUBMIT' && (
              <PhaseSubmitPanel
                section={activeSection}
                onClearAndSubmit={handleMarkCleared}
                onSwitchToWorkbench={onSwitchToWorkbench}
              />
            )}

          </main>
        </div>
      )}

    </div>
  );
};
