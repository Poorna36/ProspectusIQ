import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, ShieldCheck, ArrowUpRight, DollarSign } from 'lucide-react';

export const FinancialsVizPanel: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const financialMetrics = [
    { year: 'FY23', revenue: 2480.0, ebitda: 485.6, pat: 320.4, margin: 19.5, patMargin: 12.9 },
    { year: 'FY24', revenue: 3580.5, ebitda: 780.2, pat: 490.1, margin: 21.8, patMargin: 13.6 },
    { year: 'FY25', revenue: 4820.0, ebitda: 1140.0, pat: 720.0, margin: 23.6, patMargin: 14.9 },
  ];

  const revenueSegments = [
    { name: 'Enterprise AI SaaS Solutions', value: 48, color: '#F97316', amount: '₹2,313.6 Lakhs' },
    { name: 'Automated Diagnostic Telemetry', value: 32, color: '#FB923C', amount: '₹1,542.4 Lakhs' },
    { name: 'GPU Compute Infrastructure', value: 20, color: '#FDBA74', amount: '₹964.0 Lakhs' },
  ];

  const maxRevenue = 4820.0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#FAFAF9' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#1E1B18',
        borderRadius: '16px',
        border: '1px solid #44403C',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            SEBI ICDR Restated Financials Analytics
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FAFAF9', margin: 0, fontFamily: 'var(--font-sans)' }}>
            TechNova Solutions Limited — Financial Visualizer &amp; Ratio Engine
          </h2>
          <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '4px' }}>
            Restated Financial Statements for FY23, FY24, and FY25 (Ind AS compliant, audited by M/s. Mehta &amp; Associates).
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(52,211,153,0.12)',
          border: '1px solid rgba(52,211,153,0.3)',
          color: '#34D399',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <CheckCircle2 size={16} /> Ind AS Restatement Verified
        </div>
      </div>

      {/* Top Key Performance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        
        <div style={{ backgroundColor: '#1E1B18', padding: '20px', borderRadius: '16px', border: '1px solid #332F2B', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#A8A29E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>FY25 Revenue from Ops</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            ₹4,820.0 L
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +34.6% YoY Growth
          </div>
        </div>

        <div style={{ backgroundColor: '#1E1B18', padding: '20px', borderRadius: '16px', border: '1px solid #332F2B', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#A8A29E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>FY25 EBITDA Margin</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            23.6%
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> +180 bps vs FY24
          </div>
        </div>

        <div style={{ backgroundColor: '#1E1B18', padding: '20px', borderRadius: '16px', border: '1px solid #332F2B', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#A8A29E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profit After Tax (PAT)</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            ₹720.0 L
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '6px', fontWeight: 700 }}>
            PAT Margin: 14.9%
          </div>
        </div>

        <div style={{ backgroundColor: '#1E1B18', padding: '20px', borderRadius: '16px', border: '1px solid #332F2B', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#A8A29E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Return on Net Worth (RoNW)</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            24.6%
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '6px' }}>
            NSE Emerge Peer Avg: 21.8%
          </div>
        </div>

      </div>

      {/* Main Grid: Bar Chart + Pie Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* 1. Bar Chart: 3-Year Historical Growth */}
        <div style={{
          backgroundColor: '#1E1B18',
          borderRadius: '16px',
          border: '1px solid #44403C',
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF9', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={18} color="#F97316" /> 3-Year Revenue &amp; EBITDA Growth (₹ Lakhs)
              </h4>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
                <span style={{ color: '#F97316', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#F97316', borderRadius: '2px' }} /> Revenue
                </span>
                <span style={{ color: '#FB923C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#FB923C', borderRadius: '2px' }} /> EBITDA
                </span>
              </div>
            </div>

            {/* Visual Bar Chart Surface */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '220px',
              padding: '20px 10px 10px',
              borderBottom: '1px solid #332F2B',
              marginTop: '10px',
            }}>
              {financialMetrics.map((m) => {
                const revHeight = (m.revenue / maxRevenue) * 100;
                const ebitdaHeight = (m.ebitda / maxRevenue) * 100;

                return (
                  <div key={m.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-mono)' }}>
                      ₹{m.revenue.toFixed(0)}L
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100%' }}>
                      {/* Revenue Bar */}
                      <div
                        title={`Revenue: ₹${m.revenue}L`}
                        style={{
                          width: '42px',
                          height: `${revHeight}%`,
                          background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)',
                          borderRadius: '6px 6px 0 0',
                          boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                          transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      {/* EBITDA Bar */}
                      <div
                        title={`EBITDA: ₹${m.ebitda}L`}
                        style={{
                          width: '28px',
                          height: `${ebitdaHeight}%`,
                          background: 'linear-gradient(180deg, #FB923C 0%, #D97706 100%)',
                          borderRadius: '6px 6px 0 0',
                          opacity: 0.85,
                          transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FAFAF9', marginTop: '4px' }}>
                      {m.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#A8A29E', marginTop: '14px', paddingTop: '10px' }}>
            <span>CAGR Revenue Growth: <strong>39.4%</strong></span>
            <span>EBITDA Expansion: <strong>+410 bps</strong></span>
          </div>
        </div>

        {/* 2. Donut / Pie Chart: Revenue Segment Breakdown */}
        <div style={{
          backgroundColor: '#1E1B18',
          borderRadius: '16px',
          border: '1px solid #44403C',
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF9', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChartIcon size={18} color="#F97316" /> FY25 Revenue Segment Mix
            </h4>

            {/* SVG Donut Chart */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0' }}>
              <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Background Track */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2A2723"
                    strokeWidth="3.8"
                  />
                  {/* Segment 1: 48% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeDasharray="48, 100"
                  />
                  {/* Segment 2: 32% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FB923C"
                    strokeWidth="4"
                    strokeDasharray="32, 100"
                    strokeDashoffset="-48"
                  />
                  {/* Segment 3: 20% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FDBA74"
                    strokeWidth="4"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                  />
                </svg>

                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-mono)' }}>
                    ₹4.82 Cr
                  </div>
                  <div style={{ fontSize: '10px', color: '#A8A29E', textTransform: 'uppercase' }}>FY25 Ops</div>
                </div>
              </div>
            </div>
          </div>

          {/* Segment Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {revenueSegments.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: s.color, borderRadius: '3px' }} />
                  <span style={{ color: '#D6D3D1' }}>{s.name}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-mono)' }}>
                  {s.value}% ({s.amount})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Linear / Line Graph: EBITDA & PAT Margin Trajectory */}
      <div style={{
        backgroundColor: '#1E1B18',
        borderRadius: '16px',
        border: '1px solid #44403C',
        padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF9', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LineChartIcon size={18} color="#F97316" /> EBITDA % &amp; PAT Margin % Trajectory Curve
          </h4>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> SEBI Margin Ratio Benchmark Met
          </div>
        </div>

        {/* SVG Line Graph */}
        <div style={{ height: '180px', width: '100%', position: 'relative', padding: '10px 0' }}>
          <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="#2A2723" strokeDasharray="4 4" />
            <line x1="40" y1="60" x2="480" y2="60" stroke="#2A2723" strokeDasharray="4 4" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="#2A2723" strokeDasharray="4 4" />

            {/* EBITDA Margin Line (Orange) */}
            <polyline
              fill="none"
              stroke="#F97316"
              strokeWidth="3.5"
              strokeLinecap="round"
              points="80,95 260,65 440,30"
            />
            {/* EBITDA Points */}
            <circle cx="80" cy="95" r="5" fill="#F97316" stroke="#1E1B18" strokeWidth="2" />
            <text x="80" y="80" fill="#F97316" fontSize="11" fontWeight="800" textAnchor="middle">19.5%</text>

            <circle cx="260" cy="65" r="5" fill="#F97316" stroke="#1E1B18" strokeWidth="2" />
            <text x="260" y="50" fill="#F97316" fontSize="11" fontWeight="800" textAnchor="middle">21.8%</text>

            <circle cx="440" cy="30" r="5" fill="#F97316" stroke="#1E1B18" strokeWidth="2" />
            <text x="440" y="15" fill="#F97316" fontSize="11" fontWeight="800" textAnchor="middle">23.6%</text>

            {/* PAT Margin Line (Green) */}
            <polyline
              fill="none"
              stroke="#34D399"
              strokeWidth="3"
              strokeDasharray="6 3"
              strokeLinecap="round"
              points="80,120 260,110 440,90"
            />
            {/* PAT Points */}
            <circle cx="80" cy="120" r="4" fill="#34D399" stroke="#1E1B18" strokeWidth="2" />
            <text x="80" y="135" fill="#34D399" fontSize="10" fontWeight="700" textAnchor="middle">12.9%</text>

            <circle cx="260" cy="110" r="4" fill="#34D399" stroke="#1E1B18" strokeWidth="2" />
            <text x="260" y="125" fill="#34D399" fontSize="10" fontWeight="700" textAnchor="middle">13.6%</text>

            <circle cx="440" cy="90" r="4" fill="#34D399" stroke="#1E1B18" strokeWidth="2" />
            <text x="440" y="105" fill="#34D399" fontSize="10" fontWeight="700" textAnchor="middle">14.9%</text>
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '13px', fontWeight: 800, color: '#D6D3D1', borderTop: '1px solid #332F2B', paddingTop: '12px' }}>
          <span>FY23</span>
          <span>FY24</span>
          <span>FY25</span>
        </div>
      </div>

    </div>
  );
};
