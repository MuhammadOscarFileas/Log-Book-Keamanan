import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const OfficerDashboard = () => {
  const { auth } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selamat datang, {auth.user.nama_lengkap}</h1>
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