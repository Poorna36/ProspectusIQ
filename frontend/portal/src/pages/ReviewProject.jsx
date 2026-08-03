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
import { useNavigate } from 'react-router-dom';
import {
CheckCircle,
AlertTriangle,
ShieldCheck,
MessageSquare,
Clock,
ArrowRight,
} from 'lucide-react';

function ReviewProject() {
const navigate = useNavigate();

return ( <div className="min-h-screen bg-[var(--bg)]">
{/* Header */} <div className="border-b border-gray-200 bg-white"> <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5"> <div> <h1 className="text-2xl font-bold text-[var(--navy)]">
Intermediary Review & Certification </h1> <p className="text-sm text-gray-500">
Merchant banker review workspace for AI-generated IPO drafts </p> </div>

      <button
        onClick={() => navigate('/draft')}
        className="rounded-xl border border-gray-300 px-4 py-2 text-[var(--navy)] hover:bg-gray-50"
      >
        Back to Draft
      </button>
    </div>
  </div>

  <div className="mx-auto max-w-7xl px-8 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--navy)]">
                Draft Review Summary
              </h2>
              <p className="text-sm text-gray-500">
                AI-generated SME IPO draft ready for intermediary validation
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              Review Pending
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--navy)]">
                    Company Overview
                  </h3>
                  <p className="text-sm text-gray-600">
                    Extracted and drafted from incorporation and business documents
                  </p>
                </div>

                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--navy)]">
                    Financial Statements
                  </h3>
                  <p className="text-sm text-gray-600">
                    Revenue, profit, and capital structure validated
                  </p>
                </div>

                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-amber-800">
                    Promoters & Directors
                  </h3>
                  <p className="text-sm text-amber-700">
                    Director count mismatch detected between uploaded documents
                  </p>
                </div>

                <AlertTriangle className="h-6 w-6 text-amber-700" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--navy)]">
                    Risk Factors
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-generated industry and operational risk disclosures
                  </p>
                </div>

                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-[var(--blue)]" />
            <h2 className="text-xl font-semibold text-[var(--navy)]">
              Reviewer Comments
            </h2>
          </div>

          <textarea
            rows={8}
            placeholder="Add comments, corrections, or requests for additional disclosures before certification..."
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-[var(--blue)]"
          />

          <div className="mt-4 flex gap-3">
            <button className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-[var(--navy)] hover:bg-gray-50">
              Save Comments
            </button>

            <button className="rounded-xl bg-[var(--blue)] px-4 py-2 font-semibold text-white hover:opacity-90">
              Request Changes
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[var(--blue)]" />
            <h3 className="text-lg font-semibold text-[var(--navy)]">
              Compliance Checklist
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Company details verified
            </div>

            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Financial statements validated
            </div>

            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              GST and PAN verified
            </div>

            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Director count requires review
            </div>

            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Auditor certificate pending
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-[var(--blue)]" />
            <h3 className="text-lg font-semibold text-[var(--navy)]">
              Review Metrics
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>AI Draft Confidence</span>
              <span className="font-medium text-[var(--navy)]">94%</span>
            </div>

            <div className="flex justify-between">
              <span>Compliance Score</span>
              <span className="font-medium text-[var(--navy)]">89%</span>
            </div>

            <div className="flex justify-between">
              <span>Sections Reviewed</span>
              <span className="font-medium text-[var(--navy)]">8 / 10</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium text-amber-700">Pending Approval</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[var(--navy)] p-6 text-white">
          <h3 className="text-lg font-semibold">Merchant Banker Action</h3>

          <p className="mt-2 text-sm leading-relaxed text-blue-100">
            Approve the draft, request revisions, or digitally certify the
            IPO offer document before submission to the exchange.
          </p>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-5 py-3 font-semibold text-[var(--navy)] hover:opacity-90">
            Approve Draft
          </button>

          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--blue)] px-5 py-3 font-semibold text-white hover:opacity-90">
            Certify & Lock
            import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

<button
  onClick={() => navigate("/success")}
  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--blue)] px-5 py-3 font-semibold text-white hover:opacity-90"
>
  Certify &amp; Lock
  <ArrowRight className="h-5 w-5" />
</button>
            
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

);
}
export default ReviewProject;