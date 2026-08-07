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
    <div style={{ backgroundColor: 'var(--color-warm-ivory)', minHeight: '100vh' }}>
      <PublicHeader onOpenWorkbench={onOpenWorkbench} />
      <HeroSection onOpenWorkbench={onOpenWorkbench} />
      <WorkflowPipeline />
      <LLMRiskMatrix />
      <AssuranceArchitecture />
      <EvidenceInterfacePreview />
      <GovernanceSection />

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--color-primary-charcoal)',
        color: 'var(--color-secondary-text)',
        padding: '32px',
        textAlign: 'center',
        fontSize: '12px',
        borderTop: '1px solid #292C33'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            ProspectusIQ — Institutional Compliance Drafting & Audit Platform
          </div>
          <div>
            Aligned with applicable SEBI disclosure guidelines (ICDR Regulations)
          </div>
        </div>
      </footer>
    </div>
  );
};
