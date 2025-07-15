import React, { useEffect, useState } from 'react';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

// Fungsi untuk generate password random 8 karakter
function generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const SuperAdminDashboard = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nomor_pegawai: '',
    nama_lengkap: '',
    email: '',
    password: generateRandomPassword(),
    lokasi: '',
    role: 'officer',
  });
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [resetPasswords, setResetPasswords] = useState({}); // user_id: password

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset password random setiap kali form tambah user dibuka
  useEffect(() => {
    if (showForm) {
      setForm(f => ({ ...f, password: generateRandomPassword() }));
    }
  }, [showForm]);

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/api/users/register', form);
      setShowForm(false);
      setForm({ nomor_pegawai: '', nama_lengkap: '', email: '', password: generateRandomPassword(), lokasi: '', role: 'officer' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat akun');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Hapus user ini?')) return;
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      fetchUsers();
    } catch {}
  };

  // Fungsi reset first_login user dan password random
  const handleResetFirstLogin = async (user) => {
    if (!window.confirm('Reset password dan first login user ini?')) return;
    const newPassword = generateRandomPassword();
    try {
      await axiosInstance.put(`/api/users/${user.user_id}`, { first_login: true, password: newPassword });
      fetchUsers();
      setResetPasswords(prev => ({ ...prev, [user.user_id]: newPassword }));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selamat datang, {auth.user.nama_lengkap}</h1>
      <div className="mb-6 flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Batal' : '+ Buat Akun Baru'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded shadow p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="nomor_pegawai" value={form.nomor_pegawai} onChange={handleInput} required placeholder="Nomor Pegawai" className="border px-3 py-2 rounded" />
            <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleInput} required placeholder="Nama Lengkap" className="border px-3 py-2 rounded" />
            <input name="email" value={form.email} onChange={handleInput} required placeholder="Email" type="email" className="border px-3 py-2 rounded" />
            <input name="password" value={form.password} readOnly required placeholder="Password" type="text" className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" />
            <input name="lokasi" value={form.lokasi} onChange={handleInput} placeholder="Lokasi" className="border px-3 py-2 rounded" />
            <select name="role" value={form.role} onChange={handleInput} className="border px-3 py-2 rounded">
              <option value="officer">Officer</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Buat Akun</button>
        </form>
      )}
      <h2 className="text-lg font-semibold mb-2">Daftar User</h2>
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">Belum ada user.</div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {users.filter(user => user.role === 'officer' || user.role === 'supervisor').map(user => (
            <div key={user.user_id} className="bg-white rounded shadow mb-2">
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none flex justify-between items-center"
                onClick={() => setExpandedUserId(expandedUserId === user.user_id ? null : user.user_id)}
              >
                <span className="font-medium">{user.nama_lengkap} ({user.role})</span>
                <span className="text-gray-400">{expandedUserId === user.user_id ? '▲' : '▼'}</span>
              </button>
              {expandedUserId === user.user_id && (
                <div className="px-4 pb-4 pt-2 border-t bg-gray-50 animate-fade-in">
                  <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={user.nomor_pegawai} readOnly className="border px-3 py-2 rounded bg-gray-100" placeholder="Nomor Pegawai" />
                    <input value={user.nama_lengkap} readOnly className="border px-3 py-2 rounded bg-gray-100" placeholder="Nama Lengkap" />
                    <input value={user.email} readOnly className="border px-3 py-2 rounded bg-gray-100" placeholder="Email" />
                    <input value={resetPasswords[user.user_id] || '(disembunyikan)'} readOnly className={`border px-3 py-2 rounded bg-gray-100 ${resetPasswords[user.user_id] ? '' : 'italic text-gray-400'}`} placeholder="Password" />
                    <input value={user.lokasi || ''} readOnly className="border px-3 py-2 rounded bg-gray-100" placeholder="Lokasi" />
                    <input value={user.role} readOnly className="border px-3 py-2 rounded bg-gray-100" placeholder="Role" />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleResetFirstLogin(user)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">Reset</button>
                    <button onClick={() => handleDelete(user.user_id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Hapus</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard; 