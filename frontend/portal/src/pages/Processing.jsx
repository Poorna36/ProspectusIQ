import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileSearch, Sparkles, ShieldCheck } from 'lucide-react';

export default function Processing() {
const navigate = useNavigate();

useEffect(() => {
const timer = setTimeout(() => {
navigate('/extract');
}, 3000);


return () => clearTimeout(timer);
```

}, [navigate]);

return ( <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"> <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"> <div className="flex items-center justify-center"> <Loader2 className="h-12 w-12 animate-spin text-[#2563eb]" /> </div>


    <h1 className="mt-6 text-center text-3xl font-bold text-[#0f172a]">
      AI is processing your documents
    </h1>

    <p className="mt-3 text-center text-gray-600">
      Scanning uploaded PDFs and preparing a SEBI-inspired IPO draft.
    </p>

    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
        <FileSearch className="h-5 w-5 text-[#2563eb]" />
        <span className="font-medium text-[#0f172a]">
          Scanning incorporation certificate
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
        <Sparkles className="h-5 w-5 text-[#2563eb]" />
        <span className="font-medium text-[#0f172a]">
          Extracting company and financial information
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
        <ShieldCheck className="h-5 w-5 text-[#2563eb]" />
        <span className="font-medium text-[#0f172a]">
          Validating mandatory IPO disclosures
        </span>
      </div>
    </div>

    <div className="mt-8 h-2 w-full rounded-full bg-gray-200">
      <div className="h-2 w-3/4 rounded-full bg-[#2563eb] animate-pulse" />
    </div>

    <p className="mt-3 text-center text-sm text-gray-500">
      Estimated time: 3 seconds
    </p>
  </div>
</div>

);
}
export default Processing;