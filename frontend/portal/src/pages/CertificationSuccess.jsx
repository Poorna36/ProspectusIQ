import React from 'react';
import { Link } from 'react-router-dom';
import {
CheckCircle,
ShieldCheck,
FileCheck2,
Download,
ArrowRight,
BadgeCheck,
Lock,
Sparkles,
} from 'lucide-react';

function CertificationSuccess() {
return ( <div className='min-h-screen bg-[#F8FAFC]'> <div className='mx-auto flex min-h-screen max-w-6xl items-center justify-center px-8 py-16'> <div className='w-full rounded-[32px] border border-gray-200 bg-white p-10 shadow-2xl'> <div className='flex flex-col items-center text-center'> <div className='flex h-24 w-24 items-center justify-center rounded-full bg-green-100'> <CheckCircle className='h-12 w-12 text-green-700' /> </div>


        <p className='mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600'>
          Prospectus Certification Complete
        </p>

        <h1 className='mt-3 text-5xl font-bold text-[#0F172A]'>
          Prospectus Successfully Certified
        </h1>

        <p className='mt-4 max-w-3xl text-lg leading-relaxed text-gray-600'>
          PROSPECTUS IQ has completed AI validation, merchant banker review,
          and digital certification. The SME IPO prospectus is now locked,
          audit-ready, and prepared for exchange submission.
        </p>
      </div>

      <div className='mt-10 rounded-3xl border border-blue-200 bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-8 text-white'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-blue-200'>
              Certified Prospectus
            </p>
            <h2 className='mt-2 text-3xl font-bold'>
              ABC Technologies Pvt. Ltd.
            </h2>
            <p className='mt-2 text-blue-100'>
              SME IPO • Digital Certification Issued
            </p>
          </div>

          <div className='rounded-3xl bg-white/10 p-6 backdrop-blur text-center'>
            <BadgeCheck className='mx-auto h-8 w-8 text-blue-200' />
            <p className='mt-2 text-sm text-blue-100'>Certification Status</p>
            <div className='mt-1 text-3xl font-bold'>Approved</div>
          </div>
        </div>
      </div>

      <div className='mt-10 grid gap-6 md:grid-cols-4'>
        <div className='rounded-3xl border border-gray-200 bg-[#F8FAFC] p-6 text-center'>
          <ShieldCheck className='mx-auto h-8 w-8 text-blue-600' />
          <p className='mt-3 text-sm text-gray-500'>Compliance Status</p>
          <p className='mt-1 text-2xl font-bold text-[#0F172A]'>Approved</p>
        </div>

        <div className='rounded-3xl border border-gray-200 bg-[#F8FAFC] p-6 text-center'>
          <FileCheck2 className='mx-auto h-8 w-8 text-blue-600' />
          <p className='mt-3 text-sm text-gray-500'>Document Version</p>
          <p className='mt-1 text-2xl font-bold text-[#0F172A]'>v1.0</p>
        </div>

        <div className='rounded-3xl border border-gray-200 bg-[#F8FAFC] p-6 text-center'>
          <Sparkles className='mx-auto h-8 w-8 text-blue-600' />
          <p className='mt-3 text-sm text-gray-500'>AI Confidence</p>
          <p className='mt-1 text-2xl font-bold text-[#0F172A]'>94%</p>
        </div>

        <div className='rounded-3xl border border-gray-200 bg-[#F8FAFC] p-6 text-center'>
          <Lock className='mx-auto h-8 w-8 text-blue-600' />
          <p className='mt-3 text-sm text-gray-500'>Document Integrity</p>
          <p className='mt-1 text-2xl font-bold text-[#0F172A]'>Locked</p>
        </div>
      </div>

      <div className='mt-10 grid gap-6 lg:grid-cols-2'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6'>
          <h3 className='text-xl font-semibold text-[#0F172A]'>
            Digital Certification Summary
          </h3>

          <div className='mt-5 space-y-3 text-sm text-gray-600'>
            <div className='flex justify-between border-b border-gray-100 pb-2'>
              <span>Company</span>
              <span className='font-semibold text-[#0F172A]'>
                ABC Technologies Pvt. Ltd.
              </span>
            </div>

            <div className='flex justify-between border-b border-gray-100 pb-2'>
              <span>Issue Type</span>
              <span className='font-semibold text-[#0F172A]'>SME IPO</span>
            </div>

            <div className='flex justify-between border-b border-gray-100 pb-2'>
              <span>Certified By</span>
              <span className='font-semibold text-[#0F172A]'>
                Merchant Banker (Demo)
              </span>
            </div>

            <div className='flex justify-between border-b border-gray-100 pb-2'>
              <span>Timestamp</span>
              <span className='font-semibold text-[#0F172A]'>
                03 Aug 2026 • 11:42 IST
              </span>
            </div>

            <div className='flex justify-between'>
              <span>Certificate ID</span>
              <span className='font-semibold text-[#0F172A]'>
                PQ-2026-SME-001
              </span>
            </div>
          </div>
        </div>

        <div className='rounded-3xl border border-gray-200 bg-white p-6'>
          <h3 className='text-xl font-semibold text-[#0F172A]'>
            Audit & Integrity Record
          </h3>

          <div className='mt-5 space-y-4'>
            <div className='rounded-2xl bg-[#F8FAFC] p-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-gray-500'>
                SHA-256 Document Hash
              </p>
              <p className='mt-2 break-all font-mono text-sm text-[#0F172A]'>
                0xA8F3C9D72B4E91F0C4B8A1E7D9F221AB7E18F5C9912D4E8A7B3C6D1F
              </p>
            </div>

            <div className='rounded-2xl border border-green-200 bg-green-50 p-4'>
              <div className='flex items-center gap-2 text-green-800'>
                <CheckCircle className='h-5 w-5' />
                <p className='font-semibold'>Exchange Submission Ready</p>
              </div>

              <p className='mt-2 text-sm text-green-700'>
                Prospectus has passed AI validation and merchant banker
                certification and is ready for the next filing stage.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
        <button className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-blue-700'>
          <Download className='h-5 w-5' />
          Download Certified Prospectus
        </button>

        <Link
          to='/dashboard'
          className='inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
        >
          Return to Dashboard
          <ArrowRight className='h-5 w-5' />
        </Link>
      </div>

      <div className='mt-10 border-t border-gray-200 pt-6 text-center'>
        <p className='text-sm text-gray-500'>
          PROSPECTUS IQ • AI-powered SME IPO prospectus intelligence,
          compliance validation, and digital certification workflow
        </p>
      </div>
    </div>
  </div>
</div>

);
}

export default CertificationSuccess;