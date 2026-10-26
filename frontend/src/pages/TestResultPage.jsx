import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { StripVisualizer } from '../components/StripVisualizer';
import { ArrowLeft } from 'lucide-react';

export const TestResultPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.getTestById(id);
        if (res.success && res.data) setTest(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load test record.');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  if (loading) return <div className="page-container"><p>Loading test result...</p></div>;
  if (error || !test) return <div className="page-container"><p className="text-red">Test not found.</p></div>;

  const patient = test.patient || {};
  const params = test.parameters || {};

  const visualizerValues = {};
  Object.keys(params).forEach((k) => {
    visualizerValues[k] = params[k]?.value;
  });

  return (
    <div className="page-container">
      {/* Top Navigation */}
      <div className="page-header-flex">
        <Link to="/history" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to History
        </Link>
      </div>

      {/* Test & Patient Summary Banner */}
      <div className="test-meta-banner">
        <div className="banner-primary">
          <div>
            <span className="text-muted small">Test ID:</span>
            <h2>{test.testId}</h2>
          </div>
          <StatusBadge status={test.overallStatus} flagCount={test.flagCount} />
        </div>

        <div className="banner-details-grid">
          <div>
            <span className="label">Patient Name:</span>
            <span className="val font-semibold">{test.patientName}</span>
          </div>
          <div>
            <span className="label">Patient ID:</span>
            <span className="code-badge">{test.patientId}</span>
          </div>
          <div>
            <span className="label">Date:</span>
            <span className="val">{new Date(test.testDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="label">Incubation:</span>
            <span className="val">{test.reactionWaitSeconds || 120}s Wait Time</span>
          </div>
        </div>
      </div>

      {/* Visual Reagent Strip */}
      <div className="content-card">
        <StripVisualizer values={visualizerValues} />
      </div>

      {/* 10 Parameters Clean Table */}
      <div className="content-card">
        <div className="card-header-flex">
          <h3>10-Parameter Results</h3>
          <span className={test.flagCount > 0 ? 'text-red font-semibold' : 'text-green font-semibold'}>
            {test.flagCount === 0 ? 'All 10 Normal' : `${test.flagCount} Parameter(s) Flagged`}
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Parameter</th>
                <th>Detected Value</th>
                <th>Standard Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(params).map((key, index) => {
                const item = params[key];
                const isNormal = item.status === 'Normal';

                return (
                  <tr key={key} style={{ backgroundColor: !isNormal ? '#fff5f5' : 'transparent' }}>
                    <td>{index + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>
                      <span className={`param-value-pill ${isNormal ? 'pill-normal' : 'pill-flagged'}`}>
                        {item.value} {item.unit ? `(${item.unit})` : ''}
                      </span>
                    </td>
                    <td className="text-muted">{item.normalRange}</td>
                    <td>
                      <span className={`status-pill ${isNormal ? 'pill-normal' : 'pill-flagged'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remarks & Image (if any) */}
      <div className="results-lower-grid">
        <div className="content-card">
          <h4>Clinical Remarks</h4>
          <p className="mt-2 text-muted">
            {test.clinicalRemarks || 'Normal screening without explicit remarks.'}
          </p>
        </div>

        <div className="content-card">
          <h4>Strip Photo Evidence</h4>
          {test.stripImage && test.stripImage.hasImage && test.stripImage.url ? (
            <div className="mt-2 text-center">
              <img
                src={`http://localhost:5000${test.stripImage.url}`}
                alt="Strip capture"
                className="strip-img-preview"
              />
            </div>
          ) : (
            <p className="mt-2 text-muted small">No photo uploaded for this session.</p>
          )}
        </div>
      </div>
    </div>
  );
};
