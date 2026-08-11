import React from 'react';
import { X, MessageSquare, Clock, Search, Paperclip, Send, ShieldCheck, User } from 'lucide-react';

interface GlobalDrawersProps {
  isMessagingOpen: boolean;
  isAuditOpen: boolean;
  onCloseMessaging: () => void;
  onCloseAudit: () => void;
}

export const GlobalDrawers: React.FC<GlobalDrawersProps> = ({
  isMessagingOpen,
  isAuditOpen,
  onCloseMessaging,
  onCloseAudit
}) => {

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9998,
    display: isMessagingOpen || isAuditOpen ? 'block' : 'none',
    transition: 'opacity 0.3s ease',
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '400px',
    backgroundColor: '#FFFFFF',
    boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // MOCK AUDIT DATA
  const auditLogs = [
    { time: '10:22 AM', actor: 'Lawyer', event: 'Applied Bronze Seal Lock (#A9762F) on Phase 1', hash: 'e3b0c442...' },
    { time: '10:15 AM', actor: 'Lawyer', event: 'Added inline clarification on Clause 3.2', hash: '8f434346...' },
    { time: '10:04 AM', actor: 'Rules Engine', event: 'Validated Vendor GSTIN 27AAACL1234F1Z9 (Active)', hash: 'a1b2c3d4...' },
    { time: '10:02 AM', actor: 'AI Engine', event: 'Synthesized Objects of Issue text (v1)', hash: 'f5e6d7c8...' },
    { time: '10:00 AM', actor: 'Promoter', event: 'Uploaded vendor quote: Vendor_Quote_Looms.png', hash: '99b2c3d4...' },
  ];

  return (
    <>
      <div style={overlayStyle} onClick={() => { onCloseMessaging(); onCloseAudit(); }} />
      
      {/* MESSAGING DRAWER */}
      <div style={{ ...drawerStyle, transform: isMessagingOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={18} color="#1D4ED8" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 800 }}>Workspace Messages</h3>
          </div>
          <button onClick={onCloseMessaging} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={18} color="#64748B" /></button>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Intermediary / Lead Counsel</span>
            <div style={{ backgroundColor: '#F1F5F9', padding: '12px 16px', borderRadius: '12px', borderBottomLeftRadius: '2px', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
              Hi Team, please clarify if the tax notice of ₹45 Lakhs includes penalty interest. We need this for the Risk Factors chapter.
            </div>
            <span style={{ fontSize: '10px', color: '#94A3B8', alignSelf: 'flex-start' }}>Today, 09:41 AM</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#F97316', textTransform: 'uppercase' }}>Promoter (You)</span>
            <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', padding: '12px 16px', borderRadius: '12px', borderBottomRightRadius: '2px', fontSize: '13px', color: '#9A3412', lineHeight: '1.5' }}>
              No, it does not include penalty interest. The principal demand is exactly ₹45 Lakhs. I've uploaded the notice in the Phase 7 notepad.
            </div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Today, 10:12 AM</span>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 12px' }}>
            <Paperclip size={16} color="#94A3B8" style={{ cursor: 'pointer', marginRight: '10px' }} />
            <input type="text" placeholder="Type a message..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px' }} />
            <button style={{ background: '#1D4ED8', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={14} color="#FFF" />
            </button>
          </div>
        </div>
      </div>

      {/* AUDIT TRAIL DRAWER */}
      <div style={{ ...drawerStyle, transform: isAuditOpen ? 'translateX(0)' : 'translateX(100%)', width: '450px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="#34D399" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Immutable Audit Trail</h3>
          </div>
          <button onClick={onCloseAudit} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={18} color="#94A3B8" /></button>
        </div>
        
        <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 12px' }}>
            <Search size={14} color="#94A3B8" style={{ marginRight: '8px' }} />
            <input type="text" placeholder="Filter by event, actor, or hash..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>TIME</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>ACTOR</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>EVENT</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{log.time}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#334155' }}>{log.actor}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', lineHeight: '1.4' }}>
                    {log.event}
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                      hash: {log.hash}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
