import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Settings,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Activity size={20} />
        </div>
        <div className="brand-text">
          <h2>Urine POC Reader</h2>
          <span className="brand-subtitle">WPL Mini Project</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">NAVIGATION</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Patients</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FileSpreadsheet size={18} />
          <span>Test History</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Settings & Info</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p><strong>WPL Mini Project</strong></p>
      </div>
    </aside>
  );
};
