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
import React from "react";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CheckCircle,
} from "lucide-react";

function DraftPreview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,000",
      change: "+12.5%",
      icon: <TrendingUp size={25} />,
      positive: true,
    },
    {
      title: "Expenses",
      value: "₹85,000",
      change: "-4.2%",
      icon: <CreditCard size={25} />,
      positive: false,
    },
    {
      title: "Net Profit",
      value: "₹1,60,000",
      change: "+18.7%",
      icon: <Wallet size={25} />,
      positive: true,
    },
    {
      title: "Cash Balance",
      value: "₹3,20,000",
      change: "+8.9%",
      icon: <BarChart3 size={25} />,
      positive: true,
    },
  ];

  const sections = [
    "Company Overview",
    "Business Description",
    "Financial Information",
    "Risk Factors",
    "Promoters & Directors",
    "Future Growth Strategy",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            IPO Draft Preview
          </h1>

          <p className="mt-2 text-gray-500">
            AI generated SME IPO offer document draft
          </p>
        </div>


        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700">
          Export PDF
        </button>

      </div>


      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-4">

        {stats.map((item,index)=>(

          <div
            key={index}
            className="rounded-2xl bg-white p-5 shadow"
          >

            <div className="flex justify-between">

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                {item.icon}
              </div>


              {
                item.positive ?
                <ArrowUpRight className="text-green-600"/>
                :
                <ArrowDownRight className="text-red-600"/>
              }

            </div>


            <p className="mt-4 text-gray-500">
              {item.title}
            </p>

            <h2 className="text-2xl font-bold">
              {item.value}
            </h2>

            <p
              className={
                item.positive
                ? "mt-2 text-green-600"
                : "mt-2 text-red-600"
              }
            >
              {item.change}
            </p>

          </div>

        ))}

      </div>



      {/* Draft Content */}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">


        {/* Left */}

        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow">


          <div className="mb-6 flex items-center gap-3">

            <FileText className="text-blue-600"/>

            <h2 className="text-xl font-bold">
              Generated IPO Document
            </h2>

          </div>



          <div className="space-y-4">

            {
              sections.map((section,index)=>(

                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {section}
                    </h3>

                    <p className="text-sm text-gray-500">
                      AI generated disclosure section ready for review
                    </p>

                  </div>


                  <CheckCircle className="text-green-600"/>

                </div>

              ))
            }

          </div>



        </div>



        {/* Right */}

        <div className="space-y-6">


          <div className="rounded-3xl bg-white p-6 shadow">

            <h2 className="text-xl font-bold">
              AI Confidence Score
            </h2>


            <div className="mt-6 flex justify-center">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-blue-600">

                <div className="text-center">

                  <h1 className="text-4xl font-bold">
                    94%
                  </h1>

                  <p className="text-gray-500">
                    Accuracy
                  </p>

                </div>

              </div>

            </div>

          </div>



          <div className="rounded-3xl bg-gray-900 p-6 text-white">

            <h2 className="text-xl font-bold">
              Submission Status
            </h2>


            <p className="mt-3 text-gray-300">
              Draft generated successfully. Pending merchant banker review and certification.
            </p>


            <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold">
              Send For Review
            </button>


          </div>


        </div>


      </div>


    </div>
  );
}


export default DraftPreview;