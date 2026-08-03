import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowStepper from '../components/WorkflowStepper';
import {
UploadCloud,
FileText,
Trash2,
ArrowRight,
CheckCircle,
Sparkles,
} from 'lucide-react';

function UploadDocuments() {
const navigate = useNavigate();
const fileInputRef = useRef(null);
const [files, setFiles] = useState([]);
const [processing, setProcessing] = useState(false);

const handleFiles = (selectedFiles) => {
const incoming = Array.from(selectedFiles || []);
setFiles((prev) => {
const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
const unique = incoming.filter((f) => !existing.has(`${f.name}-${f.size}`));
return [...prev, ...unique];
});
};

const onInputChange = (e) => handleFiles(e.target.files);

const onDrop = (e) => {
e.preventDefault();
handleFiles(e.dataTransfer.files);
};

const removeFile = (index) => {
setFiles((prev) => prev.filter((_, i) => i !== index));
};

const handleContinue = () => {
setProcessing(true);
setTimeout(() => {
navigate('/extract');
}, 1800);
};

return ( <div className='min-h-screen bg-[#F8FAFC]'> <header className='border-b bg-white'> <div className='mx-auto flex max-w-7xl items-center justify-between px-8 py-6'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-600'>
Prospectus Intelligence Platform </p> <h1 className='text-3xl font-bold text-[#0F172A]'>PROSPECTUS IQ</h1> </div>


      <button
        onClick={() => navigate('/dashboard')}
        className='rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
      >
        Back to Dashboard
      </button>
    </div>
  </header>

  <main className='mx-auto max-w-6xl px-8 py-10'>
    <WorkflowStepper current='upload' />

    <div className='mt-8 grid gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='h-7 w-7 text-blue-600' />
          <div>
            <h2 className='text-2xl font-bold text-[#0F172A]'>
              Upload Company Documents
            </h2>
            <p className='text-sm text-gray-500'>
              Upload incorporation, GST, PAN, financial statements, and
              other documents required for SME IPO prospectus generation.
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className='mt-8 rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-100'
        >
          <UploadCloud className='mx-auto h-16 w-16 text-blue-600' />

          <h3 className='mt-4 text-xl font-semibold text-[#0F172A]'>
            Drag and drop files here
          </h3>

          <p className='mt-2 text-gray-500'>
            PDF, DOCX, XLSX, PNG and JPG files supported
          </p>

          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'
            className='hidden'
            onChange={onInputChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className='mt-6 rounded-2xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-blue-700'
          >
            Choose Files
          </button>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-[#0F172A]'>
              Selected Documents
            </h3>

            <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700'>
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          </div>

          {files.length === 0 ? (
            <div className='mt-4 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500'>
              No documents selected yet.
            </div>
          ) : (
            <div className='mt-4 space-y-3'>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className='flex items-center justify-between rounded-2xl border border-gray-200 p-4'
                >
                  <div className='flex items-center gap-3'>
                    <div className='rounded-xl bg-blue-100 p-2'>
                      <FileText className='h-5 w-5 text-blue-600' />
                    </div>

                    <div>
                      <p className='font-semibold text-[#0F172A]'>
                        {file.name}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(index)}
                    className='rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600'
                  >
                    <Trash2 className='h-5 w-5' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-8 flex justify-end'>
          <button
            onClick={handleContinue}
            disabled={files.length === 0 || processing}
            className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white ${
              files.length === 0 || processing
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-[#2563EB] hover:bg-blue-700'
            }`}
          >
            {processing ? 'Processing Documents...' : 'Continue to AI Extraction'}
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold text-[#0F172A]'>
            Required Documents
          </h3>

          <div className='mt-5 space-y-4 text-sm'>
            {[
              'Certificate of Incorporation',
              'GST Registration Certificate',
              'PAN & Company KYC',
              'Financial Statements (3 Years)',
              'Shareholding Pattern',
              'Promoter & Director Details',
            ].map((item) => (
              <div key={item} className='flex items-center gap-3 text-green-700'>
                <CheckCircle className='h-5 w-5' />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-3xl bg-[#0F172A] p-6 text-white'>
          <h3 className='text-lg font-semibold'>AI Extraction Preview</h3>

          <p className='mt-3 text-sm leading-relaxed text-blue-100'>
            PROSPECTUS IQ will automatically extract company details,
            financial data, promoters, capital structure, and compliance
            information from the uploaded documents.
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