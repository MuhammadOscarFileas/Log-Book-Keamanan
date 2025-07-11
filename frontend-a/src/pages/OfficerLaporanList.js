import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { getApiUrl, API_CONFIG } from '../config';

export default function OfficerLaporanList() {
  const [laporans, setLaporans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const namaLengkap = localStorage.getItem('nama_lengkap') || '';
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    toast.promise(
      fetch(getApiUrl(API_CONFIG.API_ENDPOINTS.LAPORAN), {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setLaporans(data);
          setLoading(false);
        }),
      {
        loading: 'Memuat data...',
        success: 'Data berhasil diambil!',
        error: 'Gagal terhubung server, coba lagi.'
      }
    );
    if (location.search.includes('success=1')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  }, [location.search]);

  // Filter: hanya laporan milik user login dan status draft/submit to supervisor
  const filtered = laporans.filter(lap => lap.user_pembuat === namaLengkap && (lap.status === 'draft' || lap.status === 'submit to supervisor'));
  const hasDraft = filtered.some(lap => lap.status === 'draft');

  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar role="officer" />
      <div style={{ flex: 1, padding: '40px 32px', background: '#f7fafd', minHeight: '100vh' }}>
        <style>{`
          @media (max-width: 900px) {
            .laporan-card-responsive {
              margin-left: 0 !important;
              max-width: 98vw !important;
              padding: 18px 6vw !important;
            }
            .sidebar-hamburger {
              position: fixed !important;
              left: 16px !important;
              top: 16px !important;
              z-index: 1002 !important;
            }
          }
          @media (max-width: 600px) {
            .laporan-card-responsive {
              padding: 10px 2vw !important;
            }
          }
        `}</style>
        <Toaster position="top-center" />
        <div className="laporan-card-responsive" style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          maxWidth: 1000,
          margin: '40px auto',
          padding: '32px 28px',
          marginLeft: 260,
        }}>
          <h2 style={{marginBottom: 16, color: '#27bcd4'}}>Daftar Laporan</h2>
          {showSuccess && <div style={{background:'#d4f7d4',color:'#207520',padding:'10px 16px',borderRadius:6,marginBottom:16}}>Laporan berhasil disimpan!</div>}
          <button
            style={{marginBottom:18,background:'#27bcd4',color:'#fff',padding:'10px 22px',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'0 1px 4px rgba(39,188,212,0.08)',transition:'background 0.2s',marginTop:4,marginRight:8}}
            onClick={() => {
              if (hasDraft) {
                toast.error('Laporan Kamu Masih ada draft');
              } else {
                navigate('/officer/laporan/buat');
              }
            }}
          >
            Buat Laporan
          </button>
          {/* Hanya tabel yang bisa discroll horizontal */}
          <div style={{overflowX:'auto'}}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Pos</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lap => (
                  <tr key={lap.laporan_id}>
                    <td>{lap.laporan_id}</td>
                    <td>{lap.date}</td>
                    <td>{lap.lokasi}</td>
                    <td>{lap.pos}</td>
                    <td>{lap.shift}</td>
                    <td>
                      {lap.status === 'draft' && <span className="status-badge status-draft">Draft</span>}
                      {lap.status === 'submit to supervisor' && <span className="status-badge status-submit">Submit to Supervisor</span>}
                      {lap.status === 'done' && <span className="status-badge status-done">Selesai</span>}
                    </td>
                    <td>
                      {lap.status === 'draft' && (
                        <button className="btn-aksi" onClick={() => navigate(`/officer/laporan/${lap.laporan_id}/edit`)}>Edit</button>
                      )}
                      <button className="btn-aksi" onClick={() => alert('Detail belum diimplementasi')}>Lihat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 