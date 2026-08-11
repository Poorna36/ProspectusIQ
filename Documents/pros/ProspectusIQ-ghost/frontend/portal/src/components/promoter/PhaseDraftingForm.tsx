import React, { useState, useEffect } from 'react';
import { SectionData } from '../../types';
import { Sparkles, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface QuestionConfig {
  key: string;
  label: string;
  placeholder: string;
  sebiRule?: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
  defaultValue?: string;
}

const PHASE_QUESTIONS_MAP: Record<string, QuestionConfig[]> = {
  CH_01: [
    { key: 'companyName', label: '1. Issuer Corporate Entity Name *', placeholder: 'e.g. TechNova Solutions Limited', sebiRule: 'SEBI ICDR Schedule VI Part A' },
    { key: 'cin', label: '2. Corporate Identification Number (CIN) *', placeholder: 'e.g. U72900MH2024PTC123456', sebiRule: 'MCA21 Verification' },
    { key: 'incorporationDetails', label: '3. Date & City of Incorporation *', placeholder: 'e.g. January 14, 2024 in Pune, Maharashtra', sebiRule: 'Companies Act 2013 §7' },
    { key: 'registeredOffice', label: '4. Registered Office Full Address *', placeholder: 'e.g. Plot No. 42, Tech Park Phase II, MIDC Chakan, Pune', sebiRule: 'Statutory Jurisdiction' },
    { key: 'contactEmail', label: '5. Official Contact Email & Website *', placeholder: 'e.g. compliance@technova.ai | www.technova.ai', sebiRule: 'SEBI Grievance Mandate' },
    { key: 'businessSector', label: '6. Primary Business Sector & Domain *', placeholder: 'e.g. Technology & Enterprise AI Solutions', sebiRule: 'Industry Classification' },
    { key: 'leadManager', label: '7. Lead Manager / BRLM Name *', placeholder: 'e.g. Equirus Capital / Choice Capital Advisors', sebiRule: 'Regulation 229(1)' },
    { key: 'registrarName', label: '8. Registrar to the Issue *', placeholder: 'e.g. Link Intime India Private Limited', sebiRule: 'RTA Registration' },
    { key: 'auditorName', label: '9. Statutory Auditor Firm Name & FRN *', placeholder: 'e.g. M/s. Mehta & Associates (FRN: 106234W)', sebiRule: 'Ind AS Audit Mandate' },
    { key: 'peerReviewAuditor', label: '10. ICAI Peer Review Certificate Details *', placeholder: 'e.g. Peer Review Certificate No. 014920 valid till 2027', sebiRule: 'SEBI SME Eligibility' },
    { key: 'stockExchange', label: '11. Designated Stock Exchange *', placeholder: 'e.g. NSE Emerge (SME Platform)', sebiRule: 'In-principle approval' },
    { key: 'offerType', label: '12. Proposed Issue Structure *', placeholder: 'e.g. 100% Fresh Issue of Equity Shares', sebiRule: 'Chapter IX Rule 19(2)(b)' },
    { key: 'issueSizeCr', label: '13. Target Issue Amount (₹ Crores) *', placeholder: 'e.g. 28.50', type: 'number', sebiRule: 'SME Cap < ₹25 Cr paid-up' },
    { key: 'faceValue', label: '14. Equity Share Face Value (₹) *', placeholder: 'e.g. 10', type: 'number', sebiRule: 'Standard Nominal Value' },
  ],

  CH_02: [
    { key: 'industrySector', label: '1. Target Industry Sector & Focus *', placeholder: 'e.g. Enterprise AI, Cloud SaaS & Automated Telemetry', sebiRule: 'SEBI ICDR Schedule VI §3' },
    { key: 'coreProducts', label: '2. Core Products/Services & Revenue Split *', placeholder: 'e.g. Automated Telemetry (54%), GPU Compute (32%), SaaS (14%)', sebiRule: 'Segment Revenue Disclosure' },
    { key: 'topCustomersShare', label: '3. Top 3 Customers Share in Total Revenue (%) *', placeholder: 'e.g. 41.2', type: 'number', sebiRule: 'Concentration Risk Threshold' },
    { key: 'customerConcentration', label: '4. Customer Concentration Details & Tenure *', placeholder: 'e.g. Top client accounts for 22.4%; average relationship tenure 4.5 years', sebiRule: 'Materiality Check' },
    { key: 'facilitiesLocation', label: '5. Key Operational R&D / Tech Facilities *', placeholder: 'e.g. 16,000 sq.ft facility at Chakan, Pune with 16x H100 GPU nodes', sebiRule: 'Asset Verification' },
    { key: 'employeeCount', label: '6. Full-Time Employee Strength *', placeholder: 'e.g. 142 permanent software engineers and AI research scientists', sebiRule: 'Human Capital Disclosure' },
    { key: 'dsoDays', label: '7. Receivable Days (DSO) *', placeholder: 'e.g. 78', type: 'number', sebiRule: 'Working Capital Lockup' },
    { key: 'patentDetails', label: '8. Patents, Trademarks & IP Rights *', placeholder: 'e.g. 2 Patents filed (No. 202421098765) + 4 Registered Trademarks', sebiRule: 'IP Ownership Verification' },
    { key: 'competitiveStrengths', label: '9. Key Competitive Strengths *', placeholder: 'e.g. Proprietary model architecture, low-latency telemetry, 99.9% SLA', sebiRule: 'Qualitative Claim Proof' },
    { key: 'growthStrategy', label: '10. Growth & Expansion Strategy (3-Year Plan) *', placeholder: 'e.g. Expand enterprise SaaS sales to BFSI clients in UAE and Singapore', sebiRule: 'Forward-looking Basis' },
    { key: 'vendorDependence', label: '11. Raw Material / Cloud Provider Dependence *', placeholder: 'e.g. Cloud infrastructure hosted on AWS & Yotta Data Services', sebiRule: 'Supply Chain Risk' },
    { key: 'computeCapacity', label: '12. Technical Capacity & Infrastructure *', placeholder: 'e.g. 1.2 Petaflops AI compute cluster capacity', sebiRule: 'Asset Utilization' },
    { key: 'exportRevenueShare', label: '13. Export & International Revenue Share (%) *', placeholder: 'e.g. 18.5', type: 'number', sebiRule: 'Forex Risk Disclosure' },
    { key: 'esgPolicy', label: '14. Sustainability & Data Privacy Standards *', placeholder: 'e.g. ISO 27001 Cybersecurity & SOC2 Type II compliance', sebiRule: 'Governance Benchmark' },
  ],

  CH_03: [
    { key: 'authorizedCapital', label: '1. Authorised Share Capital (₹ Lakhs) *', placeholder: 'e.g. 1000.00 (1,00,00,000 Equity Shares of ₹10)', sebiRule: 'MOA Capital Clause' },
    { key: 'paidUpCapitalPre', label: '2. Pre-Issue Paid-Up Equity Capital (₹ Lakhs) *', placeholder: 'e.g. 680.00 (68,00,00,00 Equity Shares)', sebiRule: 'Pre-IPO Paid-Up Base' },
    { key: 'promoterShareholdingPre', label: '3. Pre-Issue Promoter Holding (%) *', placeholder: 'e.g. 84.50', type: 'number', sebiRule: 'Control Assessment' },
    { key: 'promoterGroupHolding', label: '4. Promoter Group Holding (%) *', placeholder: 'e.g. 7.20', type: 'number', sebiRule: 'Promoter Group Definition' },
    { key: 'nonPromoterHolders', label: '5. Non-Promoter Shareholder Count (>1% equity) *', placeholder: 'e.g. 3 institutional angel investors holding 8.30%', sebiRule: 'Public Category Pre-Issue' },
    { key: 'bonusHistory', label: '6. Bonus Shares Details (Last 3 Years) *', placeholder: 'e.g. Bonus issue of 4:1 executed on November 20, 2024', sebiRule: 'Capital Build-up Table' },
    { key: 'recentAllotmentPrice', label: '7. Recent Share Allotment Price (Last 12 Mo) *', placeholder: 'e.g. ₹65 per equity share allotted to VC fund on Dec 2024', sebiRule: 'Pre-IPO Placement Rule' },
    { key: 'esopDetails', label: '8. Outstanding ESOPs / Convertible Options *', placeholder: 'e.g. 2,50,000 ESOP options granted under TechNova ESOP Scheme 2024', sebiRule: 'Dilution Disclosure' },
    { key: 'promoterLockIn', label: '9. Promoter Lock-in Period Commitment *', placeholder: 'e.g. 20% post-issue capital locked-in for 3 years; balance for 1 year', sebiRule: 'Regulation 236 Lock-in' },
    { key: 'pledgedShares', label: '10. Details of Pledged Shares by Promoters *', placeholder: 'e.g. Nil — Zero promoter equity shares pledged', sebiRule: 'Encumbrance Disclosure' },
  ],

  CH_04: [
    { key: 'cmdName', label: '1. Chairman & Managing Director Name & DIN *', placeholder: 'e.g. Mr. Rajesh Sharma (DIN: 08912345)', sebiRule: 'Board Composition' },
    { key: 'execDirectorsCount', label: '2. Executive Directors Count & Experience *', placeholder: 'e.g. 2 Executive Directors with 18+ years average domain experience', sebiRule: 'KMP Disclosure' },
    { key: 'independentDirectors', label: '3. Independent Directors Count & Compliance *', placeholder: 'e.g. 3 Independent Directors (50% of Board) including 1 Woman Director', sebiRule: 'SEBI LODR Regulation 17' },
    { key: 'keyKMPs', label: '4. Key Managerial Personnel (CFO, CS) *', placeholder: 'e.g. CFO: Mr. Vikram Mehta (CA); CS: Ms. Ananya Deshmukh (FCS)', sebiRule: 'Management Team' },
    { key: 'auditCommittee', label: '5. Audit Committee Composition *', placeholder: 'e.g. Chaired by Independent Director Mr. Suresh Rao (Ex-SEBI Officer)', sebiRule: 'Section 177 Compliance' },
    { key: 'nominationCommittee', label: '6. Nomination & Remuneration Committee *', placeholder: 'e.g. 3 Non-Executive Independent Directors', sebiRule: 'Section 178 Compliance' },
    { key: 'stakeholderCommittee', label: '7. Stakeholders Relationship Committee *', placeholder: 'e.g. Formed per SEBI ICDR regulations for SME issuers', sebiRule: 'Grievance Mechanism' },
    { key: 'directorRemuneration', label: '8. Total Director Remuneration in FY25 (₹ L) *', placeholder: 'e.g. ₹48.00 Lakhs aggregate promoter executive compensation', sebiRule: 'Material Remuneration' },
    { key: 'governanceStatement', label: '9. Corporate Governance Compliance Status *', placeholder: 'e.g. Fully compliant with Companies Act 2013 and SEBI LODR 2015', sebiRule: 'Governance Code' },
    { key: 'relatedPartyMgmt', label: '10. Related Party Transactions with Directors *', placeholder: 'e.g. Office premise lease agreement with Promoter at market rate (₹1.2L/mo)', sebiRule: 'Section 188 Arm Length' },
  ],

  CH_05: [
    { key: 'revenueFY25', label: '1. Restated Revenue from Operations FY25 (₹ Cr) *', placeholder: 'e.g. 48.20', type: 'number', sebiRule: 'Restated Financials' },
    { key: 'revenueFY24', label: '2. Restated Revenue from Operations FY24 (₹ Cr) *', placeholder: 'e.g. 34.10', type: 'number', sebiRule: '3-Year Trend Comparison' },
    { key: 'revenueFY23', label: '3. Restated Revenue from Operations FY23 (₹ Cr) *', placeholder: 'e.g. 22.80', type: 'number', sebiRule: 'Historical Baseline' },
    { key: 'ebitdaMargin', label: '4. EBITDA Margin FY25 (%) *', placeholder: 'e.g. 23.6', type: 'number', sebiRule: 'Operating Profitability' },
    { key: 'patFY25', label: '5. Restated Net Profit After Tax (PAT) FY25 (₹ Cr) *', placeholder: 'e.g. 7.45', type: 'number', sebiRule: 'Net Margin Disclosure' },
    { key: 'ronwPercent', label: '6. Return on Net Worth (RoNW %) FY25 *', placeholder: 'e.g. 24.8', type: 'number', sebiRule: 'Return Metric' },
    { key: 'navPerShare', label: '7. Net Asset Value (NAV) per Share (₹) *', placeholder: 'e.g. 44.12', type: 'number', sebiRule: 'Pre-Issue Net Asset Value' },
    { key: 'totalDebtCr', label: '8. Total Outstanding Debt / Borrowings (₹ Cr) *', placeholder: 'e.g. 6.80', type: 'number', sebiRule: 'Leverage Risk' },
    { key: 'debtToEquity', label: '9. Debt-to-Equity Ratio *', placeholder: 'e.g. 0.23', type: 'number', sebiRule: 'Capitalization Ratio' },
    { key: 'workingCapitalCr', label: '10. Net Working Capital Requirement (₹ Cr) *', placeholder: 'e.g. 11.40', type: 'number', sebiRule: 'Operating Liquidity' },
    { key: 'cashBalances', label: '11. Cash & Bank Balances (₹ Cr) *', placeholder: 'e.g. 3.25', type: 'number', sebiRule: 'Liquid Reserves' },
    { key: 'contingentLiabilities', label: '12. Contingent Liabilities & Tax Claims (₹ Cr) *', placeholder: 'e.g. 0.185 (Income Tax Dispute under appeal)', sebiRule: 'Off-Balance Sheet Note' },
    { key: 'auditorQualifications', label: '13. Statutory Auditor Audit Matters / Qualifications *', placeholder: 'e.g. Unqualified clean audit opinion issued by Statutory Auditor', sebiRule: 'Audit Report Status' },
    { key: 'capexHistory', label: '14. Total CapEx Incurred in Last 3 FYs (₹ Cr) *', placeholder: 'e.g. 14.60 Crores in GPU compute infrastructure', sebiRule: 'Asset Creation History' },
  ],

  RISK_FACTORS: [
    { key: 'riskTopCustomer', label: '1. Customer Concentration Risk Summary *', placeholder: 'e.g. Top 3 customers contribute 41.2% of revenue. Loss of key client would impact cash flow.', sebiRule: 'SEBI ICDR Risk Mandate 1' },
    { key: 'riskWorkingCapital', label: '2. Working Capital & Receivables Risk *', placeholder: 'e.g. DSO of 78 days creates liquidity dependence on short-term bank facilities.', sebiRule: 'Liquidity Risk' },
    { key: 'riskTechObsolescence', label: '3. Technology Obsolescence & Model Risk *', placeholder: 'e.g. Rapid AI model evolution requires continuous GPU CapEx and R&D talent retention.', sebiRule: 'Industry Specific Risk' },
    { key: 'riskPromoterDependence', label: '4. Key Executive & Promoter Dependence Risk *', placeholder: 'e.g. High reliance on Promoter Mr. Rajesh Sharma; no key-man insurance policy maintained.', sebiRule: 'Management Risk' },
    { key: 'riskSupplierDependence', label: '5. Supplier & Cloud Host Dependency Risk *', placeholder: 'e.g. Reliance on AWS and specialized GPU vendors for server hosting.', sebiRule: 'Operational Bottleneck' },
    { key: 'riskLitigation', label: '6. Pending Legal & Tax Proceedings Risk *', placeholder: 'e.g. Pending income tax demand notice of ₹18.5 Lakhs under appeal for AY 2022-23.', sebiRule: 'Legal Exposure' },
    { key: 'riskForex', label: '7. Foreign Currency Fluctuation Risk *', placeholder: 'e.g. 18.5% export revenue exposed to USD/INR exchange rate volatility without active hedging.', sebiRule: 'Financial Hedging Risk' },
    { key: 'riskRegulatory', label: '8. Regulatory Compliance & Environmental Risk *', placeholder: 'e.g. Mandatory adherence to Factories Act 1948 and State IT Policy regulations.', sebiRule: 'Statutory Risk' },
    { key: 'riskCybersecurity', label: '9. Cybersecurity & Data Breach Vulnerability *', placeholder: 'e.g. Cloud infrastructure subject to malware attack risks despite ISO 27001 certification.', sebiRule: 'IT Risk' },
    { key: 'riskGeographic', label: '10. Geographic Revenue Concentration Risk *', placeholder: 'e.g. 62% of domestic revenue originates from Maharashtra state market.', sebiRule: 'Geographic Risk' },
    { key: 'riskDilution', label: '11. Equity Dilution & Listing Volatility Risk *', placeholder: 'e.g. Post-IPO shareholding dilution and SME exchange liquidity constraints.', sebiRule: 'Market Risk' },
    { key: 'riskNegativeCashFlow', label: '12. Operating Cash Flow Volatility Risk *', placeholder: 'e.g. Negative operating cash flows in FY 2023 due to initial compute CapEx setup.', sebiRule: 'Cash Flow Risk' },
  ],

  CH_07: [
    { key: 'criminalProceedings', label: '1. Criminal Proceedings against Issuer/Directors *', placeholder: 'e.g. Nil — No criminal cases or FIRs pending against company or board', sebiRule: 'Material Litigation §1' },
    { key: 'taxDemands', label: '2. Pending Tax Demands (Income Tax / GST) *', placeholder: 'e.g. IT Appeal pending before CIT(A) Pune for ₹18.50 Lakhs (AY 2022-23)', sebiRule: 'Tax Exposure' },
    { key: 'regulatoryActions', label: '3. Statutory / Regulatory Actions (SEBI, RBI, RoC) *', placeholder: 'e.g. Nil — No regulatory penalties or show-cause notices received', sebiRule: 'Regulatory Record' },
    { key: 'civilLitigation', label: '4. Material Civil Proceedings Pending (₹ Lakhs) *', placeholder: 'e.g. Commercial dispute with vendor M/s. TechParts for ₹12.40 Lakhs', sebiRule: 'Civil Claims Threshold' },
    { key: 'laborDisputes', label: '5. Labor & Employment Matters Pending *', placeholder: 'e.g. Nil — Zero active labor union disputes or industrial court matters', sebiRule: 'Labor Law Disclosure' },
    { key: 'ipDisputes', label: '6. IP Infringement / Trademark Disputes *', placeholder: 'e.g. Opposition filed against Trademark "TechNova AI" resolved in favor', sebiRule: 'IP Litigation' },
    { key: 'statutoryDefaults', label: '7. Defaults in Statutory Dues or Bank Debt *', placeholder: 'e.g. Nil — All PF, ESI, GST, and bank interest dues paid on schedule', sebiRule: 'Default Status' },
    { key: 'directorDisqualification', label: '8. Director Disqualification Check (§164) *', placeholder: 'e.g. All directors eligible under Section 164(2) of Companies Act 2013', sebiRule: 'MCA Eligibility' },
    { key: 'pastPenalties', label: '9. Past Monetary Fines / Penalties Paid *', placeholder: 'e.g. Late filing fee of ₹4,000 paid to RoC for Form AOC-4 in FY 2023', sebiRule: 'Historical Non-compliance' },
    { key: 'litigationSummary', label: '10. Summary of Overall Outstanding Legal Impact *', placeholder: 'e.g. Aggregate financial exposure across all pending matters is ₹30.90 Lakhs', sebiRule: 'Aggregate Materiality' },
  ],

  CH_08: [
    { key: 'statutoryApprovals', label: '1. Government & Environmental Approvals *', placeholder: 'e.g. Factory License, MPCB Consent to Operate, GST & Shops Act valid', sebiRule: 'Business License Validity' },
    { key: 'smeEligibility', label: '2. SEBI (ICDR) 2018 SME Listing Criteria Status *', placeholder: 'e.g. Post-issue paid-up capital ₹11.30 Cr (below ₹25 Cr SME ceiling)', sebiRule: 'Chapter IX Eligibility' },
    { key: 'exchangeApproval', label: '3. Stock Exchange In-Principle Approval *', placeholder: 'e.g. In-principle approval application submitted to NSE Emerge platform', sebiRule: 'NSE Emerge Norms' },
    { key: 'fdiRbiStatus', label: '4. FDI & RBI Reporting Compliance *', placeholder: 'e.g. Foreign inward investment reported under Automatic Route via FC-GPR', sebiRule: 'FEMA Compliance' },
    { key: 'dividendHistory', label: '5. Dividend Declaration History (Past 3 Years) *', placeholder: 'e.g. No dividend declared in past 3 FYs to plow back profits into R&D', sebiRule: 'Dividend Disclosure' },
    { key: 'materialDevelopments', label: '6. Material Developments Post Balance Sheet Date *', placeholder: 'e.g. Signed enterprise software contract with HDFC Ergo for ₹4.2 Cr', sebiRule: 'Post-Balance Sheet Events' },
    { key: 'companiesActCheck', label: '7. Compliance with Companies Act §42 / §62 *', placeholder: 'e.g. All preferential allotments executed in compliance with Section 62(1)(c)', sebiRule: 'Capital Allotment Norms' },
    { key: 'expertReports', label: '8. Expert Reports / Valuation Certificates Included *', placeholder: 'e.g. Valuation report by Registered Valuer Mr. K. Sharma (IBBI Reg: 00192)', sebiRule: 'Expert Consent' },
    { key: 'investorGrievanceOfficer', label: '9. Investor Grievance Officer Contact Details *', placeholder: 'e.g. Ms. Ananya Deshmukh (Email: investors@technova.ai | Tel: 020-67123400)', sebiRule: 'Redressal Mechanism' },
    { key: 'filingFeesPaid', label: '10. SEBI & Exchange Filing Fees Payment Proof *', placeholder: 'e.g. SEBI application fee ₹1,00,000 paid via NEFT on Feb 10, 2026', sebiRule: 'Statutory Fee Clearance' },
  ],

  CH_04_OBJ: [
    { key: 'grossProceedsCr', label: '1. Gross Fresh Issue Proceeds (₹ Crores) *', placeholder: 'e.g. 28.50', type: 'number', sebiRule: 'Total Issue Valuation' },
    { key: 'issueExpensesCr', label: '2. Estimated Issue Expenses (₹ Crores) *', placeholder: 'e.g. 2.30', type: 'number', sebiRule: 'BRLM, Legal & RTA Fees' },
    { key: 'netProceedsCr', label: '3. Net Proceeds Available for Deployment (₹ Cr) *', placeholder: 'e.g. 26.20', type: 'number', sebiRule: 'Net Capital Deployment' },
    { key: 'objectCapexCr', label: '4. Object 1: R&D & Compute Facility CapEx (₹ Cr) *', placeholder: 'e.g. 12.40 (16x Nvidia H100 GPU server clusters)', sebiRule: 'Itemized Object 1' },
    { key: 'objectWorkingCapitalCr', label: '5. Object 2: Working Capital Requirements (₹ Cr) *', placeholder: 'e.g. 8.50 (To support 60-day inventory cycle)', sebiRule: 'Itemized Object 2' },
    { key: 'objectDebtRepaymentCr', label: '6. Object 3: Debt Prepayment / Repayment (₹ Cr) *', placeholder: 'e.g. 0.00 (Zero debt repayment proposed)', sebiRule: 'Itemized Object 3' },
    { key: 'objectGcpCr', label: '7. Object 4: General Corporate Purposes (GCP - ₹ Cr) *', placeholder: 'e.g. 5.30 (Must not exceed 25% of gross proceeds)', sebiRule: 'SEBI 25% GCP Cap' },
    { key: 'deploymentFY26', label: '8. Deployment Schedule FY26 (₹ Crores) *', placeholder: 'e.g. 16.50', type: 'number', sebiRule: 'Year-1 Utilization' },
    { key: 'deploymentFY27', label: '9. Deployment Schedule FY27 (₹ Crores) *', placeholder: 'e.g. 9.70', type: 'number', sebiRule: 'Year-2 Utilization' },
    { key: 'meansOfFinance', label: '10. Means of Financing Structure *', placeholder: 'e.g. 100% funded through Fresh Issue Net Proceeds; zero bank loan dependency', sebiRule: 'Appraisal Standard' },
    { key: 'interimInvestment', label: '11. Interim Deployment of Unutilized Funds *', placeholder: 'e.g. Deposited in Scheduled Commercial Bank Fixed Deposits / Liquid Mutual Funds', sebiRule: 'Regulation 41 Security' },
    { key: 'monitoringAgency', label: '12. Monitoring Agency Appointment Details *', placeholder: 'e.g. HDFC Bank Limited appointed Monitoring Agency pursuant to SEBI ICDR 2018', sebiRule: 'Monitoring Mandate' },
  ],
};

interface PhaseDraftingFormProps {
  section: SectionData;
  onSaveInputs: (inputs: Record<string, string | number>) => void;
  isDrafting: boolean;
}

export const PhaseDraftingForm: React.FC<PhaseDraftingFormProps> = ({
  section,
  onSaveInputs,
  isDrafting,
}) => {
  const questions = PHASE_QUESTIONS_MAP[section.key] || PHASE_QUESTIONS_MAP['CH_02'];
  
  // Local form state initialized EMPTY by default unless user has saved input
  const [formData, setFormData] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {};
    questions.forEach((q) => {
      if (section.inputs && section.inputs[q.key] !== undefined) {
        initial[q.key] = section.inputs[q.key];
      } else {
        initial[q.key] = ''; // ALL EMPTY BY DEFAULT
      }
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Reset form data to empty when section changes (unless section has user inputs)
    const initial: Record<string, string | number> = {};
    questions.forEach((q) => {
      if (section.inputs && section.inputs[q.key] !== undefined) {
        initial[q.key] = section.inputs[q.key];
      } else {
        initial[q.key] = ''; // ALL EMPTY BY DEFAULT
      }
    });
    setFormData(initial);
  }, [section.key]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInputs(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div
      style={{
        backgroundColor: '#111827',
        borderRadius: '16px',
        border: '1px solid #253550',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: '#F5F5F4',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '20px',
          borderBottom: '1px solid #1E2D45',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            STEP 1 OF 5 — DRAFTING FORM
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', margin: 0 }}>
            {section.title}: SEBI ICDR 2018 Statutory Questionnaire
          </h3>
          <p style={{ fontSize: '14px', color: '#A8A29E', marginTop: '6px', maxWidth: '780px' }}>
            Fill in company disclosures for <strong>{section.chapter}</strong> below. All fields are empty for custom entry and will feed directly into the AI DRHP Generator and SEBI Verifier.
          </p>
        </div>

        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#F97316',
            backgroundColor: 'rgba(249,115,22,0.12)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(249,115,22,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={14} /> {questions.length} Form Disclosure Questions
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: 'rgba(52,211,153,0.12)', border: '1px solid #34D399', color: '#34D399', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> Drafting Form Responses Saved! They will now be used by the AI Generator &amp; Verifier.
        </div>
      )}

      {/* Form Questions Vertical Sequential Stack (One After Another) */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '32px' }}>
          {questions.map((q) => (
            <div
              key={q.key}
              style={{
                backgroundColor: '#0D1421',
                padding: '22px 24px',
                borderRadius: '14px',
                border: '1px solid #1E2D45',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {/* Question Label with Bigger Font */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FAFAF9',
                  marginBottom: '12px',
                  lineHeight: '1.4',
                }}
              >
                <span>{q.label}</span>
                {q.sebiRule && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#F97316',
                      backgroundColor: 'rgba(249,115,22,0.12)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      border: '1px solid rgba(249,115,22,0.25)',
                      fontWeight: 700,
                    }}
                  >
                    {q.sebiRule}
                  </span>
                )}
              </label>

              {q.type === 'textarea' ? (
                <textarea
                  value={formData[q.key] !== undefined ? String(formData[q.key]) : ''}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #57534E',
                    backgroundColor: '#172035',
                    color: '#FAFAF9',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '1.6',
                  }}
                  placeholder={q.placeholder}
                />
              ) : (
                <input
                  type={q.type || 'text'}
                  value={formData[q.key] !== undefined ? String(formData[q.key]) : ''}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '10px',
                    border: '1px solid #57534E',
                    backgroundColor: '#172035',
                    color: '#FAFAF9',
                    fontSize: '14px',
                    fontFamily: q.type === 'number' ? 'var(--font-mono)' : 'var(--font-sans)',
                    outline: 'none',
                  }}
                  placeholder={q.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Actions Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #1E2D45', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ fontSize: '13px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="#F97316" />
            Saving updates this phase's context. Proceed to Step 2 (Notepad) or Step 3 (Generator) next.
          </div>

          <button
            type="submit"
            disabled={isDrafting}
            style={{
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '15px',
              cursor: isDrafting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
              transition: 'all 0.2s',
            }}
          >
            Save Drafting Form Answers <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
