<header className="border-b bg-white">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        Prospectus Intelligence Platform
      </p>
      <h1 className="text-2xl font-bold text-[#0F172A]">
        PROSPECTUS IQ
      </h1>
    </div>

    <div className="text-sm text-gray-500">
      SME IPO Workflow
    </div>
  </div>
</header>
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
CheckCircle,
AlertTriangle,
Sparkles,
ArrowRight,
ShieldCheck,
RefreshCw,
Building2,
FileText,
Landmark,
Receipt,
} from 'lucide-react';

const extractedData = [
{ label: 'Company Name', value: 'ABC Technologies Pvt. Ltd.', confidence: 98 },
{ label: 'CIN Number', value: 'U72900KA2022PTC123456', confidence: 97 },
{ label: 'GST Number', value: '29ABCDE1234F1Z5', confidence: 96 },
{ label: 'Registered Office', value: 'Bengaluru, Karnataka', confidence: 94 },
{ label: 'Revenue (FY25)', value: '₹18,20,00,000', confidence: 95 },
{ label: 'Net Profit', value: '₹2,40,00,000', confidence: 93 },
{ label: 'Paid-up Capital', value: '₹1,50,00,000', confidence: 92 },
{ label: 'Directors', value: '4 Found / 5 Declared', confidence: 72 },
];

const checks = [
{ name: 'Company Details', status: 'pass' },
{ name: 'Financial Statements', status: 'pass' },
{ name: 'GST Verification', status: 'pass' },
{ name: 'PAN Verification', status: 'pass' },
{ name: 'Director Consistency', status: 'warning' },
{ name: 'Mandatory Disclosures', status: 'warning' },
];

function AIExtraction() {
const navigate = useNavigate();

return ( <div className='min-h-screen bg-[#F8FAFC]'> <header className='border-b bg-white'> <div className='mx-auto flex max-w-7xl items-center justify-between px-8 py-6'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-600'>
Prospectus Intelligence Platform </p> <h1 className='text-3xl font-bold text-[#0F172A]'>PROSPECTUS IQ</h1> </div>


      <button
        onClick={() => navigate('/upload')}
        className='rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
      >
        Back to Upload
      </button>
    </div>
  </header>

  <main className='mx-auto max-w-7xl px-8 py-10'>
    <div className='rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-8 text-white'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.2em] text-blue-200'>
            AI Document Intelligence
          </p>
          <h2 className='mt-2 text-4xl font-bold'>
            Prospectus Data Extraction Completed
          </h2>
          <p className='mt-3 max-w-2xl text-blue-100'>
            PROSPECTUS IQ has extracted and structured company, financial,
            GST, PAN, and promoter information into a prospectus-ready
            disclosure profile.
          </p>
        </div>

        <div className='rounded-3xl bg-white/10 p-6 backdrop-blur text-center'>
          <p className='text-sm text-blue-100'>AI Confidence</p>
          <div className='mt-2 text-5xl font-bold'>94%</div>
          <p className='mt-2 text-sm text-blue-100'>
            Ready for Compliance Validation
          </p>
        </div>
      </div>
    </div>

    <div className='mt-8 grid gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2 space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <Sparkles className='h-7 w-7 text-blue-600' />
            <div>
              <h3 className='text-2xl font-bold text-[#0F172A]'>
                Extracted Company Information
              </h3>
              <p className='text-sm text-gray-500'>
                AI-normalized data prepared for SME IPO prospectus generation
              </p>
            </div>
          </div>

          <div className='mt-6 space-y-4'>
            {extractedData.map((item) => (
              <div
                key={item.label}
                className='rounded-2xl border border-gray-200 p-4'
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-500'>{item.label}</p>

                    <input
                      defaultValue={item.value}
                      className='mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 font-semibold text-[#0F172A] outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div className='w-32 text-right'>
                    <p className='text-sm font-semibold text-blue-600'>
                      {item.confidence}%
                    </p>

                    <div className='mt-2 h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-blue-600'
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className='mt-6 inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'>
            <RefreshCw className='h-5 w-5' />
            Re-run AI Extraction
          </button>
        </div>

        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FileText className='h-6 w-6 text-blue-600' />
            <h3 className='text-xl font-semibold text-[#0F172A]'>
              AI Generated Prospectus Summary
            </h3>
          </div>

          <p className='mt-4 leading-relaxed text-gray-700'>
            ABC Technologies Private Limited is a Bengaluru-based AI software
            company incorporated in 2022. The company develops enterprise AI
            solutions for healthcare, manufacturing, and financial services
            clients across India. Based on uploaded documents, PROSPECTUS IQ
            has generated a structured disclosure profile suitable for SME IPO
            prospectus preparation and regulatory review.
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <ShieldCheck className='h-6 w-6 text-blue-600' />
            <h3 className='text-xl font-semibold text-[#0F172A]'>
              Prospectus Readiness
            </h3>
          </div>

          <div className='mt-6 flex justify-center'>
            <div className='flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-blue-600'>
              <div className='text-center'>
                <div className='text-4xl font-bold text-[#0F172A]'>89</div>
                <div className='text-sm text-gray-500'>/100</div>
              </div>
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            {checks.map((check) => (
              <div
                key={check.name}
                className='flex items-center justify-between rounded-xl border border-gray-200 p-3'
              >
                <span className='font-medium text-[#0F172A]'>{check.name}</span>

                {check.status === 'pass' ? (
                  <div className='flex items-center gap-1 text-green-700'>
                    <CheckCircle className='h-5 w-5' />
                    <span className='text-sm font-medium'>Passed</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-1 text-amber-700'>
                    <AlertTriangle className='h-5 w-5' />
                    <span className='text-sm font-medium'>Review</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-amber-200 bg-amber-50 p-6'>
          <div className='flex items-center gap-3'>
            <AlertTriangle className='h-6 w-6 text-amber-700' />
            <h3 className='text-lg font-semibold text-amber-800'>
              Compliance Flag Detected
            </h3>
          </div>

          <p className='mt-3 text-sm leading-relaxed text-amber-700'>
            AI detected a mismatch between promoter and director disclosures.
            Manual verification is recommended before the prospectus draft is
            certified for exchange submission.
          </p>
        </div>

        <div className='rounded-3xl bg-[#0F172A] p-6 text-white'>
          <div className='flex items-center gap-3'>
            <Sparkles className='h-6 w-6 text-blue-300' />
            <h3 className='text-xl font-semibold'>
              AI Compliance Validation
            </h3>
          </div>

          <p className='mt-3 text-sm leading-relaxed text-blue-100'>
            Run a final AI compliance audit before generating the SME IPO
            prospectus. Validate disclosures, financials, promoters, and
            regulatory readiness.
          </p>

          <button
            onClick={() => navigate('/compliance')}
            className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-100'
          >
            View AI Compliance Report
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  </main>
</div>

);
}

export default AIExtraction;