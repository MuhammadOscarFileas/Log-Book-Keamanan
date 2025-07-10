import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';

const defaultLaporan = {
  date: '',
  lokasi: '',
  pos: '',
  shift: '',
  user_pembuat: '',
  kegiatan: [],
  inventaris: [],
};

export default function OfficerLaporanForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const namaLengkap = localStorage.getItem('nama_lengkap') || '';
  const [laporan, setLaporan] = useState({ ...defaultLaporan, user_pembuat: namaLengkap });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch laporan jika mode edit
  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      fetch(`https://ad0d4e758a12.ngrok-free.app/api/laporan/${id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setLaporan({ ...data, kegiatan: [], inventaris: [] }); // fetch kegiatan & inventaris terpisah
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [mode, id]);

  // Handler input laporan
  const handleChange = e => {
    setLaporan({ ...laporan, [e.target.name]: e.target.value });
  };

  // Handler kegiatan
  const handleKegiatanChange = (idx, field, value) => {
    const newKegiatan = [...laporan.kegiatan];
    newKegiatan[idx][field] = value;
    setLaporan({ ...laporan, kegiatan: newKegiatan });
  };
  const addKegiatan = () => {
    setLaporan({ ...laporan, kegiatan: [...laporan.kegiatan, { jam_mulai: '', jam_selesai: '', kegiatan: '', keterangan: '' }] });
  };
  const removeKegiatan = idx => {
    const newKegiatan = laporan.kegiatan.filter((_, i) => i !== idx);
    setLaporan({ ...laporan, kegiatan: newKegiatan });
  };

  // Handler inventaris
  const handleInventarisChange = (idx, field, value) => {
    const newInventaris = [...laporan.inventaris];
    newInventaris[idx][field] = value;
    setLaporan({ ...laporan, inventaris: newInventaris });
  };
  const addInventaris = () => {
    setLaporan({ ...laporan, inventaris: [...laporan.inventaris, { nama_barang: '', jumlah: '' }] });
  };
  const removeInventaris = idx => {
    const newInventaris = laporan.inventaris.filter((_, i) => i !== idx);
    setLaporan({ ...laporan, inventaris: newInventaris });
  };

  // Simpan draft
  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (mode === 'create') {
        res = await fetch('https://ad0d4e758a12.ngrok-free.app/api/laporan', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...laporan, status: 'draft' }),
        });
      } else {
        res = await fetch(`https://ad0d4e758a12.ngrok-free.app/api/laporan/${id}`, {
          credentials: 'include',
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(laporan),
        });
      }
      if (!res.ok) throw new Error('Gagal menyimpan laporan');
      // Simpan kegiatan & inventaris (loop, POST/PUT)
      // ... (implementasi lanjut)
      navigate('/officer/laporan?success=1');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Kumpulkan ke supervisor
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://ad0d4e758a12.ngrok-free.app/api/laporan/${id}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'submit to supervisor' }),
      });
      if (!res.ok) throw new Error('Gagal submit laporan');
      navigate('/officer/laporan');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar role="officer" />
      <div className="laporan-form-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2>{mode === 'create' ? 'Buat Laporan' : 'Edit Laporan'}</h2>
            {error && <div style={{color:'red'}}>{error}</div>}
            <form onSubmit={e => e.preventDefault()}>
              <label>Tanggal: <input type="date" name="date" value={laporan.date} onChange={handleChange} required /></label><br />
              <label>Lokasi: 
                <select name="lokasi" value={laporan.lokasi} onChange={handleChange} required>
                  <option value="">Pilih Lokasi</option>
                  <option value="Terminal A">Terminal A</option>
                  <option value="Terminal B">Terminal B</option>
                  <option value="Parkir">Parkir</option>
                  <option value="Ruang Tunggu">Ruang Tunggu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </label><br />
              <label>Pos: <input type="text" name="pos" value={laporan.pos} onChange={handleChange} required /></label><br />
              <label>Shift: <select name="shift" value={laporan.shift} onChange={handleChange} required>
                <option value="">Pilih Shift</option>
                <option value="pagi">Pagi</option>
                <option value="siang">Siang</option>
                <option value="malam">Malam</option>
              </select></label><br />
              <label>Pembuat: <input type="text" name="user_pembuat" value={laporan.user_pembuat} disabled /></label><br />
              <h3>Kegiatan</h3>
              {laporan.kegiatan.map((k, idx) => (
                <div key={idx} className="kegiatan-inventaris-box">
                  <label>Jam Mulai: <input type="time" value={k.jam_mulai} onChange={e => handleKegiatanChange(idx, 'jam_mulai', e.target.value)} /></label>
                  <label>Jam Selesai: <input type="time" value={k.jam_selesai} onChange={e => handleKegiatanChange(idx, 'jam_selesai', e.target.value)} /></label>
                  <label>Kegiatan: <input type="text" value={k.kegiatan} onChange={e => handleKegiatanChange(idx, 'kegiatan', e.target.value)} /></label>
                  <label>Keterangan: <input type="text" value={k.keterangan} onChange={e => handleKegiatanChange(idx, 'keterangan', e.target.value)} /></label>
                  <button type="button" onClick={() => removeKegiatan(idx)}>Hapus</button>
                </div>
              ))}
              <button type="button" onClick={addKegiatan}>Tambah Kegiatan</button>
              <h3>Inventaris</h3>
              {laporan.inventaris.map((inv, idx) => (
                <div key={idx} className="kegiatan-inventaris-box">
                  <label>Nama Barang: <input type="text" value={inv.nama_barang} onChange={e => handleInventarisChange(idx, 'nama_barang', e.target.value)} /></label>
                  <label>Jumlah: <input type="number" value={inv.jumlah} onChange={e => handleInventarisChange(idx, 'jumlah', e.target.value)} /></label>
                  <button type="button" onClick={() => removeInventaris(idx)}>Hapus</button>
                </div>
              ))}
              <button type="button" onClick={addInventaris}>Tambah Inventaris</button>
              <br /><br />
              <button type="button" onClick={handleSave} disabled={loading}>{mode === 'create' ? 'Simpan Draft' : 'Update Draft'}</button>
              {mode === 'edit' && <button type="button" onClick={handleSubmit} disabled={loading}>Kumpulkan ke Supervisor</button>}
              {/* Tombol batal dihapus, navigasi lewat sidebar */}
            </form>
          </>
        )}
      </div>
    </div>
  );
} 