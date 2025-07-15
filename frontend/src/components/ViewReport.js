import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';
import SignaturePad from './SignaturePad';

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const [activities, setActivities] = useState([]);
  const [inventaris, setInventaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signatureSupervisor, setSignatureSupervisor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lapRes = await axiosInstance.get(`/api/laporan/${id}`);
        setLaporan(lapRes.data);
        const actRes = await axiosInstance.get('/api/kegiatan');
        setActivities(actRes.data.filter(a => a.laporan_id === Number(id)));
        const invInputRes = await axiosInstance.get('/api/inventaris-input');
        const invInputs = invInputRes.data.filter(i => i.laporan_id === Number(id));
        setInventaris(invInputs.map(ii => ({
          nama_barang: ii.nama_barang,
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

  const handleApprove = async () => {
    if (!signatureSupervisor) {
      setError('Tanda tangan supervisor wajib diisi');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await axiosInstance.put(`/api/laporan/${id}`, {
        status: 'done',
        ttd_supervisor: signatureSupervisor
      });
      
      // Refresh data
      const lapRes = await axiosInstance.get(`/api/laporan/${id}`);
      setLaporan(lapRes.data);
      
      alert('Laporan berhasil disetujui!');
      navigate('/dashboard/supervisor');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyetujui laporan');
    } finally {
      setSubmitting(false);
    }
  };

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
      
      {/* Signature Display */}
      <div className="bg-white rounded shadow p-4 mt-4">
        <h3 className="font-semibold mb-3">Tanda Tangan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signature Pembuat */}
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-600">Pembuat</label>
            {laporan.ttd_pembuat ? (
              <div className="border rounded p-2 bg-gray-50">
                <img 
                  src={laporan.ttd_pembuat} 
                  alt="Tanda tangan pembuat" 
                  className="w-full h-20 object-contain"
                />
                <div className="text-center mt-1 text-xs text-gray-600">{laporan.user_pembuat}</div>
              </div>
            ) : (
              <div className="border rounded p-2 bg-gray-50 text-center text-gray-400 text-sm">
                Belum ada tanda tangan
              </div>
            )}
          </div>
          
          {/* Signature Penerima */}
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-600">Penerima</label>
            {laporan.ttd_penerima ? (
              <div className="border rounded p-2 bg-gray-50">
                <img 
                  src={laporan.ttd_penerima} 
                  alt="Tanda tangan penerima" 
                  className="w-full h-20 object-contain"
                />
                <div className="text-center mt-1 text-xs text-gray-600">{laporan.user_penerima}</div>
              </div>
            ) : (
              <div className="border rounded p-2 bg-gray-50 text-center text-gray-400 text-sm">
                Belum ada tanda tangan
              </div>
            )}
          </div>
          
          {/* Tanda Tangan Supervisor */}
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-600">Supervisor</label>
            {laporan.ttd_supervisor ? (
              <div className="border rounded p-2 bg-gray-50">
                <img 
                  src={laporan.ttd_supervisor} 
                  alt="Tanda tangan supervisor" 
                  className="w-full h-20 object-contain"
                />
                <div className="text-center mt-1 text-xs text-gray-600">{laporan.user_supervisor}</div>
              </div>
            ) : (
              <div className="border rounded p-2 bg-gray-50 text-center text-gray-400 text-sm">
                Belum ada tanda tangan
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Supervisor Approval Section - Hanya tampil saat status submit to supervisor */}
      {auth.user.role === 'supervisor' && laporan.status === 'submit to supervisor' && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="font-semibold mb-3 text-green-700">Persetujuan Supervisor</h3>
          <div className="mb-4">
            <label className="block font-medium mb-2 text-sm text-gray-600">Tanda Tangan Supervisor</label>
            <SignaturePad
              onSignatureChange={setSignatureSupervisor}
              placeholder="Tanda tangan supervisor untuk menyetujui laporan"
              width={280}
              height={100}
              disabled={false} // Supervisor bisa tanda tangan saat status submit to supervisor
            />
            <div className="text-center mt-2 text-sm font-medium text-gray-700">
              {auth.user.nama_lengkap}
            </div>
          </div>
          
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          
          <button
            onClick={handleApprove}
            disabled={submitting || !signatureSupervisor}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menyetujui...' : 'Setujui Laporan'}
          </button>
          <div className="text-sm text-gray-500 mt-2">
            * Supervisor hanya dapat menandatangani laporan dengan status "submit to supervisor"
          </div>
        </div>
      )}
      
      {/* Informasi untuk supervisor jika status bukan submit to supervisor */}
      {auth.user.role === 'supervisor' && laporan.status !== 'submit to supervisor' && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <div className="text-center text-gray-500">
            {laporan.status === 'draft' ? (
              <p>Laporan masih dalam status draft. Tunggu hingga officer mengirimkan laporan untuk persetujuan.</p>
            ) : laporan.status === 'done' ? (
              <p>Laporan sudah disetujui dan selesai.</p>
            ) : (
              <p>Status laporan: {laporan.status}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReport; 