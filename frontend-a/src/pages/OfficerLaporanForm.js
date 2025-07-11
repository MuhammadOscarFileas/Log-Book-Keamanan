import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { getApiUrl, API_CONFIG } from '../config';
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';

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
  const [nextShift, setNextShift] = useState('');
  const [signature, setSignature] = useState('');
  const [sigPad, setSigPad] = useState(null);
  const [officerList, setOfficerList] = useState([]);
  const [searchOfficer, setSearchOfficer] = useState('');
  const [supervisorList, setSupervisorList] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [signatureNextShift, setSignatureNextShift] = useState('');
  const sigPadNextShift = useRef(null);
  // Fetch officer list
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await fetch(getApiUrl('/api/users?role=officer'), { credentials: 'include' });
        const data = await res.json();
        // Exclude user login
        setOfficerList(data.filter(u => u.nama_lengkap !== namaLengkap));
      } catch {}
    };
    fetchOfficers();
  }, [namaLengkap]);

  // Fetch supervisor list
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch(getApiUrl('/api/users?role=supervisor'), { credentials: 'include' });
        const data = await res.json();
        setSupervisorList(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchSupervisors();
  }, []);

  // Fetch laporan jika mode edit
  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      fetch(getApiUrl(`${API_CONFIG.API_ENDPOINTS.LAPORAN}/${id}`), {
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
        res = await fetch(getApiUrl(API_CONFIG.API_ENDPOINTS.LAPORAN), {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...laporan, status: 'draft' }),
        });
      } else {
        res = await fetch(getApiUrl(`${API_CONFIG.API_ENDPOINTS.LAPORAN}/${id}`), {
          credentials: 'include',
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(laporan),
        });
      }
      if (!res.ok) throw new Error('Gagal menyimpan laporan');
      // Simpan kegiatan & inventaris (loop, POST/PUT)
      // ... (implementasi lanjut)
      if (mode === 'edit') {
        toast.success('Laporan anda berhasil di update');
        // Tunggu sebentar sebelum redirect agar toast sempat muncul
        setTimeout(() => navigate('/officer/laporan?success=1'), 1200);
      } else {
        navigate('/officer/laporan?success=1');
      }
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
    // Validasi signature pembuat, shift selanjutnya, supervisor
    if (!signature) {
      setError('Tanda tangan pembuat wajib diisi');
      setLoading(false);
      return;
    }
    if (!signatureNextShift) {
      setError('Tanda tangan shift selanjutnya wajib diisi');
      setLoading(false);
      return;
    }
    if (!selectedSupervisor) {
      setError('Supervisor wajib dipilih');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(getApiUrl(`${API_CONFIG.API_ENDPOINTS.LAPORAN}/${id}`), {
        credentials: 'include',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'submit to supervisor', supervisor: selectedSupervisor, ttd_pembuat: signature, ttd_shift_selanjutnya: signatureNextShift }),
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
      <div style={{ flex: 1, padding: '40px 32px', background: '#f7fafd', minHeight: '100vh' }}>
        <div style={{
          background: '#fff',
          borderRadius: 0, // Tidak ada border-radius
          boxShadow: 'none', // Hilangkan shadow agar seperti kertas
          maxWidth: 900,
          margin: '40px auto',
          padding: '36px 32px',
        }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <h2 style={{marginBottom: 18, color: '#27bcd4'}}>{mode === 'create' ? 'Buat Laporan' : 'Edit Laporan'}</h2>
              {error && <div style={{color:'red'}}>{error}</div>}
              <form onSubmit={e => e.preventDefault()}>
                {/* Style modern untuk semua input/select */}
                <style>{`
                  .modern-input {
                    width: 100%;
                    padding: 9px 12px;
                    border: 1.5px solid #d0e3ef;
                    border-radius: 7px;
                    font-size: 15px;
                    margin-top: 4px;
                    margin-bottom: 2px;
                    transition: border 0.18s, box-shadow 0.18s;
                    background: #fafdff;
                  }
                  .modern-input:focus {
                    border: 1.5px solid #27bcd4;
                    outline: none;
                    box-shadow: 0 0 0 2px #e0f4fa;
                  }
                  .modern-input[disabled] {
                    background: #f2f2f2;
                    color: #aaa;
                  }
                  .modern-label {
                    font-weight: 500;
                    margin-bottom: 2px;
                    display: block;
                  }
                  .modern-field {
                    margin-bottom: 16px;
                  }
                `}</style>
                {/* Grid 2 kolom untuk field utama */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '18px 32px',
                  marginBottom: 18
                }}>
                  <div className="modern-field">
                    <label className="modern-label">Tanggal:
                      <input type="date" name="date" value={laporan.date} onChange={handleChange} required className="modern-input" />
                    </label>
                  </div>
                  <div className="modern-field">
                    <label className="modern-label">Lokasi:
                      <select name="lokasi" value={laporan.lokasi} onChange={handleChange} required className="modern-input">
                        <option value="">Pilih Lokasi</option>
                        <option value="Terminal A">Terminal A</option>
                        <option value="Terminal B">Terminal B</option>
                        <option value="Parkir">Parkir</option>
                        <option value="Ruang Tunggu">Ruang Tunggu</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </label>
                  </div>
                  <div className="modern-field">
                    <label className="modern-label">Shift:
                      <select name="shift" value={laporan.shift} onChange={handleChange} required className="modern-input">
                        <option value="">Pilih Shift</option>
                        <option value="pagi">Pagi</option>
                        <option value="siang">Siang</option>
                        <option value="malam">Malam</option>
                      </select>
                    </label>
                  </div>
                  <div className="modern-field">
                    <label className="modern-label">Pembuat:
                      <input type="text" name="user_pembuat" value={laporan.user_pembuat} disabled className="modern-input" />
                    </label>
                  </div>
                </div>
                {/* Field pos tetap di bawah grid */}
                <div className="modern-field" style={{marginBottom: 18}}>
                  <label className="modern-label">Pos:
                    <input type="text" name="pos" value={laporan.pos} onChange={handleChange} required className="modern-input" />
                  </label>
                </div>
                <h3 style={{marginTop: 24}}>Kegiatan</h3>
                {laporan.kegiatan.map((k, idx) => (
                  <div key={idx} className="kegiatan-inventaris-box" style={{marginBottom: 10}}>
                    <label className="modern-label">Jam Mulai: <input type="time" value={k.jam_mulai} onChange={e => handleKegiatanChange(idx, 'jam_mulai', e.target.value)} className="modern-input" /></label>
                    <label className="modern-label">Jam Selesai: <input type="time" value={k.jam_selesai} onChange={e => handleKegiatanChange(idx, 'jam_selesai', e.target.value)} className="modern-input" /></label>
                    <label className="modern-label">Kegiatan: <input type="text" value={k.kegiatan} onChange={e => handleKegiatanChange(idx, 'kegiatan', e.target.value)} className="modern-input" /></label>
                    <label className="modern-label">Keterangan: <input type="text" value={k.keterangan} onChange={e => handleKegiatanChange(idx, 'keterangan', e.target.value)} className="modern-input" /></label>
                    <button type="button" className="modern-btn-action modern-btn-danger" onClick={() => removeKegiatan(idx)}>Hapus</button>
                  </div>
                ))}
                <button type="button" className="modern-btn-action" onClick={addKegiatan}>Tambah Kegiatan</button>
                <h3 style={{marginTop: 24}}>Inventaris</h3>
                {laporan.inventaris.map((inv, idx) => (
                  <div key={idx} className="kegiatan-inventaris-box" style={{marginBottom: 10}}>
                    <label className="modern-label">Nama Barang: <input type="text" value={inv.nama_barang} onChange={e => handleInventarisChange(idx, 'nama_barang', e.target.value)} className="modern-input" /></label>
                    <label className="modern-label">Jumlah: <input type="number" value={inv.jumlah} onChange={e => handleInventarisChange(idx, 'jumlah', e.target.value)} className="modern-input" /></label>
                    <button type="button" className="modern-btn-action modern-btn-danger" onClick={() => removeInventaris(idx)}>Hapus</button>
                  </div>
                ))}
                <button type="button" className="modern-btn-action" onClick={addInventaris}>Tambah Inventaris</button>
                {/* Signature Pad: Pembuat & Shift Selanjutnya bersebelahan */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '32px',
                  margin: '32px 0 24px 0',
                  alignItems: 'start'
                }}>
                  {/* Kiri: Tanda tangan pembuat */}
                  <div className="modern-field">
                    <label className="modern-label" style={{marginBottom:8, display:'block'}}>Tanda Tangan Pembuat:</label>
                    <div style={{border:'1.5px solid #d0e3ef', background:'#fafdff', borderRadius:8, width:'100%', minHeight:120, padding:8}}>
                      <SignatureCanvas
                        penColor="#222"
                        canvasProps={{width:320, height:100, className:'sigCanvas'}}
                        ref={ref => setSigPad(ref)}
                        onEnd={() => setSignature(sigPad ? sigPad.getCanvas().toDataURL('image/png') : '')}
                        clearOnResize={false}
                        disabled={!nextShift}
                      />
                      <div style={{display:'flex', gap:8, marginTop:8}}>
                        <button type="button" className="modern-btn-action" onClick={() => { sigPad && sigPad.clear(); setSignature(''); }} disabled={!nextShift}>Clear</button>
                        {signature && <span style={{color:'#27bcd4', fontWeight:500}}>Tanda tangan sudah diisi</span>}
                      </div>
                      {!nextShift && <div style={{color:'#aaa', fontSize:13, marginTop:4}}>Pilih shift selanjutnya dulu untuk mengisi tanda tangan</div>}
                    </div>
                    {/* Nama pembuat di bawah pad */}
                    <div style={{marginTop:10, fontWeight:500, color:'#222', fontSize:15, textAlign:'center'}}>{laporan.user_pembuat}</div>
                  </div>
                  {/* Kanan: Pilih officer shift selanjutnya + signature pad */}
                  <div className="modern-field">
                    <label className="modern-label" style={{marginBottom:8, display:'block'}}>Petugas Shift Selanjutnya:</label>
                    <input
                      className="modern-input"
                      type="text"
                      placeholder="Cari nama petugas..."
                      value={searchOfficer}
                      onChange={e => setSearchOfficer(e.target.value)}
                      style={{marginBottom:8}}
                    />
                    <select
                      className="modern-input"
                      value={nextShift}
                      onChange={e => {
                        setNextShift(e.target.value);
                        if (sigPadNextShift.current) sigPadNextShift.current.clear();
                        setSignatureNextShift('');
                      }}
                      required
                      style={{marginBottom:8}}
                    >
                      <option value="">Pilih Nama Petugas</option>
                      {officerList
                        .filter(u => u.nama_lengkap.toLowerCase().includes(searchOfficer.toLowerCase()))
                        .map(u => (
                          <option key={u.user_id} value={u.nama_lengkap}>{u.nama_lengkap}</option>
                        ))}
                      {officerList.filter(u => u.nama_lengkap.toLowerCase().includes(searchOfficer.toLowerCase())).length === 0 && (
                        <option disabled value="">Tidak ada petugas ditemukan</option>
                      )}
                    </select>
                    {/* Signature pad hanya muncul jika nextShift sudah dipilih */}
                    {nextShift && (
                      <div style={{border:'1.5px solid #d0e3ef', background:'#fafdff', borderRadius:8, width:'100%', minHeight:120, padding:8}}>
                        <SignatureCanvas
                          penColor="#222"
                          canvasProps={{width:320, height:100, className:'sigCanvas'}}
                          ref={sigPadNextShift}
                          onEnd={() => setSignatureNextShift(sigPadNextShift.current ? sigPadNextShift.current.getCanvas().toDataURL('image/png') : '')}
                          clearOnResize={false}
                        />
                        <div style={{display:'flex', gap:8, marginTop:8}}>
                          <button type="button" className="modern-btn-action" onClick={() => { sigPadNextShift.current && sigPadNextShift.current.clear(); setSignatureNextShift(''); }}>Clear</button>
                          {signatureNextShift && <span style={{color:'#27bcd4', fontWeight:500}}>Tanda tangan sudah diisi</span>}
                        </div>
                      </div>
                    )}
                    {/* Nama shift selanjutnya di bawah pad */}
                    <div style={{marginTop:10, fontWeight:500, color:'#222', fontSize:15, textAlign:'center'}}>{nextShift}</div>
                  </div>
                </div>
                {/* Dropdown supervisor untuk submit ke supervisor */}
                <div className="modern-field" style={{marginBottom: 24}}>
                  <label className="modern-label">Supervisor Tujuan:</label>
                  <select
                    className="modern-input"
                    value={selectedSupervisor}
                    onChange={e => setSelectedSupervisor(e.target.value)}
                    required
                  >
                    <option value="">Pilih Supervisor</option>
                    {supervisorList.map(sup => (
                      <option key={sup.user_id} value={sup.user_id}>{sup.nama_lengkap}</option>
                    ))}
                  </select>
                </div>
                {/* Tombol utama modern di paling bawah */}
                <div style={{display:'flex', gap:12, marginTop:32, flexWrap:'wrap'}}>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                      background: '#27bcd4',
                      color: '#fff',
                      padding: '10px 28px',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 1px 4px rgba(39,188,212,0.08)',
                      transition: 'background 0.2s',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {mode === 'create' ? 'Simpan Draft' : 'Update Draft'}
                  </button>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        background: '#1e90ff',
                        color: '#fff',
                        padding: '10px 28px',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 1px 4px rgba(30,144,255,0.08)',
                        transition: 'background 0.2s',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      Kumpulkan ke Supervisor
                    </button>
                  )}
                </div>
                {/* Tombol aksi kecil modern */}
                <style>{`
                  .modern-btn-action {
                    background: #f2f8fc;
                    color: #27bcd4;
                    border: none;
                    border-radius: 7px;
                    padding: 7px 16px;
                    font-weight: 500;
                    font-size: 15px;
                    margin: 8px 8px 8px 0;
                    cursor: pointer;
                    transition: background 0.18s, color 0.18s;
                  }
                  .modern-btn-action:hover {
                    background: #e0f4fa;
                    color: #189ab4;
                  }
                  .modern-btn-danger {
                    background: #ffeaea;
                    color: #e74c3c;
                  }
                  .modern-btn-danger:hover {
                    background: #ffd6d6;
                    color: #c0392b;
                  }
                `}</style>
                {/* Ganti semua button kecil dengan class modern-btn-action */}
                {/* Tombol batal dihapus, navigasi lewat sidebar */}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 