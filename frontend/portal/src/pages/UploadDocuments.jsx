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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowStepper from "../components/WorkflowStepper";
import {
UploadCloud,
FileText,
Building2,
Receipt,
Landmark,
CheckCircle,
ArrowRight,
Sparkles,
} from 'lucide-react';

function UploadDocuments() {
const navigate = useNavigate();
const [processing, setProcessing] = useState(false);

const documents = [
{ name: 'Certificate of Incorporation', icon: Building2 },
{ name: 'GST Registration Certificate', icon: Receipt },
{ name: 'PAN & Company KYC', icon: Landmark },
{ name: 'Financial Statements (3 Years)', icon: FileText },
];

const handleGenerate = () => {
setProcessing(true);

setTimeout(() => {
  navigate('/extract');
}, 2500);


};

return ( <div className='min-h-screen bg-[#F8FAFC]'> <header className='border-b bg-white'> <div className='mx-auto flex max-w-7xl items-center justify-between px-8 py-6'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-600'>
Prospectus Intelligence Platform </p> <h1 className='text-3xl font-bold text-[#0F172A]'>PROSPECTUS IQ</h1> </div>

```
      <button
        onClick={() => navigate('/dashboard')}
        className='rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
      >
        Back to Dashboard
      </button>
    </div>
  </header>

  <main className='mx-auto max-w-6xl px-8 py-10'>
    <WorkflowStepper current="upload" />

<div className="h-6"></div>
    <div className='grid gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='h-7 w-7 text-blue-600' />
          <div>
            <h2 className='text-2xl font-bold text-[#0F172A]'>Upload Company Documents</h2>
            <p className='text-sm text-gray-500'>
              Upload the mandatory documents required for SME IPO prospectus preparation
            </p>
          </div>
        </div>

        <div className='mt-8 rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-10 text-center'>
          <UploadCloud className='mx-auto h-16 w-16 text-blue-600' />
          <h3 className='mt-4 text-xl font-semibold text-[#0F172A]'>
            Drag and drop files here
          </h3>
          <p className='mt-2 text-gray-500'>
            PDF, DOCX, XLSX and scanned documents supported
          </p>

          <button className='mt-6 rounded-2xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-blue-700'>
            Choose Files
          </button>
        </div>

        <div className='mt-8'>
          <h3 className='text-lg font-semibold text-[#0F172A]'>
            Required Documents
          </h3>

          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            {documents.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.name}
                  className='flex items-center gap-4 rounded-2xl border border-gray-200 p-4'
                >
                  <div className='rounded-xl bg-blue-100 p-3 text-blue-700'>
                    <Icon className='h-6 w-6' />
                  </div>

                  <div className='flex-1'>
                    <p className='font-semibold text-[#0F172A]'>{doc.name}</p>
                    <p className='text-sm text-gray-500'>Upload required</p>
                  </div>

                  <CheckCircle className='h-5 w-5 text-green-600' />
                </div>
              );
            })}
          </div>
        </div>

        <div className='mt-8 flex justify-end'>
          <button
            onClick={handleGenerate}
            disabled={processing}
            className='inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-70'
          >
            {processing ? 'Processing Documents...' : 'Start AI Extraction'}
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold text-[#0F172A]'>Upload Checklist</h3>

          <div className='mt-5 space-y-4 text-sm'>
            <div className='flex items-center gap-3 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              Certificate of Incorporation
            </div>

            <div className='flex items-center gap-3 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              GST Registration
            </div>

            <div className='flex items-center gap-3 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              PAN & KYC
            </div>

            <div className='flex items-center gap-3 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              Financial Statements
            </div>
          </div>
        </div>

        <div className='rounded-3xl bg-[#0F172A] p-6 text-white'>
          <h3 className='text-lg font-semibold'>AI Extraction Preview</h3>

          <p className='mt-3 text-sm leading-relaxed text-blue-100'>
            PROSPECTUS IQ will automatically extract company details,
            financial data, promoters, capital structure, and compliance
            information from uploaded documents.
          </p>

          <div className='mt-6 rounded-2xl bg-white/10 p-4'>
            <p className='text-sm text-blue-100'>Expected Processing Time</p>
            <p className='mt-2 text-2xl font-bold'>~30 seconds</p>
          </div>
        </div>
      </div>
    </div>

    {processing && (
      <div className='fixed inset-0 flex items-center justify-center bg-black/40'>
        <div className='w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl'>
          <div className='mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />

          <h3 className='mt-5 text-xl font-semibold text-[#0F172A]'>
            AI is processing your documents
          </h3>

          <p className='mt-2 text-gray-500'>
            Extracting company information, validating compliance records,
            and preparing structured prospectus data...
          </p>

          <div className='mt-6 h-3 w-full rounded-full bg-gray-200'>
            <div className='h-3 w-3/4 rounded-full bg-[#2563EB]' />
          </div>

          <p className='mt-3 text-sm text-gray-500'>
            Redirecting to AI Extraction...
          </p>
        </div>
      </div>
    )}
  </main>
</div>

);
}

export default UploadDocuments;
