import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import Navbar from './components/Navbar';
import OfficerDashboard from './components/OfficerDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import LogBookList from './components/LogBookList';
import AddLogBook from './components/AddLogBook';
import UpdateLogBook from './components/UpdateLogBook';
import ActivitiesList from './components/ActivitiesList';
import ReportsList from './components/ReportsList';
import ViewReport from './components/ViewReport';
import Login from './components/Login';

// Routes are now open for testing with dummy data
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  return children;
};

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  if (!allowedRoles.includes(auth.user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const Router = () => {
  const { auth } = useAuth();

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public routes - Show login page */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard/officer"
            element={
              <RoleBasedRoute allowedRoles={['officer', 'supervisor', 'superadmin']}>
                <OfficerDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/dashboard/supervisor"
            element={
              <RoleBasedRoute allowedRoles={['supervisor', 'superadmin']}>
                <SupervisorDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/dashboard/superadmin"
            element={
              <RoleBasedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/logbook"
            element={
              <ProtectedRoute>
                <LogBookList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logbook/add"
            element={
              <ProtectedRoute>
                <AddLogBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logbook/edit/:id"
            element={
              <ProtectedRoute>
                <UpdateLogBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivitiesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/view/:id"
            element={
              <ProtectedRoute>
                <ViewReport />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard/officer" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router; 