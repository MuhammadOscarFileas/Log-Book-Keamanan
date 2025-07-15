import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';
import SignaturePad from './SignaturePad';

const initialLaporan = {
  date: '',
  lokasi: '',
  pos: '',
  shift: 'pagi',
  user_penerima: '',
  user_supervisor: '',
};

const AddLogBook = () => {
  const { auth } = useAuth();
  const [laporan, setLaporan] = useState(initialLaporan);
  const [activities, setActivities] = useState([{ kegiatan: '', jam_mulai: '', jam_selesai: '', keterangan: '' }]);
  const [inventaris, setInventaris] = useState([{ nama_barang: '', jumlah: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [showSubmittedPopup, setShowSubmittedPopup] = useState(false);
  const [showAlreadySubmittedPopup, setShowAlreadySubmittedPopup] = useState(false);
  const [signaturePembuat, setSignaturePembuat] = useState('');
  const [signaturePenerima, setSignaturePenerima] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [officerRes, supervisorRes] = await Promise.all([
          axiosInstance.get('/api/users?role=officer'),
          axiosInstance.get('/api/users?role=supervisor'),
        ]);
        setOfficers(officerRes.data.filter(u => u.nama_lengkap !== auth.user.nama_lengkap));
        setSupervisors(supervisorRes.data);
      } catch (err) {
        setOfficers([]);
        setSupervisors([]);
      }
    };
    fetchUsers();
  }, [auth.user.nama_lengkap]);

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

  const handleSave = async (e, submit = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validasi signature jika submit (hanya saat status draft)
    if (submit) {
      if (!signaturePembuat) {
        setError('Tanda tangan pembuat wajib diisi');
        setLoading(false);
        return;
      }
      if (!signaturePenerima) {
        setError('Tanda tangan penerima wajib diisi');
        setLoading(false);
        return;
      }
    }
    
    try {
      // 1. Create laporan (selalu status draft dulu)
      const laporanRes = await axiosInstance.post('/api/laporan', {
        ...laporan,
        user_pembuat: auth.user.nama_lengkap,
        status: 'draft',
        ttd_pembuat: signaturePembuat,
        ttd_penerima: signaturePenerima,
      });
      const laporan_id = laporanRes.data.laporan_id;
      // 2. Create activities
      for (const act of activities) {
        await axiosInstance.post('/api/kegiatan', { ...act, laporan_id });
      }
      // 3. Create inventaris
      for (const inv of inventaris) {
        await axiosInstance.post('/api/inventaris-input', {
          laporan_id,
          nama_barang: inv.nama_barang,
          jumlah: inv.jumlah
        });
      }
      // 4. Jika submit, cek status dulu
      if (submit) {
        // Ambil data laporan terbaru
        const latestLaporan = await axiosInstance.get(`/api/laporan/${laporan_id}`);
        if (latestLaporan.data.status === 'submit to supervisor') {
          setShowAlreadySubmittedPopup(true);
          setTimeout(() => {
            setShowAlreadySubmittedPopup(false);
            navigate('/dashboard/officer');
          }, 2000);
          return;
        }
        await axiosInstance.put(`/api/laporan/${laporan_id}`, { 
          status: 'submit to supervisor',
          ttd_pembuat: signaturePembuat,
          ttd_penerima: signaturePenerima,
        });
        setShowSubmittedPopup(true);
        setTimeout(() => {
          setShowSubmittedPopup(false);
          navigate('/dashboard/officer');
        }, 2000);
        return;
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
      <form onSubmit={e => handleSave(e, false)} className="bg-white rounded shadow p-4 space-y-4">
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
            <div key={idx} className="mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input name="kegiatan" value={act.kegiatan} onChange={e => handleActivityChange(idx, e)} required placeholder="Kegiatan" className="border px-3 py-2 rounded flex-1" />
                <input name="jam_mulai" value={act.jam_mulai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
                <input name="jam_selesai" value={act.jam_selesai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
              </div>
              <input name="keterangan" value={act.keterangan} onChange={e => handleActivityChange(idx, e)} placeholder="Keterangan" className="border px-3 py-2 rounded w-full mt-2" />
              {activities.length > 1 && <button type="button" onClick={() => removeActivity(idx)} className="text-red-500">Hapus</button>}
            </div>
          ))}
          <button type="button" onClick={addActivity} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Kegiatan</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Inventaris</h3>
          {inventaris.map((inv, idx) => (
            <div key={idx} className="w-full flex flex-row items-center gap-2 mb-2">
              <input name="nama_barang" value={inv.nama_barang} onChange={e => handleInventarisChange(idx, e)} required placeholder="Nama Barang" className="border px-3 py-2 rounded grow min-w-0" />
              <input name="jumlah" value={inv.jumlah} onChange={e => handleInventarisChange(idx, e)} required type="number" min="1" className="border px-3 py-2 rounded w-20" />
              {inventaris.length > 1 && <button type="button" onClick={() => removeInventaris(idx)} className="text-red-500">Hapus</button>}
            </div>
          ))}
          <button type="button" onClick={addInventaris} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Inventaris</button>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="mb-2">
            <label className="block font-medium mb-1">Pembuat Laporan</label>
            <input type="text" value={auth.user.nama_lengkap} disabled className="border px-3 py-2 rounded w-full bg-gray-100" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Penerima Laporan (Officer)</label>
            <select name="user_penerima" value={laporan.user_penerima} onChange={handleLaporanChange} className="border px-3 py-2 rounded w-full" required>
              <option value="">Pilih Officer</option>
              {officers.map(u => (
                <option key={u.user_id} value={u.nama_lengkap}>{u.nama_lengkap}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Supervisor</label>
            <select name="user_supervisor" value={laporan.user_supervisor} onChange={handleLaporanChange} className="border px-3 py-2 rounded w-full" required>
              <option value="">Pilih Supervisor</option>
              {supervisors.map(u => (
                <option key={u.user_id} value={u.nama_lengkap}>{u.nama_lengkap}</option>
              ))}
            </select>
          </div>
          
          {/* Signature Pads - Hanya tampil saat status draft */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-gray-700">Tanda Tangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signature Pembuat */}
              <div>
                <label className="block font-medium mb-2 text-sm text-gray-600">Tanda Tangan Pembuat</label>
                <SignaturePad
                  onSignatureChange={setSignaturePembuat}
                  placeholder="Tanda tangan pembuat laporan"
                  width={280}
                  height={100}
                  disabled={false} // Officer selalu bisa tanda tangan saat draft
                />
                <div className="text-center mt-2 text-sm font-medium text-gray-700">
                  {auth.user.nama_lengkap}
                </div>
              </div>
              
              {/* Signature Penerima */}
              <div>
                <label className="block font-medium mb-2 text-sm text-gray-600">Tanda Tangan Penerima</label>
                <SignaturePad
                  onSignatureChange={setSignaturePenerima}
                  placeholder="Tanda tangan penerima laporan"
                  width={280}
                  height={100}
                  disabled={false} // Officer selalu bisa tanda tangan saat draft
                />
                <div className="text-center mt-2 text-sm font-medium text-gray-700">
                  {laporan.user_penerima || 'Pilih penerima terlebih dahulu'}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              * Tanda tangan hanya dapat dilakukan saat laporan masih berstatus draft
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
            <button type="button" onClick={e => handleSave(e, true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Submit'}
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
      {showSubmittedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-2">Laporan Telah Dikirim</h2>
            <p className="mb-4">Laporan sudah di-submit ke supervisor.</p>
            <button onClick={() => { setShowSubmittedPopup(false); navigate('/dashboard/officer'); }} className="bg-blue-600 text-white px-4 py-2 rounded">Tutup</button>
          </div>
        </div>
      )}
      {showAlreadySubmittedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-2">Sudah Dikirim</h2>
            <p className="mb-4">Laporan ini sudah di-submit ke supervisor sebelumnya.</p>
            <button onClick={() => { setShowAlreadySubmittedPopup(false); navigate('/dashboard/officer'); }} className="bg-blue-600 text-white px-4 py-2 rounded">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLogBook; 