
// ============================================
// FILE: src/components/Header.jsx
// ============================================
import React from 'react';

export default function Header({ user, onLogout }) {
  const getRoleDisplay = () => {
    if (user.role === 'shift_engineer') return 'Shift Engineer Dashboard';
    if (user.role === 'department') return `${user.department} Department Dashboard`;
    if (user.role === 'oe_department') return 'OE Department Dashboard';
    if (user.role === 'resident_engineer') return 'Resident Engineer Dashboard';
  };

  return (
    <header className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">WAPDA Troubleshooting System</h1>
          <p className="text-sm text-blue-200">{getRoleDisplay()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{user.name}</p>
          <button
            onClick={onLogout}
            className="text-xs text-blue-200 hover:text-white underline mt-1"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
