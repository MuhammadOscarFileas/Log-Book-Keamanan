import MonitorLaporan from './pages/MonitorLaporan';
import { Route } from 'react-router-dom';

const Router = () => {
  return (
    <>
      <Route path="/monitor-laporan" element={<MonitorLaporan />} />
    </>
  );
};

export default Router; 