/**
 * draftBuilder.ts
 * Phase-specific SEBI DRHP draft generation for the frontend fallback.
 * Each case maps to a real DRHP chapter with accurate statutory sub-clauses.
 */

type Inputs = Record<string, any>;

const v = (inputs: Inputs, key: string, fallback = '[●]') =>
  inputs[key] && String(inputs[key]).trim() !== '' ? String(inputs[key]) : fallback;

function notesBlock(inputs: Inputs): string {
  const n = v(inputs, 'rawNotes', '');
  if (!n || n === '[●]') return '';
  return `\n\nPROMOTER CORPORATE NOTES RECONCILIATION (STEP 2)\n${'─'.repeat(70)}\n${n}\n${'─'.repeat(70)}`;
}

function formAnswersBlock(inputs: Inputs): string {
  const entries = Object.entries(inputs)
    .filter(([k, val]) => k !== 'rawNotes' && val !== undefined && String(val).trim() !== '');
  if (entries.length === 0) return '';
  return (
    `\n\nDRAFTING FORM INPUTS RECONCILIATION (STEP 1)\n${'─'.repeat(70)}\n` +
    entries.map(([k, val]) => `  ${k.replace(/([A-Z])/g, ' $1').trim()}: ${val}`).join('\n') +
    `\n${'─'.repeat(70)}`
  );
}

