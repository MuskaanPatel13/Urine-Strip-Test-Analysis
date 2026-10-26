import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  TestTube2,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const {
    totalPatients = 0,
    totalTests = 0,
    normalTests = 0,
    flaggedTests = 0,
    recentTests = [],
    parameterBreakdown = []
  } = stats || {};

  return (
    <div className="page-container">
      {/* Top Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1>Urinalysis Dashboard</h1>
          <p className="subtitle">WPL Mini Project</p>
        </div>
        <div className="quick-actions-bar">
          <Link to="/patients" className="btn btn-primary">
            <UserPlus size={15} /> View Patients
          </Link>
          <Link to="/history" className="btn btn-secondary">
            <TestTube2 size={15} /> All Tests
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-subtle">
            <Users size={22} className="text-blue" />
          </div>
          <div>
            <div className="stat-title">Total Patients</div>
            <div className="stat-value">{totalPatients}</div>
            <div className="stat-hint">Registered records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-teal-subtle">
            <TestTube2 size={22} className="text-teal" />
          </div>
          <div>
            <div className="stat-title">Tests Conducted</div>
            <div className="stat-value">{totalTests}</div>
            <div className="stat-hint">10-parameter strips</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green-subtle">
            <CheckCircle2 size={22} className="text-green" />
          </div>
          <div>
            <div className="stat-title">Normal Tests</div>
            <div className="stat-value">{normalTests}</div>
            <div className="stat-hint">Within normal limits</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-red-subtle">
            <AlertTriangle size={22} className="text-red" />
          </div>
          <div>
            <div className="stat-title">Flagged Tests</div>
            <div className="stat-value">{flaggedTests}</div>
            <div className="stat-hint">Abnormal readings</div>
          </div>
        </div>
      </div>

      {/* Simple Parameter Flag Chart */}
      <div className="content-card">
        <div className="chart-header">
          <h3>Parameter Abnormality Chart</h3>
          <p className="chart-subtitle">Tests showing flagged results across the 10 pads</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={parameterBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <XAxis dataKey="code" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name, props) => [`${value} tests flagged`, props.payload.name]} />
              <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-footer-caption">
          <span>GLU: Glucose • PRO: Protein • pH • KET: Ketones • BLO: Blood • BIL: Bilirubin • URO: Urobilinogen • NIT: Nitrite • LEU: Leucocytes • SG: Specific Gravity</span>
        </div>
      </div>

      {/* Recent Tests Table */}
      <div className="content-card">
        <div className="card-header-flex">
          <div>
            <h3>Recent Test Reports</h3>
            <p className="chart-subtitle">Latest urine strip tests</p>
          </div>
          <Link to="/history" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentTests.length === 0 ? (
          <p className="text-muted small">No tests recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Flagged Pads</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((t) => (
                  <tr key={t._id}>
                    <td><span className="code-badge">{t.testId}</span></td>
                    <td>
                      <strong>{t.patientName}</strong> <span className="text-muted small">({t.patientId})</span>
                    </td>
                    <td>{new Date(t.testDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={t.overallStatus} flagCount={t.flagCount} /></td>
                    <td>{t.flagCount} of 10</td>
                    <td>
                      <Link to={`/tests/${t._id}`} className="btn btn-outline btn-xs">
                        View <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
