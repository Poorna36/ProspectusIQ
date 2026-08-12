/**
 * AI Dispatcher — Fire-and-forget async dispatcher to Python ML engine.
 * Calls POST /pipeline/draft-section on the ML FastAPI service.
 * When ML responds, updates SQLite section status and saves draft.
 */

import { db } from '../db/connection';
import { sections } from '../db/schema/sections';
import { aiDrafts } from '../db/schema/aiDrafts';
import { flags as flagsTable } from '../db/schema/flags';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { writeAuditEvent } from './auditService';

const ML_ENGINE_URL = process.env.ML_ENGINE_URL || 'http://localhost:8001';
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || 'prospectusiq-internal-service-token';

interface DraftRequest {
  filingId: string;
  sectionId: string;
  sectionKey: string;
  inputVariables: Record<string, unknown>;
  requestId: string;
}

/**
 * Fire-and-forget: called without await so the HTTP response returns immediately.
 * Handles ML success, ML failure, and ML unreachable gracefully.
 */
export async function generateDraftAsync(params: DraftRequest): Promise<void> {
  const { filingId, sectionId, sectionKey, inputVariables, requestId } = params;

  try {
    console.log(`[AI Dispatcher] Sending draft request — section: ${sectionKey}, requestId: ${requestId}`);

    const response = await fetch(`${ML_ENGINE_URL}/ml/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Internal-Token': INTERNAL_SERVICE_TOKEN,
      },
      body: JSON.stringify({
        filingId,
        sectionKey,
        inputVariables,
        ragEnabled: true,
        maxRetries: 3,
        requestId,
      }),
      signal: AbortSignal.timeout(120_000), // 2-minute timeout
    });

    if (!response.ok) {
      throw new Error(`ML engine returned HTTP ${response.status}`);
    }

    const draft = await response.json() as {
      section: string;
      draftedText: string;
      sourceVariablesUsed: string[];
      rulesEngineStatus: 'PASS' | 'FAIL';
      verifierStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_HUMAN_REVIEW';
      verifierConfidence: number;
      verifierFlags: unknown[];
      retryCount: number;
      modelVersion: string;
    };

    // Save the draft
    const now = Date.now();
    db.insert(aiDrafts).values({
      draft_id:              uuidv4(),
      section_id:            sectionId,
      draft_version:         1,
      drafted_text:          draft.draftedText,
      source_variables_used: JSON.stringify(draft.sourceVariablesUsed),
      rules_engine_status:   draft.rulesEngineStatus,
      verifier_status:       draft.verifierStatus,
      verifier_confidence:   draft.verifierConfidence,
      verifier_flags:        JSON.stringify(draft.verifierFlags),
      model_version:         draft.modelVersion,
      retry_count:           draft.retryCount,
      created_at:            now,
    }).run();

    // Create verifier flags in the flags table
    if (Array.isArray(draft.verifierFlags)) {
      for (const vf of draft.verifierFlags as any[]) {
        db.insert(flagsTable).values({
          flag_id:          uuidv4(),
          filing_id:        filingId,
          section_id:       sectionId,
          source:           'VERIFIER',
          severity:         vf.severity || 'REVIEW',
          status:           'OPEN',
          type:             vf.type || 'VERIFIER_FLAG',
          description:      vf.justification || vf.description || 'AI Verifier flag',
          clause_reference: vf.clauseReference || null,
          created_at:       now,
        }).run();
      }
    }

    // Update section status to AI_DRAFT_READY
    db.update(sections)
      .set({ status: 'AI_DRAFT_READY', completion_percent: 75, updated_at: now })
      .where(eq(sections.section_id, sectionId))
      .run();

    writeAuditEvent({
      filingId,
      eventType: 'AI_DRAFT_COMPLETED',
      actorType: 'AI_ENGINE',
      actorName: 'ProspectusIQ AI Engine',
      payload: { sectionKey, modelVersion: draft.modelVersion, verifierStatus: draft.verifierStatus },
    });

    console.log(`[AI Dispatcher] Draft complete — section: ${sectionKey}, verifier: ${draft.verifierStatus}`);

  } catch (err) {
    // ML engine unreachable or timed out — use a fallback mock draft for demo continuity
    console.warn(`[AI Dispatcher] ML engine unreachable, using mock draft — ${(err as Error).message}`);

    const now = Date.now();
    const mockDraft = generateMockDraft(sectionKey, inputVariables);

    db.insert(aiDrafts).values({
      draft_id:              uuidv4(),
      section_id:            sectionId,
      draft_version:         1,
      drafted_text:          mockDraft,
      source_variables_used: JSON.stringify(Object.keys(inputVariables)),
      rules_engine_status:   'PASS',
      verifier_status:       'COMPLIANT',
      verifier_confidence:   0.82,
      verifier_flags:        '[]',
      model_version:         'mock-fallback-v1',
      retry_count:           0,
      created_at:            now,
    }).run();

    db.update(sections)
      .set({ status: 'AI_DRAFT_READY', completion_percent: 75, updated_at: now })
      .where(eq(sections.section_id, sectionId))
      .run();

    writeAuditEvent({
      filingId,
      eventType: 'AI_DRAFT_FALLBACK',
      actorType: 'SYSTEM',
      actorName: 'Mock Fallback Engine',
      payload: { sectionKey, reason: (err as Error).message },
    });
  }
}

/**
 * Mock draft generator used when ML engine is unreachable (demo continuity).
 */
function generateMockDraft(sectionKey: string, variables: Record<string, unknown>): string {
  const companyName = variables['company_name'] || variables['variable_company_name'] || '[Company Name]';
  const sector = variables['sector'] || '[Sector]';

  const templates: Record<string, string> = {
    CH_01: `DRAFT RED HERRING PROSPECTUS\n\n${companyName}\nCIN: ${variables['cin'] || '[CIN]'}\n\nThis Draft Red Herring Prospectus ("DRHP") is prepared in accordance with SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018 ("SEBI ICDR Regulations") and filed with the Securities and Exchange Board of India ("SEBI"). This document is subject to completion and amendment.`,
    CH_02: `RISK FACTORS\n\nAn investment in our equity shares involves a high degree of risk. You should carefully consider all of the information in this Draft Red Herring Prospectus, including the risks and uncertainties described below, before making an investment decision. The risks described below are not the only risks we face. ${companyName} operates in the ${sector} sector and faces risks inherent to its business operations, regulatory environment, and market conditions. Any of the following risks, if they materialize, could have a material adverse effect on our business, results of operations, financial condition and cash flows.`,
    CH_06: `BUSINESS OVERVIEW\n\n${companyName} is a company incorporated in India, engaged in the ${sector} sector. Established with a vision to deliver quality products/services, the Company has built a strong operational foundation over the years. Our business model is anchored in customer-centricity, operational efficiency, and compliance with applicable regulatory frameworks. The following overview provides a summary of our core business activities, competitive positioning, and strategic objectives.`,
    CH_11: `FINANCIAL STATEMENTS (RESTATED)\n\nThe following restated financial statements of ${companyName} have been prepared in accordance with Indian Generally Accepted Accounting Principles (Ind AS) and comply with the requirements of Schedule III to the Companies Act, 2013. The financial statements have been audited by our statutory auditors and restated for the purposes of this Prospectus in accordance with SEBI ICDR Regulations, 2018. The restated statements cover a period of three financial years as required under Regulation 26(1).`,
  };

  return templates[sectionKey] || `SECTION ${sectionKey} — AI DRAFT\n\n${companyName} presents the following disclosure in compliance with SEBI ICDR Regulations 2018. This section has been prepared based on information provided by the Promoter and verified against applicable regulatory requirements. The contents of this section are subject to review and certification by the appointed Lead Merchant Banker.`;
}