// ─── CH_01: Cover Page & General Information ────────────────────────────────
function buildCH01(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION I — COVER PAGE & GENERAL INFORMATION
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 1

════════════════════════════════════════════════════════════════════════
                        RISK DISCLOSURE STATEMENT
────────────────────────────────────────────────────────────────────────
AN INVESTMENT IN EQUITY SHARES INVOLVES A DEGREE OF RISK AND INVESTORS
SHOULD NOT INVEST ANY FUNDS IN THIS OFFER UNLESS THEY CAN AFFORD TO TAKE
THE RISK OF LOSING THEIR INVESTMENT ENTIRELY. INVESTORS ARE ADVISED TO
READ THE RISK FACTORS CAREFULLY BEFORE TAKING AN INVESTMENT DECISION.
════════════════════════════════════════════════════════════════════════

1. ISSUER IDENTIFICATION
   Company Name        : ${v(i,'companyName')}
   CIN                 : ${v(i,'cin')}
   Date of Incorporation: ${v(i,'incorporationDetails')}
   Registered Office   : ${v(i,'registeredOffice')}
   Contact / Website   : ${v(i,'contactEmail')}
   Primary Business    : ${v(i,'businessSector')}

2. NATURE OF THE OFFER
   This is an Initial Public Offer of Equity Shares of face value ₹${v(i,'faceValue','10')} each
   for cash at a price of ₹[●] per share, aggregating to ₹${v(i,'issueSizeCr')} Crores.
   Issue Structure     : ${v(i,'offerType','100% Fresh Issue of Equity Shares')}
   Pursuant to Rule 19(2)(b) of the Securities Contracts (Regulation) Rules, 1957, the Offer
   shall constitute [●]% of the post-Offer paid-up Equity Share capital of the Company.

3. INTERMEDIARIES TO THE ISSUE
   Lead Manager / BRLM        : ${v(i,'leadManager')}
   Registrar to the Issue     : ${v(i,'registrarName')}
   Statutory Auditors (FRN)   : ${v(i,'auditorName')}
   ICAI Peer Review Cert.     : ${v(i,'peerReviewAuditor')}
   Designated Stock Exchange  : ${v(i,'stockExchange')}

4. SME ELIGIBILITY DECLARATION (Regulation 229 & 230, SEBI ICDR 2018)
   The Issuer satisfies all eligibility criteria for listing on the SME Platform:
   (a) Post-issue paid-up Equity Share capital will not exceed ₹25.00 Crores;
   (b) The Company has a track record of distributable profits for at least two of the
       last three financial years audited under Ind AS;
   (c) No winding-up petition has been admitted against the Company;
   (d) No proceedings under BIFR are pending against the Company or its Directors.

5. SEBI DISCLAIMER
   SEBI does not take any responsibility for the financial soundness of the Company or
   correctness of statements made or opinions expressed in this DRHP. A copy of the DRHP
   has been filed with SEBI under Regulation 246(1) of the SEBI ICDR Regulations, 2018,
   and is available on SEBI's official website at www.sebi.gov.in and on the Company's
   website at ${v(i,'contactEmail','[●]')}.

6. ISSUE OBJECTS (SUMMARY)
   Net Proceeds of the Fresh Issue will be deployed towards capital expenditure,
   working capital funding, and general corporate purposes as detailed in Section IV.

7. RISK ADVISORY
   For a comprehensive discussion of risk factors specific to this investment, please refer
   to the Risk Factors section of this DRHP. An investment in Equity Shares listed on
   ${v(i,'stockExchange')} carries risks related to liquidity, price volatility, regulatory
   changes, business concentration, and macroeconomic conditions.`;
}

// ─── CH_02: Industry & Business Overview ────────────────────────────────────
function buildCH02(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION II — INDUSTRY & BUSINESS OVERVIEW
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 6

1. MACROECONOMIC CONTEXT & INDUSTRY POSITIONING
   The ${v(i,'industrySector')} sector is undergoing significant structural expansion driven by
   enterprise digital transformation, cloud-native infrastructure adoption, and the integration
   of artificial intelligence in mission-critical business workflows. ${v(i,'companyName')}
   (hereinafter "the Company") operates at the convergence of these high-growth segments,
   providing ${v(i,'coreProducts')} to mid-market and enterprise clients across BFSI,
   manufacturing, and healthcare verticals.

2. CORE PRODUCTS & SERVICE PORTFOLIO
   ${v(i,'coreProducts')}
   The Company's revenue model is subscription and project-based, with a balanced mix of
   recurring SaaS licenses (ARR) and milestone-linked professional services contracts.

3. OPERATIONAL INFRASTRUCTURE & TECHNICAL CAPACITY
   Key Operational Facilities: ${v(i,'facilitiesLocation')}
   Total Installed Compute Capacity: ${v(i,'computeCapacity')}
   All facilities are operational and fully compliant with applicable factory, environmental,
   and IT infrastructure regulations.

4. HUMAN CAPITAL & CERTIFICATIONS
   Full-Time Employee Strength: ${v(i,'employeeCount')}
   The Company holds the following operational certifications:
   ${v(i,'esgPolicy','ISO 27001 Cybersecurity & SOC2 Type II')}

5. CUSTOMER PROFILE & CONCENTRATION ANALYSIS
   Revenue from Top 3 Customers: ${v(i,'topCustomersShare')}% of FY 2024-25 operational revenue.
   Customer Concentration Details: ${v(i,'customerConcentration')}
   The Company's customer contracts are multi-year agreements with structured penalty clauses
   for early termination, reducing attrition risk.

6. INTELLECTUAL PROPERTY PORTFOLIO
   ${v(i,'patentDetails')}
   The Company's proprietary technology stack forms a defensible moat against market entrants.

7. SUPPLY CHAIN & VENDOR DEPENDENCIES
   ${v(i,'vendorDependence')}
   The Company maintains dual-sourcing arrangements for critical hardware components to
   mitigate single-vendor dependency risks.

8. INTERNATIONAL REVENUES & EXPORT PROFILE
   Export & International Revenue Share: ${v(i,'exportRevenueShare')}% of FY 2024-25 turnover.
   The Company invoices international clients in USD and EUR. Foreign exchange exposure is
   partially natural-hedged through USD-denominated vendor payments.

9. COMPETITIVE STRENGTHS
   ${v(i,'competitiveStrengths')}
   These strengths are substantiated by the Company's three-year revenue CAGR, customer
   retention rate, and net promoter scores documented in the Business Overview.

10. THREE-YEAR GROWTH STRATEGY
    ${v(i,'growthStrategy')}
    Capital allocation from Issue Proceeds will accelerate this strategic roadmap.

11. WORKING CAPITAL PROFILE
    Receivable Days Outstanding (DSO): ${v(i,'dsoDays')} days as of FY 2024-25.
    Operating cycle is underpinned by 60-day standard payment terms with enterprise clients.`;
}

