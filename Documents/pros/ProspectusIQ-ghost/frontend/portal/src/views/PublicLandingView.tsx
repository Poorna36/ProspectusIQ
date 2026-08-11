import React from 'react';
import { PublicHeader } from '../components/public/PublicHeader';
import { HeroSection } from '../components/public/HeroSection';
import { WorkflowPipeline } from '../components/public/WorkflowPipeline';
import { LLMRiskMatrix } from '../components/public/LLMRiskMatrix';
import { AssuranceArchitecture } from '../components/public/AssuranceArchitecture';
import { EvidenceInterfacePreview } from '../components/public/EvidenceInterfacePreview';
import { GovernanceSection } from '../components/public/GovernanceSection';

interface PublicLandingViewProps {
  onOpenWorkbench: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onOpenWorkbench }) => {
  return (
    <div style={{ backgroundColor: 'var(--color-dark-base)', minHeight: '100vh' }}>
      <PublicHeader onOpenWorkbench={onOpenWorkbench} />
      <HeroSection onOpenWorkbench={onOpenWorkbench} />
      <WorkflowPipeline />
      <LLMRiskMatrix />
      <AssuranceArchitecture />
      <EvidenceInterfacePreview />
      <GovernanceSection />

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0A0C0F',
        color: '#4B5563',
        padding: '32px 48px',
        textAlign: 'center',
        fontSize: '12px',
        borderTop: '1px solid #1E2028',
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.5)' }} />
            <span>ProspectusIQ — Institutional Compliance Drafting &amp; Audit Platform</span>
          </div>
          <div>Aligned with SEBI ICDR Regulations, 2018 (as amended)</div>
        </div>
      </footer>
    </div>
  );
};
