import {
  Filing,
  SectionData,
  Flag,
  ReadinessIndexData,
  ScheduleViItem,
  ReconciledVariableItem,
  CertificationRecord,
  AuthResponse,
  AuditLogItem,
  DueDiligenceRecord
} from '../types';

// Fastify runs on 3001 by default, FastAPI specification on 8000
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';

const TOKEN_KEY = 'prospectusiq_access_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers });
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const json = await response.json();
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}

/**
 * ProspectusIQ API Service Layer
 * Connects frontend portal to backend REST services across all 30+ endpoints
 */
export const ProspectusIQApi = {
  // ── Authentication ────────────────────────────────────────────────────────
  async login(email: string, password: string, otpCode?: string): Promise<AuthResponse> {
    const res = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, otpCode }),
    });
    const data = await handleResponse<AuthResponse>(res);
    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  async register(payload: { email: string; password: string; fullName: string; role: string; intermediaryRole?: string; companyName?: string }): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleResponse<any>(res);
  },

  async getMe(): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
    return await handleResponse<any>(res);
  },

  // ── Filings ───────────────────────────────────────────────────────────────
  async getFilings(): Promise<Filing[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings`);
    return await handleResponse<Filing[]>(res);
  },

  async getActiveFiling(filingId: string = 'FL-2026-ABC-01'): Promise<Filing> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}`);
    return await handleResponse<Filing>(res);
  },

  async createFiling(companyName: string, cin: string, sector: string, businessModelSummary?: string): Promise<{ filingId: string; status: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings`, {
      method: 'POST',
      body: JSON.stringify({ companyName, cin, sector, businessModelSummary }),
    });
    return await handleResponse<{ filingId: string; status: string }>(res);
  },

  async submitFilingToIntermediary(filingId: string): Promise<{ filingId: string; status: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/submit-to-intermediary`, {
      method: 'PATCH',
    });
    return await handleResponse<{ filingId: string; status: string }>(res);
  },

  async exportFilingPdf(filingId: string): Promise<Blob> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/export/pdf`);
    if (!res.ok) throw new Error(`PDF Export failed with status ${res.status}`);
    return await res.blob();
  },

  // ── Sections & AI Drafting ────────────────────────────────────────────────
  async getSection(filingId: string, sectionKey: string): Promise<SectionData> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/sections/${sectionKey}`);
    return await handleResponse<SectionData>(res);
  },

  async saveSectionInputs(filingId: string, sectionKey: string, inputs: Record<string, any>): Promise<{ sectionKey: string; status: string; jobId?: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/sections/${sectionKey}/inputs`, {
      method: 'PUT',
      body: JSON.stringify({ inputs }),
    });
    return await handleResponse<{ sectionKey: string; status: string; jobId?: string }>(res);
  },

  async getSectionStatus(filingId: string, sectionKey: string): Promise<{ sectionKey: string; status: string; jobId?: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/sections/${sectionKey}/status`);
    return await handleResponse<{ sectionKey: string; status: string; jobId?: string }>(res);
  },

  async saveHumanRedline(filingId: string, sectionKey: string, editedText: string, comment?: string): Promise<{ sectionKey: string; editedAt: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/sections/${sectionKey}/human-edit`, {
      method: 'PATCH',
      body: JSON.stringify({ editedText, comment }),
    });
    return await handleResponse<{ sectionKey: string; editedAt: string }>(res);
  },

  // ── Flags ─────────────────────────────────────────────────────────────────
  async getFlags(filingId: string, filters?: { severity?: string; status?: string; source?: string; sectionKey?: string }): Promise<Flag[]> {
    const query = new URLSearchParams(filters as any).toString();
    const url = `${API_BASE_URL}/filings/${filingId}/flags${query ? `?${query}` : ''}`;
    const res = await fetchWithAuth(url);
    return await handleResponse<Flag[]>(res);
  },

  async resolveFlag(filingId: string, flagId: string, resolutionNote: string): Promise<{ flagId: string; status: string; resolvedAt: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/flags/${flagId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote }),
    });
    return await handleResponse<{ flagId: string; status: string; resolvedAt: string }>(res);
  },

  async escalateFlag(filingId: string, flagId: string, escalationNote?: string): Promise<{ flagId: string; status: string; escalatedAt: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/flags/${flagId}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ escalationNote }),
    });
    return await handleResponse<{ flagId: string; status: string; escalatedAt: string }>(res);
  },

  // ── Certifications & Governance ───────────────────────────────────────────
  async certifyFiling(
    filingId: string,
    certifierRole: string = 'LEGAL_COUNSEL',
    declaration: string = 'Verified and certified SEBI ICDR compliance',
    signatureHash: string = '0x_default_signature_hash'
  ): Promise<{ certificationId?: string; filingStatus?: string; success?: boolean; hash?: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/certifications`, {
      method: 'POST',
      body: JSON.stringify({ certifierRole, declaration, signatureHash }),
    });
    return await handleResponse<{ certificationId?: string; filingStatus?: string; success?: boolean; hash?: string }>(res);
  },

  async getCertifications(filingId: string): Promise<CertificationRecord[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/certifications`);
    return await handleResponse<CertificationRecord[]>(res);
  },

  async eSignLock(filingId: string, phaseId: string, payload: { signatoryName: string; sebiRegistrationNo: string; eSignToken: string; declarationAccepted: boolean }): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/phases/${phaseId}/e-sign-lock`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleResponse<any>(res);
  },

  async requestUnlock(filingId: string, phaseId: string, amendmentRationale: string): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/phases/${phaseId}/request-unlock`, {
      method: 'POST',
      body: JSON.stringify({ amendmentRationale }),
    });
    return await handleResponse<any>(res);
  },

  // ── Readiness & Compliance ────────────────────────────────────────────────
  async getReadinessIndex(filingId: string): Promise<ReadinessIndexData> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/readiness-index`);
    return await handleResponse<ReadinessIndexData>(res);
  },

  async getScheduleViChecklist(filingId: string): Promise<ScheduleViItem[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/checklist/schedule-vi`);
    return await handleResponse<ScheduleViItem[]>(res);
  },

  async exportChecklistPdf(filingId: string): Promise<Blob> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/export/checklist-pdf`);
    if (!res.ok) throw new Error(`Checklist PDF Export failed with status ${res.status}`);
    return await res.blob();
  },

  async reconcileVariables(filingId: string): Promise<ReconciledVariableItem[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/variables/reconcile`);
    return await handleResponse<ReconciledVariableItem[]>(res);
  },

  // ── Due Diligence ──────────────────────────────────────────────────────────
  async runDueDiligence(filingId: string, checks: string[], entities: Array<{ id: string; type: string }>): Promise<{ jobId: string; status: string }> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/due-diligence/run`, {
      method: 'POST',
      body: JSON.stringify({ checks, entities }),
    });
    return await handleResponse<{ jobId: string; status: string }>(res);
  },

  async getDueDiligenceResults(filingId: string): Promise<DueDiligenceRecord[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/due-diligence/results`);
    return await handleResponse<DueDiligenceRecord[]>(res);
  },

  // ── Audit & Communications ─────────────────────────────────────────────────
  async getAuditLog(filingId: string, page: number = 1, pageSize: number = 20): Promise<AuditLogItem[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/audit-log?page=${page}&pageSize=${pageSize}`);
    return await handleResponse<AuditLogItem[]>(res);
  },

  async getMessages(filingId: string): Promise<any[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/messages`);
    return await handleResponse<any[]>(res);
  },

  async sendMessage(filingId: string, text: string): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/filings/${filingId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return await handleResponse<any>(res);
  },

  async getNotifications(): Promise<any[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/notifications`);
    return await handleResponse<any[]>(res);
  },

  async markNotificationRead(notificationId: string): Promise<any> {
    const res = await fetchWithAuth(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    return await handleResponse<any>(res);
  },

  // ── Blueprint Spec Helpers ───────────────────────────────────────────────
  async evaluateRules(sectionKey: string): Promise<Flag[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/rules/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ sectionKey }),
    });
    return await handleResponse<Flag[]>(res);
  },

  async regenerateParagraph(sectionKey: string, prompt: string, paragraphText: string): Promise<string> {
    const res = await fetchWithAuth(`${API_BASE_URL}/draft/regenerate`, {
      method: 'POST',
      body: JSON.stringify({ sectionKey, prompt, paragraphText }),
    });
    const data = await handleResponse<{ revisedText: string }>(res);
    return data.revisedText;
  }
};
