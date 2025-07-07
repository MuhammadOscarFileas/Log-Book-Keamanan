import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const SupervisorDashboard = () => {
  const { auth } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get('/api/laporan');
        setReports(res.data);
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selamat datang, {auth.user.nama_lengkap}</h1>
      <h2 className="text-lg font-semibold mb-2">Semua Laporan Officer</h2>
      {loading ? (
        <div>Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-gray-500">Belum ada laporan.</div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {reports.map(lap => (
            <div key={lap.laporan_id} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div>
                <div className="font-medium">{lap.date} - {lap.lokasi} - Shift: {lap.shift}</div>
                <div className="text-sm text-gray-500">Officer: {lap.user_pembuat} | Status: {lap.status}</div>
              </div>
              <div className="mt-2 md:mt-0 flex space-x-2">
                <Link to={`/reports/view/${lap.laporan_id}`} className="text-blue-600 hover:underline text-sm">Lihat</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard; 