import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function OfficerLaporanList() {
  const [laporans, setLaporans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const namaLengkap = localStorage.getItem('nama_lengkap') || '';
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch('https://ad0d4e758a12.ngrok-free.app/api/laporan', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setLaporans(data);
        setLoading(false);
      });
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
      <div className="laporan-list-container">
        <Toaster position="top-center" />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2>Daftar Laporan</h2>
            {showSuccess && <div style={{background:'#d4f7d4',color:'#207520',padding:'10px 16px',borderRadius:6,marginBottom:16}}>Laporan berhasil disimpan!</div>}
            <button
              style={{marginBottom:18}}
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
            {/* Tombol kembali ke dashboard dihapus, navigasi lewat sidebar */}
          </>
        )}
      </div>
    </div>
  );
} 