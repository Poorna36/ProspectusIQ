import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, BarChart3, PieChart, DollarSign } from 'lucide-react';

export const FinancialsVizPanel: React.FC = () => {
  const financialMetrics = [
    { year: 'FY23', revenue: 1240.50, ebitda: 210.30, pat: 142.10, margin: 16.9 },
    { year: 'FY24', revenue: 2480.00, ebitda: 485.60, pat: 320.40, margin: 19.5 },
    { year: 'FY25', revenue: 4150.20, ebitda: 980.10, pat: 690.80, margin: 23.6 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border-hairline)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)' }}>
            Financial Visualization & Anomaly Engine
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Restated Financials analysis for Nexus AI Solutions Private Limited (in ₹ Lakhs).
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-cleared-bg)',
          border: '1px solid var(--color-cleared-border)',
          color: 'var(--color-cleared-green)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-sharp)',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <CheckCircle size={16} /> SEBI Financial Ratios Validated
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border-hairline)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>FY25 Revenue</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-mono)' }}>
            ₹4,150.20 L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-cleared-green)', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> +67.3% YoY Growth
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border-hairline)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>FY25 EBITDA Margin</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-gold-deep)', fontFamily: 'var(--font-mono)' }}>
            23.6%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-cleared-green)', marginTop: '4px', fontWeight: 600 }}>
            +410 bps vs FY24
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border-hairline)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>FY25 Profit After Tax (PAT)</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-mono)' }}>
            ₹690.80 L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-cleared-green)', marginTop: '4px', fontWeight: 600 }}>
            PAT Margin: 16.6%
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border-hairline)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>Return on Net Worth (RoNW)</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-gold-primary)', fontFamily: 'var(--font-mono)' }}>
            24.6%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            NSE Emerge Peer Avg: 22.3%
          </div>
        </div>
      </div>

      {/* Bar Chart Visualizer */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border-hairline)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '16px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--color-gold-primary)" /> 3-Year Historical Growth Progression (₹ Lakhs)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'flex-end', height: '220px', padding: '20px 0', borderBottom: '1px solid var(--color-border-hairline)' }}>
          {financialMetrics.map((m) => {
            const heightPercent = (m.revenue / 4150.20) * 100;
            return (
              <div key={m.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-mono)' }}>
                  ₹{m.revenue.toFixed(1)}L
                </div>

                <div style={{
                  width: '60px',
                  height: `${heightPercent}%`,
                  background: 'linear-gradient(180deg, var(--color-gold-bright) 0%, var(--color-gold-primary) 100%)',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-obsidian)' }}>
                  {m.year}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rules Engine Anomaly Card */}
        <div style={{
          marginTop: '20px',
          backgroundColor: 'var(--color-flag-bg)',
          border: '1px solid var(--color-flag-border)',
          borderRadius: 'var(--radius-sharp)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px'
        }}>
          <AlertTriangle size={20} color="var(--color-flag-amber)" />
          <div>
            <strong style={{ color: 'var(--color-flag-amber)' }}>Stage 2 Hardcoded Rules Engine Notice:</strong>
            <span style={{ color: 'var(--color-ink-obsidian)', marginLeft: '6px' }}>
              Ensure ₹18.5 Lakhs ESOP non-cash provision is explicitly stated as an footnote under Restated Summary to satisfy SEBI ICDR Schedule VI guidelines.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
