import React from 'react';

const menuConfig = {
  superadmin: [
    { label: 'Dashboard', path: '/dashboard-superadmin' },
    { label: 'Manage Akun', path: '/manage-akun' },
    { label: 'Monitor Laporan', path: '/monitor-laporan' },
  ],
  officer: [
    { label: 'Dashboard', path: '/dashboard-officer' },
    { label: 'Laporan Saya', path: '/officer-laporan-list' },
    { label: 'Buat Laporan', path: '/officer-laporan-form' },
  ],
  supervisor: [
    { label: 'Dashboard', path: '/dashboard-supervisor' },
    { label: 'Monitor Laporan', path: '/monitor-laporan' },
  ],
};

export default function MobileNavigation({ role, current, onNavigate }) {
  const menu = menuConfig[role] || [];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around py-2 z-50 md:hidden">
      {menu.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className={`flex-1 text-xs ${current === item.path ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
} 