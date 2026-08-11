import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const config = {
    info: { icon: <Info size={20} color="#3B82F6" />, bg: '#EFF6FF', border: '#BFDBFE', text: '#1E3A8A' },
    success: { icon: <CheckCircle2 size={20} color="#10B981" />, bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
    warning: { icon: <AlertCircle size={20} color="#F59E0B" />, bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    error: { icon: <AlertCircle size={20} color="#EF4444" />, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  }[toast.type];

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '24px',
      zIndex: 9999,
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      width: '320px',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ marginTop: '2px' }}>{config.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: config.text, marginBottom: '4px' }}>{toast.title}</div>
        <div style={{ fontSize: '12px', color: config.text, opacity: 0.85, lineHeight: '1.4' }}>{toast.message}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <X size={16} color={config.text} style={{ opacity: 0.5 }} />
      </button>
    </div>
  );
};
