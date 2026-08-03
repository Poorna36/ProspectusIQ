import React from 'react';
import { CheckCircle, Sparkles, FileText, ShieldCheck, Lock } from 'lucide-react';

const steps = [
{ key: 'upload', label: 'Upload', icon: FileText },
{ key: 'extract', label: 'AI Extraction', icon: Sparkles },
{ key: 'draft', label: 'Draft', icon: FileText },
{ key: 'review', label: 'Review', icon: ShieldCheck },
{ key: 'certified', label: 'Certified', icon: Lock },
];

function WorkflowStepper({ current = 'upload' }) {
const currentIndex = steps.findIndex((s) => s.key === current);

return ( <div className='w-full rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'> <div className='flex items-center justify-between'>
{steps.map((step, index) => {
const Icon = step.icon;
const completed = index < currentIndex;
const active = index === currentIndex;


      return (
        <div key={step.key} className='flex flex-1 items-center'>
          <div className='flex flex-col items-center text-center'>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                completed
                  ? 'bg-green-100 text-green-700'
                  : active
                  ? 'bg-blue-100 text-blue-700 ring-4 ring-blue-100'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {completed ? <CheckCircle className='h-6 w-6' /> : <Icon className='h-6 w-6' />}
            </div>

            <p
              className={`mt-2 text-sm font-medium ${
                completed || active ? 'text-[#0F172A]' : 'text-gray-400'
              }`}
            >
              {step.label}
            </p>
          </div>

          {index !== steps.length - 1 && (
            <div className='mx-3 h-1 flex-1 rounded-full bg-gray-200'>
              <div
                className={`h-1 rounded-full transition-all ${
                  index < currentIndex ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'
                }`}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>

  <div className='mt-4 flex items-center justify-between text-sm text-gray-500'>
    <span>Workflow progress</span>
    <span>{Math.max(0, currentIndex + 1)} / {steps.length} completed</span>
  </div>
</div>

);
}

export default WorkflowStepper;