import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, UserCheck } from 'lucide-react';

interface NodeData {
  id: number;
  label: string;
  title: string;
  detail: string;
  badge: 'source' | 'ai' | 'passed' | 'approved';
  provenanceData: {
    sourceDoc: string;
    extractedValue: string;
    ruleId: string;
    reviewer: string;
    statusText: string;
    rawLocation: string;
  };
}

export const ProvenanceNetworkCanvas: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<number>(3); // Default focused on Node 03
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const nodesList: NodeData[] = [
    {
      id: 1,
      label: '01  SOURCE DOCUMENT',
      title: 'Audited Financial Statements',
      detail: 'Note 18 · Page 74 · Cell F17',
      badge: 'source',
      provenanceData: {
        sourceDoc: 'Audited AOC-4 Statement (FY 2025–26)',
        extractedValue: '₹1,709.88 Lakhs (61.4004%)',
        ruleId: 'SRC-VAL-01 (OCR Match 99.4%)',
        reviewer: 'Rajesh Mehta (Statutory Auditor)',
        statusText: 'Fact Extracted from Verified Audit PDF',
        rawLocation: 'Sheet 2 · Table 4 · Row 14 · Cell F17'
      }
    },
    {
      id: 2,
      label: '02  EXTRACTED FACT',
      title: '61.4% Revenue Share',
      detail: 'FY25–26 Restated AOC-4',
      badge: 'source',
      provenanceData: {
        sourceDoc: 'Management Restated Summary Sheet',
        extractedValue: '61.4% Top 5 Enterprise Concentration',
        ruleId: 'ENT-EVAL-02 (Data Reconciled)',
        reviewer: 'Automated Intake Pipeline',
        statusText: 'Matched with Restated Financial Summary',
        rawLocation: 'Annexure B · Financial Ratio Table'
      }
    },
    {
      id: 3,
      label: '03  DISCLOSURE CLAIM',
      title: 'Customer Concentration',
      detail: 'DRHP Clause 3.4.1',
      badge: 'ai',
      provenanceData: {
        sourceDoc: 'DRHP Draft v12 (Risk Factors)',
        extractedValue: 'Clause 3.4.1 Disclosure Text',
        ruleId: 'ICDR-SCH6-RF (Clause Present)',
        reviewer: 'Priya Shah (Lead Counsel)',
        statusText: 'Claim Formatted Aligned with SEBI Norms',
        rawLocation: 'Section 3.4 · Paragraph 1 · Page 42'
      }
    },
    {
      id: 4,
      label: '04  DETERMINISTIC CHECK',
      title: 'Rule SME-DISC-014',
      detail: '● Requirement satisfied',
      badge: 'passed',
      provenanceData: {
        sourceDoc: 'SEBI ICDR Regulations 2018 (Schedule VI)',
        extractedValue: 'Threshold Check (>40% Concentration)',
        ruleId: 'SME-DISC-014 (Passed)',
        reviewer: 'Deterministic Rules Engine',
        statusText: 'Mandatory Disclosure Condition Satisfied',
        rawLocation: 'Rule Rulebook Registry v2026.1'
      }
    },
    {
      id: 5,
      label: '05  HUMAN APPROVAL',
      title: 'Lead Counsel Clearance',
      detail: '✓ Verified by Priya Shah',
      badge: 'approved',
      provenanceData: {
        sourceDoc: 'Intermediary Sign-off Register',
        extractedValue: 'Redline Edit & Sign-off Approved',
        ruleId: 'HUMAN-SEAL-99',
        reviewer: 'Priya Shah (Lead Counsel)',
        statusText: 'Digital Signature Sealed on DRHP v12',
        rawLocation: 'Immutable Audit Trail Ledger #8b3c91'
      }
    }
  ];

  const activeNodeData = nodesList.find(n => n.id === selectedNodeId) || nodesList[2];

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Zig-Zag Staggered Node Cards Grid (Zero Connecting Lines) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '14px',
        alignItems: 'center',
        padding: '28px 12px',
        minHeight: '220px'
      }}>
        {nodesList.map((item) => {
          const isSelected = item.id === selectedNodeId;
          const isHovered = item.id === hoveredNodeId;

          // Zig-zag staggered vertical offset (odd items lower, even items higher)
          const isEven = item.id % 2 === 0;
          const translateY = isEven ? '-18px' : '18px';

          return (
            <button
              key={item.id}
              onClick={() => setSelectedNodeId(item.id)}
              onMouseEnter={() => setHoveredNodeId(item.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{
                backgroundColor: isSelected ? '#252932' : isHovered ? '#1E2127' : '#181A1F',
                border: isSelected ? '2px solid var(--status-passed-color)' : isHovered ? '1px solid var(--status-source-color)' : '1px solid #323640',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                boxShadow: isSelected ? '0 0 24px rgba(52, 132, 95, 0.35)' : '0 6px 20px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translateY(${translateY}) scale(${isSelected ? 1.05 : 1})`
              }}
            >
              <div style={{
                fontSize: '9px',
                fontWeight: 800,
                color: isSelected ? 'var(--status-passed-color)' : '#9CA3AF',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.8px',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>{item.label}</span>
                {isSelected && <span style={{ color: 'var(--status-passed-color)' }}>● ACTIVE</span>}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F5F2EA', fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
                {item.title}
              </div>

              <div style={{ fontSize: '10px', color: '#AAA69D', fontFamily: 'var(--font-mono)' }}>
                {item.detail}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Provenance Trace Details Inspector Panel */}
      <div style={{
        backgroundColor: '#1E2127',
        border: '1px solid #323640',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#F5F2EA',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-deep-forest)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px'
          }}>
            0{activeNodeData.id}
          </div>

          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--status-source-color)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              INSPECTING: {activeNodeData.title}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F5F2EA', marginTop: '2px' }}>
              {activeNodeData.provenanceData.sourceDoc}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#AAA69D' }}>
          <div>
            <span style={{ color: '#6B7280' }}>Location: </span>
            <strong style={{ color: '#F5F2EA' }}>{activeNodeData.provenanceData.rawLocation}</strong>
          </div>
          <div>
            <span style={{ color: '#6B7280' }}>Rule Evaluation: </span>
            <strong style={{ color: 'var(--status-passed-color)' }}>{activeNodeData.provenanceData.ruleId}</strong>
          </div>
          <div>
            <span style={{ color: '#6B7280' }}>Sign-off: </span>
            <strong style={{ color: 'var(--status-approved-color)' }}>{activeNodeData.provenanceData.reviewer}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
