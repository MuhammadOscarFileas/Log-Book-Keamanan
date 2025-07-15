import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth || location.pathname === '/login') return null;

  const { user } = auth;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based links
  let links = [];
  if (user.role === 'officer') {
    links = [
      { to: '/dashboard/officer', label: 'Dashboard' },
      { to: '/logbook', label: 'Log Book' },
      { to: '/activities', label: 'Kegiatan' },
      { to: '/reports', label: 'Laporan' },
    ];
  } else if (user.role === 'supervisor') {
    links = [
      { to: '/dashboard/supervisor', label: 'Dashboard' },
      { to: '/reports', label: 'Laporan' },
    ];
  } else if (user.role === 'superadmin') {
    links = [
      { to: '/dashboard/superadmin', label: 'Dashboard' },
      { to: '/dashboard/superadmin', label: 'Kelola Akun' },
    ];
  }

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden mr-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-lg">Log Book</span>
      </div>
      <div className="hidden md:flex space-x-4">
        {links.map(link => (
          <Link key={link.to} to={link.to} className="text-gray-700 hover:text-blue-600">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 text-sm hidden md:inline">{user.nama_lengkap} ({user.role})</span>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white border-b shadow-md flex flex-col md:hidden z-50">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 border-b text-gray-700 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 