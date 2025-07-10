import React, { useEffect, useState } from 'react';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const SuperAdminDashboard = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nomor_pegawai: '',
    nama_lengkap: '',
    email: '',
    password: '',
    lokasi: '',
    role: 'officer',
  });
  const [error, setError] = useState('');

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

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/api/users/register', form);
      setShowForm(false);
      setForm({ nomor_pegawai: '', nama_lengkap: '', email: '', password: '', lokasi: '', role: 'officer' });
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
            <input name="password" value={form.password} onChange={handleInput} required placeholder="Password" type="password" className="border px-3 py-2 rounded" />
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
          {users.map(user => (
            <div key={user.user_id} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div>
                <div className="font-medium">{user.nama_lengkap} ({user.role})</div>
                <div className="text-sm text-gray-500">{user.email} | {user.lokasi}</div>
              </div>
              <div className="mt-2 md:mt-0 flex space-x-2">
                {/* Edit can be implemented if needed */}
                <button onClick={() => handleDelete(user.user_id)} className="text-red-600 hover:underline text-sm">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard; 