// ─── CH_03: Capital Structure & Shareholding ─────────────────────────────────
function buildCH03(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION III — CAPITAL STRUCTURE & SHAREHOLDING PATTERN
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 5

1. SHARE CAPITAL SUMMARY
   ┌─────────────────────────────────────────────────────────┐
   │  Authorised Capital         : ₹${v(i,'authorizedCapital')} Lakhs │
   │  Pre-Issue Paid-Up Capital  : ₹${v(i,'paidUpCapitalPre')} Lakhs  │
   │  Post-Issue Paid-Up Capital : ₹[●] Lakhs                │
   └─────────────────────────────────────────────────────────┘

2. PRE-ISSUE SHAREHOLDING PATTERN
   Promoter & Promoter Group Holding  : ${v(i,'promoterShareholdingPre')}% + ${v(i,'promoterGroupHolding')}%
   Non-Promoter Shareholders          : ${v(i,'nonPromoterHolders')}
   Total Pre-Issue Paid-Up Capital    : 100.00%

3. CAPITAL BUILD-UP & ALLOTMENT HISTORY
   ${v(i,'bonusHistory')}
   Most Recent Pre-IPO Allotment: ${v(i,'recentAllotmentPrice')}

4. ESOP & CONVERTIBLE INSTRUMENT DISCLOSURE
   ${v(i,'esopDetails')}
   All outstanding ESOPs, if exercised in full, will result in dilution disclosed in the
   diluted EPS computation in the Restated Financial Statements.

5. PROMOTER LOCK-IN UNDER REGULATION 236 (SEBI ICDR 2018)
   ${v(i,'promoterLockIn')}
   Lock-in shares cannot be transferred, pledged, or encumbered during the lock-in period.

6. PLEDGE & ENCUMBRANCE STATUS
   ${v(i,'pledgedShares')}
   Accordingly, there is no charge, lien, pledge, or encumbrance on any Equity Shares held
   by the Promoters or Promoter Group entities as on the date of this DRHP.`;
}

// ─── CH_04: Management & Governance ─────────────────────────────────────────
function buildCH04(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION IV — MANAGEMENT & CORPORATE GOVERNANCE
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 9

1. BOARD OF DIRECTORS
   Chairman & Managing Director : ${v(i,'cmdName')}
   Executive Directors          : ${v(i,'execDirectorsCount')}
   Independent Directors        : ${v(i,'independentDirectors')}
   The Board composition complies with Regulation 17 of SEBI (LODR) Regulations, 2015,
   and Section 149 of the Companies Act, 2013.

2. KEY MANAGERIAL PERSONNEL (KMP)
   ${v(i,'keyKMPs')}
   All KMPs are appointed in compliance with Section 203 of the Companies Act, 2013.

3. MANDATORY BOARD COMMITTEES

   3.1 AUDIT COMMITTEE (Section 177, Companies Act 2013)
   Composition: ${v(i,'auditCommittee')}

   3.2 NOMINATION & REMUNERATION COMMITTEE (Section 178)
   Composition: ${v(i,'nominationCommittee')}

   3.3 STAKEHOLDERS RELATIONSHIP COMMITTEE
   Composition: ${v(i,'stakeholderCommittee')}

4. DIRECTOR REMUNERATION (FY 2024-25)
   Aggregate Executive Remuneration: ₹${v(i,'directorRemuneration')} Lakhs.
   Remuneration is within limits prescribed under Section 197 of the Companies Act, 2013.

5. CORPORATE GOVERNANCE COMPLIANCE
   ${v(i,'governanceStatement')}

6. RELATED PARTY TRANSACTIONS (Section 188 & SEBI LODR Reg. 23)
   ${v(i,'relatedPartyMgmt')}
   All related party transactions are conducted at arm's length and approved by the Audit
   Committee in compliance with applicable statutory provisions.

7. DIRECTOR ELIGIBILITY DECLARATION
   All Directors of the Company confirm that they are not disqualified to act as Directors
   under Section 164(2) of the Companies Act, 2013, and no disqualification order under
   Section 167 has been issued against any Director.`;
}

