import React from 'react';
import { CertificationReadinessView } from '../components/certification/CertificationReadinessView';
import { Filing } from '../types';

interface WorkbenchCertificationViewProps {
  filing: Filing;
  onExecuteCertification: () => void;
}

export const WorkbenchCertificationView: React.FC<WorkbenchCertificationViewProps> = ({
  filing,
  onExecuteCertification
}) => {
  const blockerCount = filing.sections.flatMap((s) => s.flags).filter((f) => f.severity === 'CRITICAL' && f.status === 'OPEN').length;
  const isCertified = filing.overallStatus === 'CERTIFIED_SEALED';

  return (
    <div style={{ padding: '32px' }}>
      <CertificationReadinessView
        readinessPercent={filing.completionPercent}
        blockerCount={blockerCount}
        warningCount={2}
        documentHash="8b3c912a4e98210984712409852f312"
        version="DRHP v12"
        isCertified={isCertified}
        onExecuteCertification={onExecuteCertification}
      />
    </div>
  );
};
