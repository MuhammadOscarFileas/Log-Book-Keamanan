import React from 'react';
import '../App.css';
import LogoSVG from '../logo.svg';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';

const cards = [
  { title: 'Buat Laporan', value: '', color: '#3EC6DF' },
  { title: 'Lihat Laporan Sebelumnya', value: '', color: '#A3C74A' },
];

export default function DashboardOfficer() {
  const navigate = useNavigate();
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
    </div>
  );
} 