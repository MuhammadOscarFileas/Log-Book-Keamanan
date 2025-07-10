import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const initialLaporan = {
  date: '',
  lokasi: '',
  pos: '',
  shift: 'pagi',
};

const AddLogBook = () => {
  const { auth } = useAuth();
  const [laporan, setLaporan] = useState(initialLaporan);
  const [activities, setActivities] = useState([{ kegiatan: '', jam_mulai: '', jam_selesai: '', keterangan: '' }]);
  const [inventaris, setInventaris] = useState([{ nama_barang: '', jumlah: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLaporanChange = e => {
    setLaporan({ ...laporan, [e.target.name]: e.target.value });
  };

  const handleActivityChange = (idx, e) => {
    const newActs = [...activities];
    newActs[idx][e.target.name] = e.target.value;
    setActivities(newActs);
  };

  const handleInventarisChange = (idx, e) => {
    const newInv = [...inventaris];
    newInv[idx][e.target.name] = e.target.value;
    setInventaris(newInv);
  };

  const addActivity = () => setActivities([...activities, { kegiatan: '', jam_mulai: '', jam_selesai: '', keterangan: '' }]);
  const removeActivity = idx => setActivities(activities.filter((_, i) => i !== idx));

  const addInventaris = () => setInventaris([...inventaris, { nama_barang: '', jumlah: 1 }]);
  const removeInventaris = idx => setInventaris(inventaris.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Create laporan
      const laporanRes = await axiosInstance.post('/api/laporan', {
        ...laporan,
        user_pembuat: auth.user.nama_lengkap,
        status: 'draft',
      });
      const laporan_id = laporanRes.data.laporan_id;
      // 2. Create activities
      for (const act of activities) {
        await axiosInstance.post('/api/kegiatan', { ...act, laporan_id });
      }
      // 3. Create inventaris (if needed, create inventaris first, then inventaris_input)
      for (const inv of inventaris) {
        // Create inventaris if not exists (simple: always create)
        const invRes = await axiosInstance.post('/api/inventaris', { nama_barang: inv.nama_barang });
        const inventaris_id = invRes.data.inventaris_id;
        await axiosInstance.post('/api/inventaris-input', { laporan_id, inventaris_id, jumlah: inv.jumlah });
      }
      navigate('/dashboard/officer');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Buat Laporan Baru</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="date" value={laporan.date} onChange={handleLaporanChange} required type="date" className="border px-3 py-2 rounded" />
          <input name="lokasi" value={laporan.lokasi} onChange={handleLaporanChange} required placeholder="Lokasi" className="border px-3 py-2 rounded" />
          <input name="pos" value={laporan.pos} onChange={handleLaporanChange} required placeholder="Pos" className="border px-3 py-2 rounded" />
          <select name="shift" value={laporan.shift} onChange={handleLaporanChange} className="border px-3 py-2 rounded">
            <option value="pagi">Pagi</option>
            <option value="siang">Siang</option>
            <option value="malam">Malam</option>
          </select>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Kegiatan</h3>
          {activities.map((act, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <input name="kegiatan" value={act.kegiatan} onChange={e => handleActivityChange(idx, e)} required placeholder="Kegiatan" className="border px-3 py-2 rounded flex-1" />
              <input name="jam_mulai" value={act.jam_mulai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
              <input name="jam_selesai" value={act.jam_selesai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
              <input name="keterangan" value={act.keterangan} onChange={e => handleActivityChange(idx, e)} placeholder="Keterangan" className="border px-3 py-2 rounded flex-1" />
              {activities.length > 1 && <button type="button" onClick={() => removeActivity(idx)} className="text-red-500">Hapus</button>}
            </div>
          ))}
          <button type="button" onClick={addActivity} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Kegiatan</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Inventaris</h3>
          {inventaris.map((inv, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <input name="nama_barang" value={inv.nama_barang} onChange={e => handleInventarisChange(idx, e)} required placeholder="Nama Barang" className="border px-3 py-2 rounded flex-1" />
              <input name="jumlah" value={inv.jumlah} onChange={e => handleInventarisChange(idx, e)} required type="number" min="1" className="border px-3 py-2 rounded w-24" />
              {inventaris.length > 1 && <button type="button" onClick={() => removeInventaris(idx)} className="text-red-500">Hapus</button>}
            </div>
          ))}
          <button type="button" onClick={addInventaris} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Inventaris</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Laporan'}
        </button>
      </form>
    </div>
  );
};

export default AddLogBook; 