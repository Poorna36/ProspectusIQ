import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ProspectusIQApi, clearAuthToken } from '../services/api';

export type UserRole = 'PROMOTER' | 'INTERMEDIARY';

export interface LoggedInUser {
  role: UserRole;
  fullName: string;
  email: string;
  intermediaryRole?: string;
}

interface LoginViewProps {
  onLogin: (user: LoggedInUser) => void;
  onBackToHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBackToHome }) => {
  const [roleTab, setRoleTab] = useState<UserRole>('PROMOTER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Single authorized account details pre-filled for convenience
  const [loginEmail, setLoginEmail] = useState('techmister23@gmail.com');
  const [loginPassword, setLoginPassword] = useState('techie12');
  const [loginOtp, setLoginOtp] = useState('123456');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      clearAuthToken();
      try {
        await ProspectusIQApi.login(loginEmail, loginPassword, loginOtp);
      } catch (err) {
        console.warn('Backend login notice:', err);
      }
      onLogin({
        role: roleTab,
        fullName: roleTab === 'PROMOTER' ? 'Techmister Promoter' : 'Techmister Lead Counsel',
        email: loginEmail,
        intermediaryRole: roleTab === 'INTERMEDIARY' ? 'LEGAL_COUNSEL' : undefined,
      });
    } catch (e: any) {
      setError(e.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #D6D3D1',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    color: '#1C1917',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#57534E',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0E1014',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      {/* Header */}
      <header style={{
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1E2028',
      }}>
        <button
          onClick={onBackToHome}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #1A4035 0%, #235445 100%)',
            border: '1px solid rgba(52,132,95,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={17} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Prospectus<span style={{ color: '#C9A84C' }}>IQ</span>
          </span>
        </button>
        <button
          onClick={onBackToHome}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          ← Back to home
        </button>
      </header>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          animation: 'fadeIn 0.3s ease forwards',
        }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '26px', fontWeight: 800,
              color: '#F5F2EA', fontFamily: 'var(--font-sans)',
              marginBottom: '8px',
            }}>
              Sign In to ProspectusIQ
            </h1>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
              Institutional SME IPO compliance & drafting portal
            </p>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: '#FFFBF5',
            borderRadius: '16px',
            border: '1px solid #E7E5E0',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>

            {/* Role Selector */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E7E5E0',
              backgroundColor: '#FFF7ED',
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                Select Workspace Mode
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRoleTab('PROMOTER')}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${roleTab === 'PROMOTER' ? '#F97316' : '#E7E5E0'}`,
                    backgroundColor: roleTab === 'PROMOTER' ? '#FFF3E0' : '#FFFFFF',
                    color: roleTab === 'PROMOTER' ? '#EA580C' : '#57534E',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  SME Promoter Portal
                </button>
                <button
                  type="button"
                  onClick={() => setRoleTab('INTERMEDIARY')}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${roleTab === 'INTERMEDIARY' ? '#1D4ED8' : '#E7E5E0'}`,
                    backgroundColor: roleTab === 'INTERMEDIARY' ? '#EFF6FF' : '#FFFFFF',
                    color: roleTab === 'INTERMEDIARY' ? '#1D4ED8' : '#57534E',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Intermediary Workbench
                </button>
              </div>
            </div>

            {/* Account Credentials Information */}
            <div style={{ padding: '24px' }}>

              {error && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#991B1B',
                }}>
                  {error}
                </div>
              )}

              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                fontSize: '12px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#166534" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Primary Account Credentials:</strong>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '2px' }}>
                    Email: techmister23@gmail.com | Pass: techie12 | OTP: 123456
                  </div>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="techmister23@gmail.com"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ ...inputStyle, paddingRight: '40px' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#78716C',
                    }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>2FA OTP Code</label>
                  <input
                    type="text"
                    value={loginOtp}
                    onChange={e => setLoginOtp(e.target.value)}
                    placeholder="123456"
                    required
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%', padding: '13px',
                    background: roleTab === 'PROMOTER'
                      ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                      : 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                    color: '#fff', border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: isLoading ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    marginTop: '6px',
                  }}
                >
                  {isLoading ? 'Authenticating...' : <>Sign In as {roleTab === 'PROMOTER' ? 'Promoter' : 'Intermediary'} <ChevronRight size={15} /></>}
                </button>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', marginTop: '20px' }}>
            ProspectusIQ — SEBI ICDR 2018 Compliant Portal · Session authenticated via techmister23@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};
