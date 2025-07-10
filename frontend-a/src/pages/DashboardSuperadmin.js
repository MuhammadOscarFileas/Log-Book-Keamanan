import React, { useEffect, useState } from 'react';
import '../App.css';
import LogoSVG from '../logo.svg';
import Sidebar from '../Sidebar';

const BASE_URL = "https://ad0d4e758a12.ngrok-free.app";

export default function DashboardSuperadmin() {
  const [userCounts, setUserCounts] = useState({ officer: 0, supervisor: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/users/role-counts`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUserCounts({ officer: data.officer || 0, supervisor: data.supervisor || 0 });
      })
      .catch(() => setUserCounts({ officer: 0, supervisor: 0 }));
  }, []);

  const cards = [
    { title: 'Supervisor', value: userCounts.supervisor, color: '#F47C6D' },
    { title: 'Officer', value: userCounts.officer, color: '#3EC6DF' },
    { title: 'Laporan', value: '-', color: '#A3C74A' },
    { title: 'Belum Ditandatangani', value: '-', color: '#F9B44D' },
  ];

  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar role="superadmin" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="dashboard-container" style={{marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.2s'}}>
        <h2 className="dashboard-title">Dashboard Superadmin</h2>
        <div className="dashboard-grid">
          {cards.map((card) => (
            <div className="dashboard-card" key={card.title} style={{ borderTop: `6px solid ${card.color}` }}>
              <div className="card-logo-wrapper">
                <img src={LogoSVG} alt="logo" className="card-logo" />
              </div>
              <div className="card-content">
                <div className="card-value">{card.value}</div>
                <div className="card-title">{card.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 