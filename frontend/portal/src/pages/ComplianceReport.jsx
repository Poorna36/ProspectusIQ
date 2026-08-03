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
ShieldCheck,
AlertTriangle,
CheckCircle,
ArrowRight,
FileWarning,
Sparkles,
} from 'lucide-react';

function ComplianceReport() {
const navigate = useNavigate();

const checks = [
{ title: 'Company Incorporation Documents', status: 'pass', note: 'Verified against MCA records' },
{ title: 'GST & PAN Consistency', status: 'pass', note: 'All identifiers matched successfully' },
{ title: 'Financial Statement Completeness', status: 'pass', note: 'Three-year audited financials detected' },
{ title: 'Promoter & Director Disclosure', status: 'warning', note: 'Director count mismatch detected (4 vs 5)' },
{ title: 'Related Party Transactions', status: 'warning', note: 'Additional disclosure recommended' },
{ title: 'Risk Factor Coverage', status: 'pass', note: 'Industry and operational risks identified' },
];

return ( <div className='min-h-screen bg-[#F8FAFC]'> <header className='border-b bg-white'> <div className='mx-auto flex max-w-7xl items-center justify-between px-8 py-6'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-600'>
AI Compliance Intelligence </p> <h1 className='text-3xl font-bold text-[#0F172A]'>PROSPECTUS IQ</h1> </div>


      <button
        onClick={() => navigate('/extract')}
        className='rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
      >
        Back
      </button>
    </div>
  </header>

  <main className='mx-auto max-w-7xl px-8 py-10'>
    <div className='rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-8 text-white'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.2em] text-blue-200'>
            Automated Prospectus Validation
          </p>
          <h2 className='mt-2 text-4xl font-bold'>
            AI Compliance Report
          </h2>
          <p className='mt-3 max-w-2xl text-blue-100'>
            PROSPECTUS IQ has validated the uploaded documents against
            SME IPO disclosure requirements and generated a compliance
            readiness assessment.
          </p>
        </div>

        <div className='rounded-3xl bg-white/10 p-6 backdrop-blur text-center'>
          <p className='text-sm text-blue-100'>Compliance Score</p>
          <div className='mt-2 text-5xl font-bold'>91%</div>
          <p className='mt-2 text-sm text-blue-100'>Ready for Draft Generation</p>
        </div>
      </div>
    </div>

    <div className='mt-8 grid gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-3'>
          <ShieldCheck className='h-6 w-6 text-blue-600' />
          <h3 className='text-xl font-semibold text-[#0F172A]'>
            Validation Results
          </h3>
        </div>

        <div className='mt-6 space-y-4'>
          {checks.map((check) => (
            <div
              key={check.title}
              className='flex items-start justify-between rounded-2xl border border-gray-200 p-4'
            >
              <div className='flex items-start gap-4'>
                <div
                  className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${
                    check.status === 'pass'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {check.status === 'pass' ? (
                    <CheckCircle className='h-5 w-5' />
                  ) : (
                    <AlertTriangle className='h-5 w-5' />
                  )}
                </div>

                <div>
                  <h4 className='font-semibold text-[#0F172A]'>{check.title}</h4>
                  <p className='mt-1 text-sm text-gray-500'>{check.note}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  check.status === 'pass'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {check.status === 'pass' ? 'Passed' : 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FileWarning className='h-6 w-6 text-amber-600' />
            <h3 className='text-lg font-semibold text-[#0F172A]'>
              AI Recommendations
            </h3>
          </div>

          <div className='mt-5 space-y-4 text-sm text-gray-600'>
            <p>
              <span className='font-semibold text-[#0F172A]'>Promoter Disclosure:</span>{' '}
              Reconcile director records before certification.
            </p>

            <p>
              <span className='font-semibold text-[#0F172A]'>Related Party Transactions:</span>{' '}
              Add a dedicated disclosure note for transparency.
            </p>

            <p>
              <span className='font-semibold text-[#0F172A]'>Financial Review:</span>{' '}
              AI recommends attaching auditor certification before filing.
            </p>
          </div>
        </div>

        <div className='rounded-3xl bg-[#0F172A] p-6 text-white'>
          <div className='flex items-center gap-3'>
            <Sparkles className='h-6 w-6 text-blue-300' />
            <h3 className='text-lg font-semibold'>Proceed to Draft</h3>
          </div>

          <p className='mt-3 text-sm leading-relaxed text-blue-100'>
            The extracted information has passed AI validation and is ready
            for automated SME IPO prospectus generation.
          </p>

          <button
            onClick={() => navigate('/draft')}
            className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-100'
          >
            Generate Prospectus Draft
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  </main>
</div>

);
}

export default ComplianceReport;