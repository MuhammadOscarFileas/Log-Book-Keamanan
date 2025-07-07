import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import axiosInstance from '../api/axiosInstance';

const ActivitiesList = () => {
  const { auth } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Get all reports for this officer
        const laporanRes = await axiosInstance.get('/api/laporan');
        const myReports = laporanRes.data.filter(lap => lap.user_pembuat === auth.user.nama_lengkap);
        const reportIds = myReports.map(lap => lap.laporan_id);
        // Get all activities
        const actRes = await axiosInstance.get('/api/kegiatan');
        const myActivities = actRes.data.filter(act => reportIds.includes(act.laporan_id));
        setActivities(myActivities);
      } catch (err) {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [auth.user.nama_lengkap]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Daftar Kegiatan</h2>
      {loading ? (
        <div>Loading...</div>
      ) : activities.length === 0 ? (
        <div className="text-gray-500">Belum ada kegiatan.</div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {activities.map(act => (
            <div key={act.kegiatan_id} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div>
                <div className="font-medium">{act.kegiatan}</div>
                <div className="text-sm text-gray-500">Jam: {act.jam_mulai} - {act.jam_selesai} | Laporan ID: {act.laporan_id}</div>
              </div>
              <div className="mt-2 md:mt-0 flex space-x-2">
                <Link to={`/activities/edit/${act.kegiatan_id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitiesList; 