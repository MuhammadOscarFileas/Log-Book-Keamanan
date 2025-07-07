import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const ViewReport = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const [activities, setActivities] = useState([]);
  const [inventaris, setInventaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lapRes = await axiosInstance.get(`/api/laporan/${id}`);
        setLaporan(lapRes.data);
        const actRes = await axiosInstance.get('/api/kegiatan');
        setActivities(actRes.data.filter(a => a.laporan_id === Number(id)));
        const invInputRes = await axiosInstance.get('/api/inventarisInput');
        const invInputs = invInputRes.data.filter(i => i.laporan_id === Number(id));
        const invRes = await axiosInstance.get('/api/inventaris');
        setInventaris(invInputs.map(ii => ({
          nama_barang: invRes.data.find(inv => inv.inventaris_id === ii.inventaris_id)?.nama_barang || '',
          jumlah: ii.jumlah,
        })));
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!laporan) return <div className="p-4 text-red-500">{error || 'Laporan tidak ditemukan'}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Detail Laporan</h2>
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="mb-2">Tanggal: <span className="font-medium">{laporan.date}</span></div>
        <div className="mb-2">Lokasi: <span className="font-medium">{laporan.lokasi}</span></div>
        <div className="mb-2">Pos: <span className="font-medium">{laporan.pos}</span></div>
        <div className="mb-2">Shift: <span className="font-medium">{laporan.shift}</span></div>
        <div className="mb-2">Status: <span className="font-medium">{laporan.status}</span></div>
        <div className="mb-2">Officer: <span className="font-medium">{laporan.user_pembuat}</span></div>
        {laporan.user_supervisor && <div className="mb-2">Supervisor: <span className="font-medium">{laporan.user_supervisor}</span></div>}
      </div>
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="font-semibold mb-2">Kegiatan</h3>
        {activities.length === 0 ? <div className="text-gray-500">Tidak ada kegiatan.</div> : (
          <ul className="list-disc pl-5">
            {activities.map(act => (
              <li key={act.kegiatan_id} className="mb-1">
                <span className="font-medium">{act.kegiatan}</span> ({act.jam_mulai} - {act.jam_selesai}) {act.keterangan && <span>- {act.keterangan}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Inventaris</h3>
        {inventaris.length === 0 ? <div className="text-gray-500">Tidak ada inventaris.</div> : (
          <ul className="list-disc pl-5">
            {inventaris.map((inv, idx) => (
              <li key={idx}>{inv.nama_barang} - {inv.jumlah}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewReport; 