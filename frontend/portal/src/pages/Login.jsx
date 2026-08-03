import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

function Login() {
const navigate = useNavigate();
const [loading, setLoading] = useState(false);

const handleLogin = (e) => {
e.preventDefault();
setLoading(true);

setTimeout(() => {
  navigate('/dashboard');
}, 1200);

};

return ( <div className='min-h-screen bg-[#F8FAFC]'> <div className='grid min-h-screen lg:grid-cols-2'> <div className='hidden lg:flex flex-col justify-between bg-[#0F172A] p-12 text-white'> <div> <p className='text-sm font-semibold uppercase tracking-[0.2em] text-blue-300'>
Prospectus Intelligence Platform </p> <h1 className='mt-4 text-5xl font-bold leading-tight'>
PROSPECTUS IQ </h1> <p className='mt-6 max-w-lg text-lg text-blue-100 leading-relaxed'>
AI-powered SME IPO prospectus generation, compliance validation,
draft preparation, and merchant banker review in one secure workflow. </p> </div>


      <div className='rounded-3xl bg-white/10 p-6 backdrop-blur'>
        <div className='flex items-center gap-3'>
          <ShieldCheck className='h-7 w-7 text-blue-300' />
          <div>
            <h3 className='text-lg font-semibold'>Secure Regulatory Workspace</h3>
            <p className='text-sm text-blue-100'>
              Built for SME issuers, merchant bankers, and compliance teams
            </p>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-2 gap-4'>
          <div className='rounded-2xl bg-white/10 p-4'>
            <p className='text-sm text-blue-100'>AI Accuracy</p>
            <p className='mt-2 text-3xl font-bold'>94%</p>
          </div>

          <div className='rounded-2xl bg-white/10 p-4'>
            <p className='text-sm text-blue-100'>Compliance Coverage</p>
            <p className='mt-2 text-3xl font-bold'>91%</p>
          </div>
        </div>
      </div>
    </div>

    <div className='flex items-center justify-center p-8'>
      <div className='w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl'>
        <div className='text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100'>
            <ShieldCheck className='h-8 w-8 text-blue-700' />
          </div>

          <h2 className='mt-6 text-3xl font-bold text-[#0F172A]'>
            Welcome back
          </h2>

          <p className='mt-2 text-gray-500'>
            Sign in to access your PROSPECTUS IQ workspace
          </p>
        </div>

        <form onSubmit={handleLogin} className='mt-8 space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-[#0F172A]'>
              Work Email
            </label>

            <div className='flex items-center rounded-2xl border border-gray-300 px-4 py-3'>
              <Mail className='mr-3 h-5 w-5 text-gray-400' />

              <input
                type='email'
                placeholder='merchantbanker@firm.com'
                className='w-full outline-none'
                defaultValue='merchantbanker@firm.com'
              />
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-[#0F172A]'>
              Password
            </label>

            <div className='flex items-center rounded-2xl border border-gray-300 px-4 py-3'>
              <Lock className='mr-3 h-5 w-5 text-gray-400' />

              <input
                type='password'
                placeholder='Enter password'
                className='w-full outline-none'
                defaultValue='Prospectus@2026'
              />
            </div>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 text-gray-600'>
              <input type='checkbox' defaultChecked />
              Remember me
            </label>

            <button type='button' className='font-medium text-blue-600'>
              Forgot password?
            </button>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-70'
          >
            {loading ? 'Signing in...' : 'Access Dashboard'}
            <ArrowRight className='h-5 w-5' />
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>
          Demo credentials pre-filled for TechSprint evaluation
        </p>

        <div className='mt-6 text-center'>
          <Link to='/' className='font-medium text-blue-600 hover:underline'>
            ← Back to PROSPECTUS IQ
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

);
}

export default Login;