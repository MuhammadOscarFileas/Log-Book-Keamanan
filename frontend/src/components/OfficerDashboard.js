import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const OfficerDashboard = () => {
  const { auth, login } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdatePw, setShowUpdatePw] = useState(auth.user.first_login);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get('/api/laporan');
        // Filter reports by current officer
        const myReports = res.data.filter(lap => lap.user_pembuat === auth.user.nama_lengkap);
        setReports(myReports);
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [auth.user.nama_lengkap]);

  // Fungsi update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 6) {
      setPwError('Password minimal 6 karakter');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Konfirmasi password tidak sama');
      return;
    }
    try {
      await axiosInstance.put(`/api/users/${auth.user.user_id}`, { password: newPw, first_login: false });
      // Update state auth agar first_login jadi false
      await login(auth.token, { ...auth.user, first_login: false });
      setShowUpdatePw(false);
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setPwError('Gagal update password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selamat datang, {auth.user.nama_lengkap}</h1>
      {/* Pop up update password saat first login */}
      {showUpdatePw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Update Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <input type="password" placeholder="Password baru" className="border px-3 py-2 rounded w-full" value={newPw} onChange={e => setNewPw(e.target.value)} required />
              <input type="password" placeholder="Konfirmasi password" className="border px-3 py-2 rounded w-full" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
              {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Update Password</button>
            </form>
          </div>
        </div>
      )}
      <div className="mb-6 flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/logbook/add')}
        >
          + Buat Laporan Baru
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-2">Laporan Saya</h2>
      {loading ? (
        <div>Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-gray-500">Belum ada laporan.</div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {reports.map(lap => (
            <button
              key={lap.laporan_id}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none transition"
              onClick={() => navigate(`/logbook/edit/${lap.laporan_id}`)}
            >
              <div className="font-medium">{lap.date} - {lap.lokasi} - Shift: {lap.shift}</div>
              <div className="text-sm text-gray-500">Status: {lap.status}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard; 