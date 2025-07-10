import React, { useEffect, useState } from 'react';
import '../App.css';
import Sidebar from '../Sidebar';
import Swal from 'sweetalert2';

const BASE_URL = "https://ad0d4e758a12.ngrok-free.app";

function generatePassword() {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  let password = '';
  // Pastikan minimal 1 angka
  password += digits[Math.floor(Math.random() * digits.length)];
  // Sisa 7 karakter: campuran upper/lower
  for (let i = 0; i < 7; i++) {
    const chars = upper + lower;
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  // Shuffle agar angka tidak selalu di depan
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function UserForm({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial || { nama_lengkap: '', email: '', password: '', role: 'officer', lokasi: '' }
  );
  const [emailError, setEmailError] = useState('');
  useEffect(() => {
    if (!isEdit && open) {
      setForm({ nama_lengkap: '', email: '', password: generatePassword(), role: 'officer', lokasi: '' });
    } else if (isEdit && open) {
      setForm(initial);
    }
    setEmailError('');
  }, [initial, open, isEdit]);
  if (!open) return null;
  const handleEmailChange = e => {
    const val = e.target.value;
    setForm(f => ({ ...f, email: val }));
    if (!val.endsWith('@gmail.com')) setEmailError('Email harus menggunakan @gmail.com');
    else setEmailError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    if (isEdit) {
      const result = await Swal.fire({
        title: 'Apakah anda yakin?',
        text: 'Perubahan data user akan disimpan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal',
      });
      if (!result.isConfirmed) return;
    }
    onSubmit(form);
  };
  const handleResetPassword = () => {
    setForm(f => ({ ...f, password: generatePassword() }));
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{isEdit ? 'Edit User' : 'Tambah User'}</h3>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Nama Lengkap" value={form.nama_lengkap} onChange={e => setForm(f => ({ ...f, nama_lengkap: e.target.value }))} />
          <input required placeholder="Email" type="email" value={form.email} onChange={handleEmailChange} />
          {emailError && <div className="error">{emailError}</div>}
          {!isEdit && (
            <input required placeholder="Password" type="text" value={form.password} disabled style={{flex:1}} />
          )}
          {isEdit && (
            <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:14}}>
              <input placeholder="Password" type="text" value={form.password || ''} disabled style={{flex:1}} />
              <button type="button" className="btn-secondary" onClick={handleResetPassword}>Reset Password</button>
            </div>
          )}
          {/* Lokasi dropdown */}
          <select required value={form.lokasi} onChange={e => setForm(f => ({ ...f, lokasi: e.target.value }))}>
            <option value="">Pilih Lokasi</option>
            <option value="Lokasi 1">Lokasi 1</option>
            <option value="Lokasi 2">Lokasi 2</option>
          </select>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            <option value="superadmin">Superadmin</option>
            <option value="supervisor">Supervisor</option>
            <option value="officer">Officer</option>
          </select>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={!!emailError}>{isEdit ? 'Simpan' : 'Tambah'}</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageAkun() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, user: null });
  const [confirm, setConfirm] = useState({ open: false, user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'include', // aktifkan jika backend butuh cookie/session
      });
      const data = await res.json();
      //console.log('data dari backend : ', data);
      setUsers(data);
      setError('');
    } catch (e) {
      setError('Gagal memuat data user: ' + e.message);
      console.error('Fetch error:', e);
    }
    setLoading(false);
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = () => setModal({ open: true, user: null });
  const handleEdit = (user) => setModal({ open: true, user });
  // Hapus semua logic handleDelete, handleConfirmDelete, dan confirm modal

  const handleSubmit = async (form) => {
    try {
      const res = await fetch(
        modal.user
          ? `${BASE_URL}/api/users/${modal.user.user_id}`
          : `${BASE_URL}/api/users/register`,
        {
          method: modal.user ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      );
      if (!res.ok) throw new Error('Gagal simpan user');
      setModal({ open: false, user: null });
      fetchUsers();
    } catch {
      alert('Gagal simpan user');
    }
  };
  // Modal konfirmasi hapus dihilangkan

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#f7fafd'}}>
      <Sidebar role="superadmin" />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Manage Akun</h2>
        <button className="btn-primary" style={{marginBottom:16}} onClick={handleAdd}>+ Tambah User</button>
        {/* Debug: tampilkan data users */}
        {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Lokasi</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.user_id || idx}>
                    <td>{u.nama_lengkap || '-'}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.lokasi || '-'}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role || '-'}</span></td>
                    <td>
                      <button className="btn-secondary" onClick={() => handleEdit(u)}>Edit</button>
                      {/* Tombol hapus dihilangkan */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <UserForm open={modal.open} onClose={() => setModal({ open: false, user: null })} onSubmit={handleSubmit} initial={modal.user} />
        {/* Modal konfirmasi hapus dihilangkan */}
      </div>
    </div>
  );
}

// Modern style: gunakan class btn-primary, btn-secondary, btn-danger, role-badge di App.css 