import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Search,
  ExternalLink
} from 'lucide-react';

export const TestHistoryPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.getTests({ search, status: statusFilter });
      if (res.success) setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [search, statusFilter]);

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1>Urinalysis Test History</h1>
          <p className="subtitle">WPL Mini Project</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by Patient Name or Test ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group-right">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '140px' }}
          >
            <option value="All">All Tests</option>
            <option value="Normal">Normal</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="content-card">
        {loading ? (
          <p className="text-muted">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-muted">No test records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Flags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t._id}>
                    <td><span className="code-badge">{t.testId}</span></td>
                    <td>
                      <Link to={`/patients/${t.patient?._id || t.patient}`} className="patient-name-link">
                        {t.patientName}
                      </Link>{' '}
                      <span className="text-muted small">({t.patientId})</span>
                    </td>
                    <td>{new Date(t.testDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={t.overallStatus} flagCount={t.flagCount} /></td>
                    <td>{t.flagCount} Flagged</td>
                    <td>
                      <div className="action-buttons-flex">
                        <Link to={`/tests/${t._id}`} className="btn btn-outline btn-xs">
                          Details <ExternalLink size={11} />
                        </Link>
                      </div>
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
