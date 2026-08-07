import { Filing, SectionData, Flag } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * ProspectusIQ API Service Layer
 * Connects frontend portal to backend FastAPI services
 */
export const ProspectusIQApi = {
  /**
   * Fetch active filing data from backend
   */
  async getActiveFiling(filingId: string = 'FL-2026-ABC-01'): Promise<Filing> {
    const response = await fetch(`${API_BASE_URL}/filings/${filingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch filing ${filingId}: HTTP ${response.status}`);
    }
    return await response.json();
  },

  /**
   * Execute deterministic rule validation for a section
   */
  async evaluateRules(sectionKey: string): Promise<Flag[]> {
    const response = await fetch(`${API_BASE_URL}/rules/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionKey })
    });
    if (!response.ok) {
      throw new Error(`Failed to evaluate rules for ${sectionKey}: HTTP ${response.status}`);
    }
    return await response.json();
  },

  /**
   * Request AI paragraph draft regeneration
   */
  async regenerateParagraph(sectionKey: string, prompt: string, paragraphText: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/draft/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionKey, prompt, paragraphText })
    });
    if (!response.ok) {
      throw new Error(`Failed to regenerate clause for ${sectionKey}: HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.revisedText;
  },

  /**
   * Submit intermediary certification & lock document version
   */
  async certifyFiling(filingId: string, reviewerName: string): Promise<{ success: boolean; hash: string }> {
    const response = await fetch(`${API_BASE_URL}/certify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filingId, reviewerName })
    });
    if (!response.ok) {
      throw new Error(`Failed to certify filing ${filingId}: HTTP ${response.status}`);
    }
    return await response.json();
  }
};
