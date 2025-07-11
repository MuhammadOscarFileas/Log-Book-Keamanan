import React from 'react';
import '../App.css';
import LogoSVG from '../logo.svg';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../config';
import toast from 'react-hot-toast';

const cards = [
  { title: 'Buat Laporan', value: '', color: '#3EC6DF' },
  { title: 'Lihat Laporan Sebelumnya', value: '', color: '#A3C74A' },
];

export default function DashboardOfficer() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Cek first_login dari localStorage user
    const userStr = localStorage.getItem('user');
    let user = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch {}
    if (user && user.role === 'officer' && user.first_login) {
      setShowModal(true);
      setUserId(user.user_id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak sama');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/users/${userId}/password`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (!res.ok) throw new Error('Gagal update password');
      // Update localStorage agar first_login jadi false
      const userStr = localStorage.getItem('user');
      let user = null;
      try { user = userStr ? JSON.parse(userStr) : null; } catch {}
      if (user) {
        user.first_login = false;
        localStorage.setItem('user', JSON.stringify(user));
      }
      setShowModal(false);
      toast.success('Password berhasil diupdate!');
    } catch {
      setError('Gagal update password');
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar role="officer" />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard Officer</h2>
        <div className="dashboard-grid">
          <div
            className="dashboard-card"
            style={{ borderTop: '6px solid #A3C74A', cursor: 'pointer' }}
            onClick={() => navigate('/officer/laporan')}
          >
            <div className="card-logo-wrapper">
              <img src={LogoSVG} alt="logo" className="card-logo" />
            </div>
            <div className="card-content">
              <div className="card-title">Lihat Laporan Sebelumnya</div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal wajib update password saat first login */}
      {showModal && (
        <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.18)',zIndex:1002,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:'32px 28px',boxShadow:'0 2px 16px rgba(0,0,0,0.12)',minWidth:320,maxWidth:400}}>
            <h3 style={{marginBottom:18,color:'#27bcd4'}}>Update Password Baru</h3>
            <form onSubmit={handleSubmit}>
              <div style={{position:'relative',marginBottom:12}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password baru (min 6 karakter)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{width:'100%',padding:'10px 38px 10px 10px',borderRadius:8,border:'1.5px solid #d0e3ef',fontSize:16}}
                  disabled={loading}
                />
                <span
                  style={{position:'absolute',right:10,top:10,cursor:'pointer'}}
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
              <div style={{position:'relative',marginBottom:12}}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi password baru"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{width:'100%',padding:'10px 38px 10px 10px',borderRadius:8,border:'1.5px solid #d0e3ef',fontSize:16}}
                  disabled={loading}
                />
                <span
                  style={{position:'absolute',right:10,top:10,cursor:'pointer'}}
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={0}
                  role="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3EC6DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.32 1.81-2.87 3.11-4.19M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3EC6DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
                  )}
                </span>
              </div>
              {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
              <button
                type="submit"
                style={{width:'100%',background:'#27bcd4',color:'#fff',padding:'10px',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:loading?'not-allowed':'pointer'}}
                disabled={loading}
              >
                Simpan Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 