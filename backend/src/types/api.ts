// Standard API response wrappers as defined in blueprint docs/backend/api.md §1

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    requestId: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    requestId: string;
  };
}

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'STEP_UP_REQUIRED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'SERVICE_UNAVAILABLE';

export type FilingStatus =
  | 'DRAFT_IN_PROGRESS'
  | 'STAGE1_VALIDATED'
  | 'AI_DRAFTING'
  | 'AI_DRAFT_READY'
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'CERTIFIED_LOCKED'
  | 'SUBMISSION_READY';

export type SectionStatus =
  | 'NOT_STARTED'
  | 'INPUT_RECEIVED'
  | 'STAGE1_VALIDATED'
  | 'AI_DRAFTING'
  | 'AI_DRAFT_READY'
  | 'HUMAN_EDITING'
  | 'CERTIFIED_LOCKED';

export type UserRole = 'PROMOTER' | 'INTERMEDIARY' | 'ADMIN';
export type IntermediaryRole = 'MERCHANT_BANKER' | 'LEGAL_COUNSEL' | 'AUDITOR';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

// Section keys — 18 chapters of the DRHP
export type SectionKey =
  | 'CH_01' | 'CH_02' | 'CH_03' | 'CH_04' | 'CH_05'
  | 'CH_06' | 'CH_07' | 'CH_08' | 'CH_09' | 'CH_10'
  | 'CH_11' | 'CH_12' | 'CH_13' | 'CH_14' | 'CH_15'
  | 'CH_16' | 'CH_17' | 'CH_18';

export const SECTION_KEYS: SectionKey[] = [
  'CH_01', 'CH_02', 'CH_03', 'CH_04', 'CH_05',
  'CH_06', 'CH_07', 'CH_08', 'CH_09', 'CH_10',
  'CH_11', 'CH_12', 'CH_13', 'CH_14', 'CH_15',
  'CH_16', 'CH_17', 'CH_18',
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  CH_01: 'Cover Page & General Information',
  CH_02: 'Risk Factors',
  CH_03: 'Introduction & Summary',
  CH_04: 'Objects of the Issue',
  CH_05: 'Basis for Issue Price',
  CH_06: 'Business Overview',
  CH_07: 'Key Industry Regulations',
  CH_08: 'History & Corporate Structure',
  CH_09: 'Management & Board of Directors',
  CH_10: 'Promoter Group & Related Party Disclosures',
  CH_11: 'Financial Statements (Restated)',
  CH_12: 'Management Discussion & Analysis (MD&A)',
  CH_13: 'Outstanding Litigation & Legal Proceedings',
  CH_14: 'Government & Regulatory Approvals',
  CH_15: 'Other Regulatory & Statutory Disclosures',
  CH_16: 'Issue Structure & Terms',
  CH_17: 'Issue Procedure & Application Process',
  CH_18: 'Material Contracts & Documents for Inspection',
};

// Phase groupings (no separate DB table needed — resolved at service layer)
export const PHASE_GROUPS = {
  PHASE_1: ['CH_01', 'CH_02', 'CH_03', 'CH_04', 'CH_05'] as SectionKey[],
  PHASE_2: ['CH_06', 'CH_07', 'CH_08', 'CH_09', 'CH_10'] as SectionKey[],
  PHASE_3: ['CH_11', 'CH_12', 'CH_13', 'CH_14', 'CH_15'] as SectionKey[],
  PHASE_4: ['CH_16', 'CH_17', 'CH_18'] as SectionKey[],
} as const;

export type PhaseId = keyof typeof PHASE_GROUPS;

// JWT payload shape
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  intermediaryRole: IntermediaryRole | null;
  assignedFilingIds: string[];
  iat?: number;
  exp?: number;
}
