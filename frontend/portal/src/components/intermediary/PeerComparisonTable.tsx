import React from 'react';
import { PeerMetric } from '../../types';
import { Table, TrendingUp, HelpCircle, Layers } from 'lucide-react';

interface PeerComparisonTableProps {
  metrics: PeerMetric[];
}

export const PeerComparisonTable: React.FC<PeerComparisonTableProps> = ({ metrics }) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border-hairline)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-ink-obsidian)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-gold-primary)" /> Peer Group Valuation & Basis for Issue Price
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            Comparative evaluation against listed SME peers on NSE Emerge & BSE SME (SEBI ICDR Schedule VI).
          </p>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold-deep)', backgroundColor: 'var(--color-gold-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--color-gold-border)' }}>
          Editable Pricing Matrix
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--color-paper-bg)',
              borderBottom: '2px solid var(--color-border-hairline)',
              color: 'var(--color-ink-obsidian)',
              fontFamily: 'var(--font-serif)'
            }}>
              <th style={{ padding: '12px 16px' }}>Company Name</th>
              <th style={{ padding: '12px 16px' }}>Face Value (₹)</th>
              <th style={{ padding: '12px 16px' }}>P/E Ratio (x)</th>
              <th style={{ padding: '12px 16px' }}>RoNW (%)</th>
              <th style={{ padding: '12px 16px' }}>NAV per Share (₹)</th>
              <th style={{ padding: '12px 16px' }}>FY25 Revenue (₹ Cr)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row) => (
              <tr
                key={row.companyName}
                style={{
                  borderBottom: '1px solid var(--color-border-hairline)',
                  backgroundColor: row.isIssuer ? 'var(--color-gold-subtle)' : '#FFFFFF',
                  fontWeight: row.isIssuer ? 700 : 400
                }}
              >
                <td style={{ padding: '14px 16px', color: row.isIssuer ? 'var(--color-gold-deep)' : 'var(--color-ink-obsidian)' }}>
                  {row.companyName} {row.isIssuer && '⭐'}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹{row.faceValue}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{row.peRatio}x</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-cleared-green)' }}>{row.ronwPercent}%</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹{row.navPerShare.toFixed(2)}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>₹{row.revenueCr.toFixed(2)} Cr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '14px 16px', backgroundColor: 'var(--color-paper-bg)', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--color-border-hairline)', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
        💡 <strong>Basis for Issue Price Note:</strong> Issuer PE of 22.5x sits at a 15% discount to industry SME median (26.5x), justifying the target issue price band of ₹95-102 per share.
      </div>
    </div>
  );
};
