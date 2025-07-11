import React, { useState } from 'react';
import LogoSVG from '../logo.svg';

// Utility: deteksi mobile
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 700 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export default function MobileLogin({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-2">
      <div className="login-card" style={{ minWidth: 0, width: '100%', maxWidth: 360 }}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:24}}>
          <img src={LogoSVG} alt="Logo" style={{width:64,height:64}} />
        </div>
        <h2 className="login-title text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label" htmlFor="username">Username or Email</label>
          <input
            id="username"
            type="text"
            placeholder="Username or Email"
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <label className="login-label" htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3EC6DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.32 1.81-2.87 3.11-4.19M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3EC6DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
              )}
            </span>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-submit">Login</button>
        </form>
      </div>
    </div>
  );
} 