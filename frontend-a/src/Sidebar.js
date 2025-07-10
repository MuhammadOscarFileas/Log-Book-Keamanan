import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

export default function Sidebar({ role }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menu = {
    superadmin: [
      { label: 'Dashboard', to: '/dashboard-superadmin' },
      { label: 'Manage Akun', to: '/manage-akun' },
      { label: 'Monitor Laporan', to: '/monitor-laporan' },
    ],
    supervisor: [
      { label: 'Dashboard', to: '/dashboard-supervisor' },
      { label: 'Lihat Laporan', to: '/lihat-laporan-supervisor' },
    ],
    officer: [
      { label: 'Dashboard', to: '/dashboard-officer' },
      { label: 'Laporan', to: '/officer/laporan' },
    ],
  };
  const namaLengkap = localStorage.getItem('nama_lengkap') || 'User';
  const roleLabel = {
    superadmin: 'Superadmin',
    supervisor: 'Supervisor',
    officer: 'Officer',
  };
  const roleIcon = {
    superadmin: '/superadmin.svg',
    supervisor: '/supervisor.svg',
    officer: '/officer.svg',
  };
  const roleBadgeClass = {
    superadmin: 'role-badge role-superadmin',
    supervisor: 'role-badge role-supervisor',
    officer: 'role-badge role-officer',
  };

  // Close sidebar on menu click (mobile)
  const handleMenuClick = () => setOpen(false);

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        <span className={open ? 'bar open' : 'bar'}></span>
        <span className={open ? 'bar open' : 'bar'}></span>
        <span className={open ? 'bar open' : 'bar'}></span>
      </button>
      <nav className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-title">Menu</div>
        <div className="sidebar-greeting" style={{margin:'0 0 8px 0', fontWeight:600, color:'#3EC6DF', fontSize:'1.1em'}}>Halo, {namaLengkap}</div>
        <div style={{marginBottom:18}}>
          <span className={roleBadgeClass[role]}>
            <img src={roleIcon[role]} alt={roleLabel[role]} style={{width:22, height:22, verticalAlign:'middle'}} />
            {roleLabel[role]}
          </span>
        </div>
        <ul>
          {menu[role].map((item) => (
            <li key={item.to} className={location.pathname === item.to ? 'active' : ''}>
              <Link to={item.to} onClick={handleMenuClick}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <button className="btn-logout" onClick={() => window.location.href = '/'}>Logout</button>
      </nav>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
} 