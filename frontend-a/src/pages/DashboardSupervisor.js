import React from 'react';
import '../App.css';
import LogoSVG from '../logo.svg';
import Sidebar from '../Sidebar';

const cards = [
  { title: 'Laporan Belum Ditandatangani', value: '-', color: '#F9B44D', highlight: true },
  { title: 'Laporan Lain', value: '-', color: '#3EC6DF', highlight: false },
];

export default function DashboardSupervisor() {
  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar role="supervisor" />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard Supervisor</h2>
        <div className="dashboard-grid">
          {cards.map((card) => (
            <div
              className="dashboard-card"
              key={card.title}
              style={{ borderTop: `6px solid ${card.color}`, boxShadow: card.highlight ? '0 0 0 3px #F9B44D55' : undefined }}
            >
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