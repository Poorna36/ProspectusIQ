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
import { Link } from 'react-router-dom';
import {
FileText,
ShieldCheck,
Sparkles,
Upload,
ArrowRight,
CheckCircle,
AlertTriangle,
Clock,
BarChart3,
} from 'lucide-react';

function Dashboard() {
const metrics = [
{ title: 'IPO Readiness', value: '89%', icon: ShieldCheck, color: 'bg-blue-50 text-blue-700' },
{ title: 'AI Confidence', value: '94%', icon: Sparkles, color: 'bg-green-50 text-green-700' },
{ title: 'Documents Uploaded', value: '12/15', icon: FileText, color: 'bg-indigo-50 text-indigo-700' },
{ title: 'Compliance Alerts', value: '2', icon: AlertTriangle, color: 'bg-amber-50 text-amber-700' },
];

const activities = [
{ title: 'Certificate of Incorporation uploaded', time: '2 min ago', status: 'done' },
{ title: 'GST Certificate verified', time: '5 min ago', status: 'done' },
{ title: 'Financial statements processed by AI', time: '11 min ago', status: 'done' },
{ title: 'Director count mismatch detected', time: '14 min ago', status: 'warning' },
];

return ( <div className='min-h-screen bg-[#F8FAFC]'> <header className='border-b bg-white'> <div className='mx-auto flex max-w-7xl items-center justify-between px-8 py-6'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-600'>
Prospectus Intelligence Platform </p> <h1 className='text-3xl font-bold text-[#0F172A]'>PROSPECTUS IQ</h1> </div>


      <Link
        to='/upload'
        className='inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-blue-700'
      >
        <Upload className='h-5 w-5' />
        Upload Documents
      </Link>
    </div>
  </header>

  <main className='mx-auto max-w-7xl px-8 py-8'>
    <div className='rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-8 text-white'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.2em] text-blue-200'>Active SME IPO Project</p>
          <h2 className='mt-2 text-4xl font-bold'>ABC Technologies Pvt. Ltd.</h2>
          <p className='mt-3 max-w-2xl text-blue-100'>
            AI-powered workflow for prospectus preparation, compliance validation, draft generation,
            and merchant banker review.
          </p>
        </div>

        <div className='rounded-3xl bg-white/10 p-6 backdrop-blur'>
          <p className='text-sm text-blue-100'>Overall Progress</p>
          <div className='mt-2 text-4xl font-bold'>76%</div>
          <div className='mt-4 h-3 w-64 rounded-full bg-white/20'>
            <div className='h-3 w-[76%] rounded-full bg-white' />
          </div>
          <p className='mt-3 text-sm text-blue-100'>
            Upload → AI Extraction → Draft → Review
          </p>
        </div>
      </div>
    </div>

    <div className='mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.title} className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className={`inline-flex rounded-2xl p-3 ${metric.color}`}>
              <Icon className='h-6 w-6' />
            </div>
            <p className='mt-4 text-sm text-gray-500'>{metric.title}</p>
            <h3 className='mt-2 text-3xl font-bold text-[#0F172A]'>{metric.value}</h3>
          </div>
        );
      })}
    </div>

    <div className='mt-8 grid gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-semibold text-[#0F172A]'>Workflow Pipeline</h3>
            <p className='text-sm text-gray-500'>
              Complete AI-assisted prospectus preparation workflow
            </p>
          </div>

          <BarChart3 className='h-6 w-6 text-blue-600' />
        </div>

        <div className='mt-8 space-y-5'>
          {[
            { step: 'Document Upload', status: 'Completed', color: 'green' },
            { step: 'AI Extraction & Validation', status: 'Completed', color: 'green' },
            { step: 'Draft Prospectus Generation', status: 'In Progress', color: 'blue' },
            { step: 'Merchant Banker Review', status: 'Pending', color: 'amber' },
            { step: 'Certification & Lock', status: 'Pending', color: 'gray' },
          ].map((item) => (
            <div
              key={item.step}
              className='flex items-center justify-between rounded-2xl border border-gray-200 p-4'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center ${
                    item.color === 'green'
                      ? 'bg-green-100 text-green-700'
                      : item.color === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : item.color === 'amber'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.color === 'green' ? (
                    <CheckCircle className='h-5 w-5' />
                  ) : item.color === 'blue' ? (
                    <Sparkles className='h-5 w-5' />
                  ) : (
                    <Clock className='h-5 w-5' />
                  )}
                </div>

                <div>
                  <p className='font-semibold text-[#0F172A]'>{item.step}</p>
                  <p className='text-sm text-gray-500'>{item.status}</p>
                </div>
              </div>

              <ArrowRight className='h-5 w-5 text-gray-400' />
            </div>
          ))}
        </div>

        <div className='mt-8 flex flex-wrap gap-3'>
          <Link
            to='/extract'
            className='rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-blue-700'
          >
            Continue Workflow
          </Link>

          <Link
            to='/draft'
            className='rounded-2xl border border-gray-300 px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-50'
          >
            View Draft
          </Link>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold text-[#0F172A]'>Recent Activity</h3>

          <div className='mt-5 space-y-4'>
            {activities.map((activity) => (
              <div key={activity.title} className='flex gap-3'>
                <div
                  className={`mt-1 h-9 w-9 rounded-full flex items-center justify-center ${
                    activity.status === 'done'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {activity.status === 'done' ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <AlertTriangle className='h-4 w-4' />
                  )}
                </div>

                <div>
                  <p className='font-medium text-[#0F172A]'>{activity.title}</p>
                  <p className='text-sm text-gray-500'>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-3xl bg-[#0F172A] p-6 text-white'>
          <h3 className='text-lg font-semibold'>Ready for AI Draft Generation</h3>

          <p className='mt-3 text-sm leading-relaxed text-blue-100'>
            Your extracted company information has reached a 94% AI confidence score and is ready
            for structured SME IPO prospectus generation.
          </p>

          <Link
            to='/draft'
            className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] hover:bg-gray-100'
          >
            Generate Prospectus Draft
            <ArrowRight className='h-5 w-5' />
          </Link>
        </div>
      </div>
    </div>
  </main>
</div>

);
}

export default Dashboard;