import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';
import SignaturePad from './SignaturePad';

const UpdateLogBook = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const [activities, setActivities] = useState([]);
  const [inventaris, setInventaris] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [signaturePembuat, setSignaturePembuat] = useState('');
  const [signaturePenerima, setSignaturePenerima] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lapRes = await axiosInstance.get(`/api/laporan/${id}`);
        setLaporan(lapRes.data);
        // Set signature dari data laporan jika ada
        setSignaturePembuat(lapRes.data.ttd_pembuat || '');
        setSignaturePenerima(lapRes.data.ttd_penerima || '');
        const actRes = await axiosInstance.get('/api/kegiatan');
        setActivities(actRes.data.filter(a => a.laporan_id === Number(id)));
        const invInputRes = await axiosInstance.get('/api/inventaris-input');
        const invInputs = invInputRes.data.filter(i => i.laporan_id === Number(id));
        setInventaris(invInputs.map(ii => ({
          nama_barang: ii.nama_barang,
          jumlah: ii.jumlah,
          inv_input_id: ii.inv_input_id
        })));
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const addInventaris = () => {
    setInventaris([
      ...inventaris,
      { nama_barang: '', jumlah: 1 }
    ]);
  };

  const handleSave = async (e, submit = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validasi signature jika submit dan status masih draft
    if (submit && laporan.status === 'draft') {
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
      await axiosInstance.put(`/api/laporan/${id}`, {
        ...laporan,
        status: submit ? 'submit to supervisor' : 'draft',
        ttd_pembuat: signaturePembuat || laporan.ttd_pembuat,
        ttd_penerima: signaturePenerima || laporan.ttd_penerima,
      });
      for (const act of activities) {
        await axiosInstance.put(`/api/kegiatan/${act.kegiatan_id}`, act);
      }
      for (const inv of inventaris) {
        if (inv.inv_input_id) {
          await axiosInstance.put(`/api/inventaris-input/${inv.inv_input_id}`, { jumlah: inv.jumlah });
        } else {
          // Inventaris baru
          await axiosInstance.post(`/api/inventaris-input`, {
            laporan_id: Number(id),
            nama_barang: inv.nama_barang,
            jumlah: inv.jumlah
          });
        }
      }
      navigate('/dashboard/officer');
    } catch (err) {
      setError('Gagal menyimpan perubahan');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      { kegiatan: '', jam_mulai: '', jam_selesai: '', keterangan: '', laporan_id: Number(id) }
    ]);
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus laporan ini?')) return;
    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/api/laporan/${id}`);
      // (Opsional: hapus kegiatan dan inventaris input jika backend tidak otomatis hapus)
      navigate('/dashboard/officer');
    } catch (err) {
      setError('Gagal menghapus laporan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!laporan) return <div className="p-4 text-red-500">{error || 'Laporan tidak ditemukan'}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Edit Laporan</h2>
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
            <React.Fragment key={act.kegiatan_id || idx}>
              <div className="mb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <input name="kegiatan" value={act.kegiatan} onChange={e => handleActivityChange(idx, e)} required placeholder="Kegiatan" className="border px-3 py-2 rounded flex-1" />
                  <input name="jam_mulai" value={act.jam_mulai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
                  <input name="jam_selesai" value={act.jam_selesai} onChange={e => handleActivityChange(idx, e)} required type="time" className="border px-3 py-2 rounded" />
                </div>
                <input name="keterangan" value={act.keterangan} onChange={e => handleActivityChange(idx, e)} placeholder="Keterangan" className="border px-3 py-2 rounded w-full mt-2" />
              </div>
              {idx < activities.length - 1 && <hr className="my-4 border-gray-300" />}
            </React.Fragment>
          ))}
          <button type="button" onClick={addActivity} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Kegiatan</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Inventaris</h3>
          {inventaris.map((inv, idx) => (
            <div key={inv.inv_input_id || idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <input name="nama_barang" value={inv.nama_barang} onChange={e => handleInventarisChange(idx, e)} required placeholder="Nama Barang" className="border px-3 py-2 rounded flex-1" disabled={!!inv.inv_input_id} />
              <input name="jumlah" value={inv.jumlah} onChange={e => handleInventarisChange(idx, e)} required type="number" min="1" className="border px-3 py-2 rounded w-24" />
            </div>
          ))}
          <button type="button" onClick={addInventaris} className="text-blue-600 hover:underline text-sm mt-1">+ Tambah Inventaris</button>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="mb-2">
            <label className="block font-medium mb-1">Pembuat Laporan</label>
            <input type="text" value={laporan.user_pembuat || ''} disabled className="border px-3 py-2 rounded w-full bg-gray-100" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Penerima Laporan (Officer)</label>
            <select name="user_penerima" value={laporan.user_penerima || ''} onChange={handleLaporanChange} className="border px-3 py-2 rounded w-full" required>
              <option value="">Pilih Officer</option>
              {officers.map(u => (
                <option key={u.user_id} value={u.nama_lengkap}>{u.nama_lengkap}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Supervisor</label>
            <select name="user_supervisor" value={laporan.user_supervisor || ''} onChange={handleLaporanChange} className="border px-3 py-2 rounded w-full" required>
              <option value="">Pilih Supervisor</option>
              {supervisors.map(u => (
                <option key={u.user_id} value={u.nama_lengkap}>{u.nama_lengkap}</option>
              ))}
            </select>
          </div>
          
          {/* Signature Pads - Hanya tampil saat status draft */}
          {laporan.status === 'draft' && (
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
                    disabled={false}
                    defaultValue={signaturePembuat}
                  />
                  <div className="text-center mt-2 text-sm font-medium text-gray-700">
                    {laporan.user_pembuat}
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
                    disabled={false}
                    defaultValue={signaturePenerima}
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
          )}
          
          {/* Informasi jika status bukan draft */}
          {laporan.status !== 'draft' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm text-yellow-800">
                <strong>Status Laporan: {laporan.status}</strong><br/>
                {laporan.status === 'submit to supervisor' ? 
                  'Laporan sudah dikirim ke supervisor. Tanda tangan tidak dapat diubah.' :
                  'Laporan sudah disetujui. Tidak dapat diubah lagi.'
                }
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button 
              type="button" 
              onClick={e => handleSave(e, true)} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={loading || laporan.status !== 'draft'}
            >
              {loading ? 'Menyimpan...' : 'Submit'}
            </button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={loading || laporan.status !== 'draft'}
            >
              Hapus Laporan
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default UpdateLogBook; 