// ─── CH_05: Restated Financials ──────────────────────────────────────────────
function buildCH05(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION V — FINANCIAL INFORMATION & RESTATED STATEMENTS
SEBI ICDR Regulations, 2018 — Regulation 26 & Schedule VI

1. AUDITORS' CERTIFICATE
   The following Restated Financial Statements have been audited by ${v(i,'auditorName')}
   in accordance with Ind AS and SEBI ICDR Regulations, 2018. Auditor's Peer Review
   Certificate: ${v(i,'peerReviewAuditor')}.

2. RESTATED INCOME STATEMENT SUMMARY (₹ CRORES)
   ┌─────────────────────┬──────────┬──────────┬──────────┐
   │ Particulars         │  FY25    │  FY24    │  FY23    │
   ├─────────────────────┼──────────┼──────────┼──────────┤
   │ Revenue from Ops    │ ${v(i,'revenueFY25')}   │ ${v(i,'revenueFY24')}   │ ${v(i,'revenueFY23')}   │
   │ EBITDA Margin (%)   │ ${v(i,'ebitdaMargin')}%  │  [●]%    │  [●]%    │
   │ Net PAT             │ ${v(i,'patFY25')}    │  [●]     │  [●]     │
   │ Return on NW (%)    │ ${v(i,'ronwPercent')}%   │  [●]%    │  [●]%    │
   │ NAV per Share (₹)   │ ${v(i,'navPerShare')}   │  [●]     │  [●]     │
   └─────────────────────┴──────────┴──────────┴──────────┘

3. BALANCE SHEET HIGHLIGHTS (FY 2024-25)
   Total Outstanding Borrowings   : ₹${v(i,'totalDebtCr')} Crores
   Debt-to-Equity Ratio           : ${v(i,'debtToEquity')}x
   Net Working Capital Requirement: ₹${v(i,'workingCapitalCr')} Crores
   Cash & Bank Balances           : ₹${v(i,'cashBalances')} Crores

4. CONTINGENT LIABILITIES
   ${v(i,'contingentLiabilities')}
   The above contingent liabilities do not have a material bearing on the going concern
   status of the Company as confirmed by the Statutory Auditors.

5. CAPITAL EXPENDITURE HISTORY
   ${v(i,'capexHistory')}

6. AUDITOR OPINION
   ${v(i,'auditorQualifications')}`;
}

// ─── RISK_FACTORS: Risk Factors ──────────────────────────────────────────────
function buildRiskFactors(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION VI — RISK FACTORS
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 2

GENERAL RISK DISCLAIMER: An investment in the Equity Shares of the Company involves
risks. You should carefully consider each of the following risk factors and all other
information in this DRHP before investing. The risks described below could adversely
affect our business, results of operations, financial condition, and prospects.

PART A — RISKS RELATING TO OUR BUSINESS AND INDUSTRY

RISK 1 — HIGH CUSTOMER CONCENTRATION (MATERIAL RISK)
${v(i,'riskTopCustomer')}
Quantified Exposure: Top 3 enterprise clients contributed ${v(i,'topCustomersShare')}% of
FY 2024-25 revenues. The loss of any primary client without near-term replacement could
materially reduce revenues and compress EBITDA margins. Any adverse development in our
relationship with key enterprise clients could have a material adverse effect on our
business, results of operations, financial condition and cash flows.

RISK 2 — WORKING CAPITAL INTENSITY & RECEIVABLE LOCKUP
${v(i,'riskWorkingCapital')}
Days Sales Outstanding (DSO) stood at ${v(i,'dsoDays')} days in FY 2024-25. Delays in
collections could force reliance on short-term credit facilities at elevated interest costs.

RISK 3 — TECHNOLOGY OBSOLESCENCE & COMPETITIVE DISRUPTION
${v(i,'riskTechObsolescence')}
The rapid pace of AI model innovation and open-source disruption could erode the Company's
technology differentiation if R&D investments are curtailed or delayed.

RISK 4 — PROMOTER & KEY EXECUTIVE DEPENDENCE
${v(i,'riskPromoterDependence')}
The absence of key-man insurance amplifies the financial impact of any sudden executive
departure on day-to-day operations and investor confidence.

RISK 5 — SUPPLIER & CLOUD INFRASTRUCTURE DEPENDENCY
${v(i,'riskSupplierDependence')}
Any interruption in cloud hosting or GPU hardware supply could impact service delivery SLAs
and trigger client penalty clauses under enterprise service agreements.

RISK 6 — PENDING TAX & LEGAL PROCEEDINGS
${v(i,'riskLitigation')}
An adverse ruling could require immediate cash outflow and trigger reputational risk.

RISK 7 — FOREIGN EXCHANGE VOLATILITY
${v(i,'riskForex')}
The Company does not maintain active forex hedging instruments, leaving international revenue
exposed to USD/INR rate fluctuations.

RISK 8 — REGULATORY & ENVIRONMENTAL COMPLIANCE
${v(i,'riskRegulatory')}
New environmental, data protection (DPDP Act 2023), or sectoral regulations could impose
additional compliance costs or operational restrictions.

RISK 9 — CYBERSECURITY & DATA BREACH EXPOSURE
${v(i,'riskCybersecurity')}
Despite ISO 27001 certification, no assurance can be provided that all cyber threats will
be successfully neutralized.

RISK 10 — GEOGRAPHIC REVENUE CONCENTRATION
${v(i,'riskGeographic')}
Dependence on a limited geographic market exposes the Company to regional economic downturns.

RISK 11 — EQUITY DILUTION & SME PLATFORM LIQUIDITY
${v(i,'riskDilution')}
Shares listed on the SME Platform may have lower daily trading volumes than mainboard
securities, resulting in higher bid-ask spreads for investors.

RISK 12 — OPERATING CASH FLOW VOLATILITY
${v(i,'riskNegativeCashFlow')}

PART B — RISKS RELATING TO THE OFFER AND EQUITY SHARES
The price of Equity Shares may fluctuate significantly following listing, and investors may
not be able to resell their shares at or above the Issue Price. The Issue Price is determined
through the Book Building process and may not reflect the true underlying value.`;
}

