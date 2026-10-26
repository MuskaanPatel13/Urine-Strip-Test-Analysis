import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Database,
  RefreshCw,
  CheckCircle,
  BookOpen,
  Cpu
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const handleRefreshSeed = async () => {
    if (!window.confirm('Reset demo database with sample patients and tests?')) return;
    setSeeding(true);
    setSeedMessage('');
    try {
      const res = await api.resetAndSeed();
      if (res.success) setSeedMessage('Sample data successfully refreshed.');
    } catch (err) {
      alert('Error refreshing data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1>Settings & Project Info</h1>
          <p className="subtitle">WPL Mini Project</p>
        </div>
      </div>

      {seedMessage && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Staff Profile & Demo Reset in 2 Clean Columns */}
      <div className="form-grid-2">
        <div className="content-card">
          <div className="card-header-simple">
            <User size={18} className="text-blue" />
            <h3>Staff Account</h3>
          </div>
          <div className="mt-2" style={{ fontSize: '13.5px' }}>
            <p><strong>Name:</strong> {user?.name || 'Hospital Staff'}</p>
            <p className="mt-1"><strong>Email:</strong> {user?.email}</p>
            <p className="mt-1"><strong>Role:</strong> {user?.staffRole || 'Lab Technician'}</p>
            <p className="mt-1"><strong>Department:</strong> {user?.department}</p>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header-simple">
            <Database size={18} className="text-teal" />
            <h3>Demo Data Reset</h3>
          </div>
          <p className="text-muted small mt-1">
            Restores 5 sample patient cases (Normal, UTI, Diabetes, Kidney Issue, Jaundice) for viva demonstration.
          </p>
          <button
            onClick={handleRefreshSeed}
            className="btn btn-secondary mt-3"
            disabled={seeding}
          >
            <RefreshCw size={14} className={seeding ? 'spinning' : ''} />
            <span>{seeding ? 'Refreshing...' : 'Refresh Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Clean Project Brief Card */}
      <div className="content-card mt-3">
        <div className="card-header-simple">
          <BookOpen size={18} className="text-blue" />
          <h3>About Project (KJS-HC-03)</h3>
        </div>
        <p style={{ fontSize: '14px' }}>
          <strong>Title:</strong> Urine Test Strip Reader using Colorimetry as a Point-of-Care Technology
        </p>
        <p className="text-muted small mt-2">
          <strong>Objective:</strong> Replaces manual human visual comparison of urine dipstick colors against printed charts with an automated digital system. Reduces color judgment errors caused by room lighting variance and inaccurate reaction timing.
        </p>
        <p className="text-muted small mt-2">
          <strong>10 Parameters Analyzed:</strong> Glucose, Protein, pH, Ketones, Blood, Bilirubin, Urobilinogen, Nitrite, Leucocytes, Specific Gravity.
        </p>
      </div>

      {/* Hardware & Future Scope */}
      <div className="content-card mt-3">
        <div className="card-header-simple">
          <Cpu size={18} className="text-teal" />
          <h3>Hardware Enclosure & Future Scope</h3>
        </div>
        <div className="form-grid-2 mt-2" style={{ fontSize: '13px' }}>
          <div>
            <strong>1. Hardware Enclosure (POC Unit):</strong>
            <ul className="mt-1" style={{ paddingLeft: '18px', color: '#64748b' }}>
              <li>Light-tight black box (blocks ambient lighting).</li>
              <li>Calibrated diffuse white LED illumination.</li>
              <li>Raspberry Pi Camera Module at 8cm focal distance.</li>
              <li>120-second reaction timer countdown.</li>
            </ul>
          </div>
          <div>
            <strong>2. Future Computer Vision Integration:</strong>
            <ul className="mt-1" style={{ paddingLeft: '18px', color: '#64748b' }}>
              <li>OpenCV segmentation of the 10 pads from strip photo.</li>
              <li>CIE L*a*b* color distance measurement (Delta E).</li>
              <li>Non-linear regression model trained on concentrations.</li>
              <li>Connected as a Python FastAPI service.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
