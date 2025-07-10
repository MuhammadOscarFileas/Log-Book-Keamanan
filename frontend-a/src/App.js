import React, { useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardSuperadmin from './pages/DashboardSuperadmin';
import DashboardSupervisor from './pages/DashboardSupervisor';
import DashboardOfficer from './pages/DashboardOfficer';
import NotFound from './pages/NotFound';
import ManageAkun from './pages/ManageAkun';

const BASE_URL = "https://ad0d4e758a12.ngrok-free.app";

function LoginCard({ onForget, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");
      onLogin(data.user); // kirim user ke parent
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Sign In</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="login-label" htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
      <button className="forget-btn" onClick={onForget}>Forget Password?</button>
    </div>
  );
}

function WelcomeLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [swipe, setSwipe] = useState(false);
  const navigate = useNavigate();

  const handleMasuk = () => {
    setSwipe(true);
    setTimeout(() => setShowLogin(true), 600);
  };

  const handleForget = () => {
    setShowLogin(false);
    setTimeout(() => setSwipe(false), 10);
  };

  // Login: redirect ke dashboard sesuai role
  const handleLogin = (user) => {
    if (!user || !user.role) return;
    // Simpan nama lengkap ke localStorage untuk sidebar
    localStorage.setItem('nama_lengkap', user.nama_lengkap || 'User');
    if (user.role === "superadmin") navigate("/dashboard-superadmin");
    else if (user.role === "supervisor") navigate("/dashboard-supervisor");
    else navigate("/dashboard-officer");
  };

  
  return (
    <div className="App">
      <video autoPlay loop muted className="bg-video">
        <source src="/profile.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className={`overlay-content${swipe ? ' swipe-left' : ''}${showLogin ? ' hide' : ''}`}
        style={{ display: showLogin ? 'none' : 'flex' }}>
        <h1 className="main-title">Airport Log Book System</h1>
        <h2 className="subtitle">Yogyakarta International Airport</h2>
        <button className="login-btn" onClick={handleMasuk}>Masuk</button>
      </div>
      {showLogin && (
        <div className="login-card-wrapper">
          {/* Pass handleLogin ke onLogin prop */}
          <LoginCard onForget={handleForget} onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

// Placeholder imports
const OfficerLaporanForm = React.lazy(() => import('./pages/OfficerLaporanForm'));
const OfficerLaporanList = React.lazy(() => import('./pages/OfficerLaporanList'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeLogin />} />
      <Route path="/dashboard-superadmin" element={<DashboardSuperadmin />} />
      <Route path="/dashboard-supervisor" element={<DashboardSupervisor />} />
      <Route path="/dashboard-officer" element={<DashboardOfficer />} />
      <Route path="/manage-akun" element={<ManageAkun />} />
      <Route path="/officer" element={<DashboardOfficer />} />
      <Route path="/officer/laporan" element={<React.Suspense fallback={<div>Loading...</div>}><OfficerLaporanList /></React.Suspense>} />
      <Route path="/officer/laporan/buat" element={<React.Suspense fallback={<div>Loading...</div>}><OfficerLaporanForm mode="create" /></React.Suspense>} />
      <Route path="/officer/laporan/:id/edit" element={<React.Suspense fallback={<div>Loading...</div>}><OfficerLaporanForm mode="edit" /></React.Suspense>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
