'use client';

/**
 * /admin/login — 2026 Industrial Luxury Theme
 * Elevated Administrative Authentication Gateway matching the QCFI Landing Page aesthetic:
 *  - Blueprint mesh & ambient radial aura background
 *  - Fixed top-left EliteBackBtn ("Back to Hub")
 *  - Central Glassmorphism Security Terminal
 *  - Glowing QCFI Emblem with active pulse dot
 *  - Manrope + Playfair Display typography
 *  - Industrial input fields with security icons & password visibility toggle
 *  - Elite Authenticate button with animated direction arrow & loading state
 *  - Full keyboard access, instant validation, and security compliance watermark
 */

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EliteBackBtn from '@/app/components/EliteBackBtn';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid Credentials. Please verify operator ID and cipher.');
      }
    } catch {
      setError('Network communication failure. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-viewport">
      {/* Return to Hub */}
      <EliteBackBtn href="/" label="Return to Hub" />

      {/* Ambient background aura */}
      <div className="admin-login-aura" />

      {/* Central Security Terminal Card */}
      <div className="admin-terminal-card">
        {/* Terminal Header */}
        <div className="admin-terminal-header">
          <div className="admin-emblem-badge">
            <div className="admin-emblem-ring" />
            <Image src="/logo.png" alt="QCFI Emblem" width={48} height={48} priority />
            <span className="admin-status-dot" title="Gateway Active" />
          </div>

          <div className="admin-terminal-meta">
            <span className="eyebrow eyebrow-center">[ SYSTEM GATEWAY // SEC-01 ]</span>
            <h1 className="admin-terminal-title">
              Administrative <span className="serif-italic">Terminal.</span>
            </h1>
            <p className="admin-terminal-subtitle">
              Authorize operator session to access institutional control &amp; content management matrices.
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="admin-alert-box" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="admin-terminal-form">
          <div className="admin-field-group">
            <label htmlFor="login_id" className="admin-field-label">
              <span>01 // OPERATOR ID</span>
              <span className="admin-label-hint">REQUIRED</span>
            </label>
            <div className="admin-input-wrapper">
              <div className="admin-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                id="login_id"
                name="login_id"
                required
                placeholder="Enter Operator ID (qcfi.in)"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={loading}
                autoComplete="username"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-field-group">
            <label htmlFor="password" className="admin-field-label">
              <span>02 // SECURITY CIPHER</span>
              <span className="admin-label-hint">ENCRYPTED</span>
            </label>
            <div className="admin-input-wrapper">
              <div className="admin-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                className="admin-input"
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="admin-btn-spinner" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Authorize Access</span>
                <div className="btn-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </>
            )}
          </button>
        </form>

        {/* Security Compliance Footer */}
        <div className="admin-terminal-footer">
          <div className="security-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>256-BIT ENCRYPTED // ZERO-TRUST SESSION MATRIX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
