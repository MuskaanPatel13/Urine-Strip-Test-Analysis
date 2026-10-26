import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle2, Activity } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="app-navbar">
      <div className="hospital-tag">
        <Activity size={18} className="text-blue" />
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
          WPL Mini Project
        </span>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="staff-profile-chip">
            <UserCircle2 size={18} className="text-blue" />
            <span>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};
