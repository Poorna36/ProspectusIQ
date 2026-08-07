export type FilingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'AI_DRAFTING' | 'AI_DRAFT_READY' | 'CLEARED' | 'BLOCKED';

export type UserRole = 'PROMOTER' | 'INTERMEDIARY';

export interface Flag {
  id: string;
  sectionKey: string;
  severity: 'CRITICAL' | 'REVIEW';
  title: string;
  description: string;
  clauseReference: string;
  suggestedFix?: string;
  status: 'OPEN' | 'RESOLVED' | 'WAIVED';
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface SectionData {
  key: string;
  title: string;
  chapter: string;
  status: FilingStatus;
  completionPercent: number;
  aiDraftText?: string;
  humanRedlineText?: string;
  aiConfidence?: number;
  verifierNote?: string;
  flags: Flag[];
  promoterComments?: string[];
  certified: boolean;
  certifiedBy?: string;
  certifiedAt?: string;
  inputs?: Record<string, string | number>;
}

export interface Filing {
  id: string;
  companyName: string;
  cin: string;
  gstin: string;
  sector: string;
  targetIssueSize: string; // e.g. ₹28.5 Cr
  completionPercent: number;
  overallStatus: 'DRAFTING' | 'INTERMEDIARY_REVIEW' | 'SEBI_SUBMITTED' | 'CERTIFIED_SEALED';
  sections: SectionData[];
}

export interface DueDiligenceRecord {
  id: string;
  source: 'MCA21' | 'GSTIN' | 'E-Courts' | 'CIBIL';
  entityName: string;
  queryType: string;
  status: 'CLEAR' | 'FLAGGED' | 'PENDING';
  details: string;
  timestamp: string;
}

export interface PeerMetric {
  companyName: string;
  faceValue: number;
  peRatio: number;
  ronwPercent: number;
  navPerShare: number;
  revenueCr: number;
  isIssuer?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: 'AI_GENERATOR' | 'AI_VERIFIER' | 'RULES_ENGINE' | 'PROMOTER' | 'MERCHANT_BANKER';
  action: string;
  details: string;
  hash: string;
}