// ─── CH_07: Legal & Litigation ───────────────────────────────────────────────
function buildCH07(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION VII — OUTSTANDING LITIGATION & LEGAL PROCEEDINGS
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 13

MATERIALITY THRESHOLD: Matters exceeding 1% of Net Worth or ₹25.00 Lakhs are disclosed
below in accordance with the Company's Board-approved materiality policy.

1. CRIMINAL PROCEEDINGS
   Against the Company  : ${v(i,'criminalProceedings')}
   Against Directors/KMPs: Nil — No criminal proceedings, FIRs, or show-cause notices
                           are pending against any Director or KMP of the Company.

2. TAX DEMANDS & STATUTORY PROCEEDINGS
   ${v(i,'taxDemands')}

3. REGULATORY ACTIONS (SEBI / RBI / ROC / MCA)
   ${v(i,'regulatoryActions')}

4. MATERIAL CIVIL LITIGATION
   ${v(i,'civilLitigation')}

5. LABOR & EMPLOYMENT DISPUTES
   ${v(i,'laborDisputes')}

6. INTELLECTUAL PROPERTY DISPUTES
   ${v(i,'ipDisputes')}

7. DEFAULTS IN STATUTORY DUES
   ${v(i,'statutoryDefaults')}

8. DIRECTOR DISQUALIFICATION STATUS (Section 164, Companies Act 2013)
   ${v(i,'directorDisqualification')}

9. HISTORICAL PENALTIES PAID
   ${v(i,'pastPenalties')}

10. AGGREGATE OUTSTANDING LEGAL EXPOSURE
    ${v(i,'litigationSummary')}
    The Company's Statutory Auditors have confirmed that the above-mentioned litigation matters
    are adequately disclosed and do not materially threaten the going concern status.`;
}

// ─── CH_08: Regulatory & Compliance Disclosures ──────────────────────────────
function buildCH08(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION VIII — GOVERNMENT & REGULATORY APPROVALS
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 14

1. STATUTORY BUSINESS LICENSES & PERMITS
   ${v(i,'statutoryApprovals')}
   All licenses listed above are current and valid as of the date of this DRHP.

2. SEBI ICDR 2018 SME ELIGIBILITY COMPLIANCE DECLARATION
   ${v(i,'smeEligibility')}
   The Company confirms compliance with each of the following eligibility criteria under
   Regulation 229 and 230, SEBI ICDR 2018:
   (a) Post-issue paid-up capital will not exceed ₹25.00 Crores.
   (b) The Company has positive EBITDA for at least 2 of the last 3 financial years.
   (c) No winding-up, BIFR reference, or statutory default exists.

3. STOCK EXCHANGE IN-PRINCIPLE APPROVAL
   ${v(i,'exchangeApproval')}

4. FDI, RBI & FEMA COMPLIANCE
   ${v(i,'fdiRbiStatus')}

5. DIVIDEND HISTORY
   ${v(i,'dividendHistory')}

6. MATERIAL DEVELOPMENTS POST BALANCE SHEET DATE
   ${v(i,'materialDevelopments')}

7. COMPANIES ACT §42 / §62 COMPLIANCE
   ${v(i,'companiesActCheck')}

8. EXPERT REPORTS & VALUATION CERTIFICATES
   ${v(i,'expertReports')}

9. INVESTOR GRIEVANCE OFFICER
   ${v(i,'investorGrievanceOfficer')}

10. SEBI & EXCHANGE FILING FEES PAID
    ${v(i,'filingFeesPaid')}`;
}

