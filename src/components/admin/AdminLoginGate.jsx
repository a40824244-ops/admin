import { useState } from 'react';
import AdminPanel from '../AdminPanel';
import { api } from '../../services/api';

export default function AdminLoginGate({ onExit }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(password);
      if (res.success) {
        if (res.token) {
          localStorage.setItem('aurex_admin_token', res.token);
        }
        setAuthed(true);
        return;
      } else {
        setError(res.detail || 'Incorrect password. Access denied.');
        setPassword('');
        return;
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to connect to the admin service.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  if (authed) {
    return <AdminPanel onExit={onExit} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#1a1c1b', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 60%)' }}
    >
      {/* Back Button */}
      <button
        onClick={onExit}
        className="fixed top-5 left-5 flex items-center gap-2 text-xs tracking-widest transition-opacity hover:opacity-70 cursor-pointer"
        style={{ color: '#9ca3af', fontFamily: 'Montserrat, sans-serif' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        RETURN TO STORE
      </button>

      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-4"
            style={{ border: '1px solid #c5a059' }}
          >
            <span style={{ color: '#dfba67', fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700 }}>A</span>
          </div>
          <h1 style={{ color: '#dfba67', fontFamily: 'Playfair Display, serif', fontSize: '22px', letterSpacing: '0.15em', fontWeight: 700 }}>
            AUREX
          </h1>
          <p style={{ color: '#9ca3af', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', marginTop: '4px' }}>
            PRIVATE ADMIN ACCESS
          </p>
        </div>

        {/* Login Card */}
        <div className="border p-8" style={{ borderColor: 'rgba(197,160,89,0.3)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="mb-6">
            <div className="w-8 h-px mx-auto mb-4" style={{ background: '#c5a059' }} />
            <p className="text-center text-xs tracking-widest" style={{ color: '#9ca3af', fontFamily: 'Montserrat, sans-serif' }}>
              SECURE LOGIN
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-2 tracking-widest" style={{ color: '#9ca3af', fontFamily: 'Montserrat, sans-serif' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 text-sm outline-none pr-10"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: error ? '1px solid #f87171' : '1px solid rgba(197,160,89,0.4)',
                    color: '#f5f0e8',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: '#6b7280' }}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" strokeLinecap="round" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" strokeLinecap="round" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-xs mt-2" style={{ color: '#f87171', fontFamily: 'Montserrat, sans-serif' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-bold tracking-widest transition-opacity hover:opacity-90 mt-2 cursor-pointer disabled:opacity-50"
              style={{ background: '#c5a059', color: '#1a1c1b', fontFamily: 'Montserrat, sans-serif' }}
            >
              {loading ? 'VERIFYING...' : 'ACCESS PANEL'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#4b5563', fontFamily: 'Montserrat, sans-serif' }}>
              Restricted to authorized personnel only
            </p>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center gap-3 justify-center">
            <div className="flex-1 h-px" style={{ background: 'rgba(197,160,89,0.2)' }} />
            <span className="text-xs" style={{ color: '#4b5563', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em' }}>AUREX © 2026</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(197,160,89,0.2)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
