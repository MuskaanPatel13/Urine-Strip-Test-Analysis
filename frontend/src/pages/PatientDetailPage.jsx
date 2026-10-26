import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  UserCheck,
  ArrowLeft,
  FileText
} from 'lucide-react';

export const PatientDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getPatientById(id);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="page-container"><p>Loading patient...</p></div>;
  if (!data) return <div className="page-container"><p className="text-red">Patient not found.</p></div>;

  const { patient, tests = [] } = data;

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <Link to="/patients" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Patients
        </Link>
      </div>

      {/* Patient Profile Card */}
      <div className="patient-profile-card">
        <div className="profile-header-main">
          <div className="patient-avatar-circle">
            <User size={28} />
          </div>
          <div>
            <div className="name-and-id">
              <h2>{patient.name}</h2>
              <span className="code-badge">{patient.patientId}</span>
            </div>
            <p className="text-muted small mt-1">
              {patient.age} Years Old • {patient.gender} • Registered {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profile-details-grid">
          <div>
            <div className="detail-label"><Phone size={13} /> Phone</div>
            <div className="detail-value">{patient.contact}</div>
          </div>
          <div>
            <div className="detail-label"><Mail size={13} /> Email</div>
            <div className="detail-value">{patient.email || 'N/A'}</div>
          </div>
          <div>
            <div className="detail-label"><UserCheck size={13} /> Referring Doctor</div>
            <div className="detail-value">{patient.referringDoctor || 'General OPD'}</div>
          </div>
          <div>
            <div className="detail-label"><MapPin size={13} /> Location</div>
            <div className="detail-value">{patient.address || 'OPD Walk-in'}</div>
          </div>
        </div>

        {patient.medicalHistory && (
          <div className="medical-notes-banner mt-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#0f766e' }}>
              <HeartPulse size={15} /> Clinical Notes:
            </div>
            <p className="mt-1">{patient.medicalHistory}</p>
          </div>
        )}
      </div>

      {/* Previous Test Reports */}
      <div className="content-card mt-3">
        <div className="card-header-flex">
          <div>
            <h3>Urinalysis Test History ({tests.length})</h3>
            <p className="chart-subtitle">Recorded colorimetric tests for {patient.name}</p>
          </div>
        </div>

        {tests.length === 0 ? (
          <p className="text-muted small">No urine tests recorded for this patient yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Flagged Pads</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t._id}>
                    <td><span className="code-badge">{t.testId}</span></td>
                    <td>{new Date(t.testDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={t.overallStatus} flagCount={t.flagCount} /></td>
                    <td>{t.flagCount} of 10</td>
                    <td>
                      <Link to={`/tests/${t._id}`} className="btn btn-outline btn-xs">
                        <FileText size={11} /> View Report
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