// ─── CH_04_OBJ: Objects of the Issue ─────────────────────────────────────────
function buildCH04Obj(i: Inputs): string {
  return `DRAFT RED HERRING PROSPECTUS
SECTION IX — OBJECTS OF THE ISSUE & FUND UTILISATION
SEBI ICDR Regulations, 2018 — Schedule VI, Part A, Clause 4

1. PROCEEDS SUMMARY
   ┌──────────────────────────────────────────────┬───────────────┐
   │ Particulars                                   │ ₹ Crores      │
   ├──────────────────────────────────────────────┼───────────────┤
   │ Gross Fresh Issue Proceeds                   │ ${v(i,'grossProceedsCr')}         │
   │ Less: Estimated Issue Expenses               │ (${v(i,'issueExpensesCr')})       │
   │ Net Proceeds Available for Deployment        │ ${v(i,'netProceedsCr')}         │
   └──────────────────────────────────────────────┴───────────────┘

2. ISSUE EXPENSES (Estimated)
   BRLM fees, legal counsel, registrar, SEBI filing, marketing, and printing:
   Total ₹${v(i,'issueExpensesCr')} Crores.

3. UTILISATION OF NET PROCEEDS
   Object 1 — R&D CapEx & Infrastructure     : ₹${v(i,'objectCapexCr')} Crores
   Object 2 — Working Capital Requirements   : ₹${v(i,'objectWorkingCapitalCr')} Crores
   Object 3 — Debt Repayment                 : ₹${v(i,'objectDebtRepaymentCr')} Crores
   Object 4 — General Corporate Purposes     : ₹${v(i,'objectGcpCr')} Crores
               (GCP ≤ 25% of Gross Proceeds — SEBI ICDR Regulation 7(1)(b))

4. YEAR-WISE DEPLOYMENT SCHEDULE
   FY 2025-26 : ₹${v(i,'deploymentFY26')} Crores
   FY 2026-27 : ₹${v(i,'deploymentFY27')} Crores

5. MEANS OF FINANCING
   ${v(i,'meansOfFinance')}

6. INTERIM INVESTMENT OF UNUTILISED PROCEEDS
   ${v(i,'interimInvestment')}

7. MONITORING AGENCY (SEBI ICDR Regulation 262)
   ${v(i,'monitoringAgency')}
   The Monitoring Agency will monitor the utilisation of Issue Proceeds and submit
   quarterly reports to the Audit Committee and Board of Directors.`;
}

// ─── MAIN DISPATCH ───────────────────────────────────────────────────────────
export function buildExpandedDraft(
  sectionKey: string,
  sectionTitle: string,
  inputs: Inputs
): string {
  let body = '';

  switch (sectionKey) {
    case 'CH_01': body = buildCH01(inputs); break;
    case 'CH_02': body = buildCH02(inputs); break;
    case 'CH_03': body = buildCH03(inputs); break;
    case 'CH_04': body = buildCH04(inputs); break;
    case 'CH_05': body = buildCH05(inputs); break;
    case 'RISK_FACTORS': body = buildRiskFactors(inputs); break;
    case 'CH_07': body = buildCH07(inputs); break;
    case 'CH_08': body = buildCH08(inputs); break;
    case 'CH_04_OBJ': body = buildCH04Obj(inputs); break;
    default:
      body = `DRAFT RED HERRING PROSPECTUS — ${sectionTitle.toUpperCase()}
SEBI ICDR Regulations, 2018 — Schedule VI, Part A

1. STATUTORY DISCLOSURE OVERVIEW
This section of the Draft Red Herring Prospectus has been prepared in compliance with
SEBI ICDR Regulations, 2018, and all applicable provisions of the Companies Act, 2013.

2. BOARD CERTIFICATION
The Board of Directors certifies that all disclosures in this section are true, fair,
and complete to the best of their knowledge and belief.`;
      break;
  }

  return body + formAnswersBlock(inputs) + notesBlock(inputs);
}
