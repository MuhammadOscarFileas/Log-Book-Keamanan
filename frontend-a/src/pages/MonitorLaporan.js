import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { getApiUrl } from '../config';
import toast from 'react-hot-toast';

export default function MonitorLaporan() {
  const [laporans, setLaporans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLaporan = async () => {
      setLoading(true);
      try {
        await toast.promise(
          fetch(getApiUrl('/api/laporan/non-draft'), { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                setLaporans(data);
                setError('');
              } else {
                setLaporans([]);
                setError('Data laporan tidak valid');
              }
            }),
          {
            loading: 'Memuat data...',
            success: 'Data berhasil diambil!',
            error: 'Gagal terhubung server, coba lagi.'
          }
        );
      } catch (e) {
        setError('Gagal terhubung server, coba lagi.');
      }
      setLoading(false);
    };
    fetchLaporan();
  }, []);

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#f7fafd'}}>
      <Sidebar role="superadmin" />
      <div className="dashboard-container" style={{marginLeft: 260, transition: 'margin-left 0.2s', width:'100%'}}>
        <h2 className="dashboard-title">Monitor Laporan</h2>
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 16px rgba(0,0,0,0.07)', maxWidth:1100, margin:'40px auto', padding:'32px 28px'}}>
          {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
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
                    <th>Pembuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporans.map(lap => (
                    <tr key={lap.laporan_id}>
                      <td>{lap.laporan_id}</td>
                      <td>{lap.date}</td>
                      <td>{lap.lokasi}</td>
                      <td>{lap.pos}</td>
                      <td>{lap.shift}</td>
                      <td>{lap.status}</td>
                      <td>{lap.user_pembuat}</td>
                      <td>
                        <button className="btn-aksi" onClick={() => alert('Detail laporan belum diimplementasi')}>Lihat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 