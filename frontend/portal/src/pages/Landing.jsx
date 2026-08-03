import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white border-b">

        <h1 className="text-2xl font-bold text-[#0f172a]">
          PROSPECTUS IQ
        </h1>


        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-semibold"
          >
            Login
          </Link>


          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-xl border border-gray-300 text-[#0f172a] font-semibold"
          >
            Dashboard
          </Link>

        </div>

      </nav>



      {/* Hero Section */}

      <section className="max-w-6xl mx-auto px-10 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">


          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold">
              SEBI TechSprint 2026
            </p>


            <h2 className="mt-4 text-5xl font-bold text-[#0f172a] leading-tight">

              AI Powered SME IPO Prospectus Intelligence Platform

            </h2>


            <p className="mt-6 text-lg text-gray-600 leading-relaxed">

              PROSPECTUS IQ helps companies prepare SME IPO offer documents
              using AI-powered extraction, compliance analysis, automated draft
              generation, and merchant banker review workflows.

            </p>



            <div className="mt-8 flex gap-4">


              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-2xl bg-[#2563eb] text-white font-semibold"
              >
                Start IPO Workflow
              </Link>



              <Link
                to="/upload"
                className="px-6 py-3 rounded-2xl border border-gray-300 text-[#0f172a] font-semibold"
              >
                Upload Documents
              </Link>


            </div>

          </div>




          {/* Dashboard Preview */}

          <div className="bg-white rounded-3xl shadow-xl border p-8">


            <h3 className="text-xl font-semibold text-[#0f172a] mb-6">

              PROSPECTUS IQ Dashboard

            </h3>



            <div className="grid grid-cols-2 gap-4">


              <div className="rounded-2xl bg-[#eff6ff] p-5">

                <p className="text-sm text-gray-500">
                  IPO Readiness
                </p>

                <h4 className="text-3xl font-bold text-[#0f172a] mt-2">
                  82%
                </h4>

              </div>




              <div className="rounded-2xl bg-[#f8fafc] p-5">

                <p className="text-sm text-gray-500">
                  Documents
                </p>

                <h4 className="text-3xl font-bold text-[#0f172a] mt-2">
                  12/15
                </h4>

              </div>





              <div className="rounded-2xl bg-[#fef3c7] p-5">

                <p className="text-sm text-gray-500">
                  Compliance Flags
                </p>

                <h4 className="text-3xl font-bold text-[#92400e] mt-2">
                  3
                </h4>

              </div>





              <div className="rounded-2xl bg-[#ecfdf5] p-5">

                <p className="text-sm text-gray-500">
                  Draft Status
                </p>

                <h4 className="text-2xl font-bold text-[#065f46] mt-2">
                  Generated
                </h4>

              </div>


            </div>




            <div className="mt-8">


              <p className="text-sm text-gray-500 mb-2">
                Workflow Progress
              </p>



              <div className="h-3 w-full rounded-full bg-gray-200">

                <div className="h-3 w-[76%] rounded-full bg-[#2563eb]" />

              </div>



              <p className="mt-3 text-sm text-gray-500">

                Upload → AI Extraction → Prospectus Draft → Banker Review

              </p>


            </div>


          </div>


        </div>

      </section>


    </div>
  );
}


export default Landing;