import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);

  const initialForm = {
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    medicalHistory: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchPatients = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.getPatients(q);
      if (res.success) setPatients(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(search);
  }, [search]);

  const openAddModal = () => {
    setFormData(initialForm);
    setIsEditMode(false);
    setEditingPatientId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setFormData({
      name: p.name,
      age: p.age,
      gender: p.gender,
      contact: p.contact,
      medicalHistory: p.medicalHistory || ''
    });
    setIsEditMode(true);
    setEditingPatientId(p._id);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age || !formData.contact.trim()) {
      setError('Please fill in name, age, and contact number.');
      return;
    }

    try {
      if (isEditMode) {
        await api.updatePatient(editingPatientId, formData);
        setSuccessMsg(`Patient ${formData.name} updated.`);
      } else {
        await api.createPatient(formData);
        setSuccessMsg(`New patient ${formData.name} registered.`);
      }
      setIsModalOpen(false);
      fetchPatients(search);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save patient');
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete patient ${p.name} (${p.patientId})? This will also remove their test records.`)) {
      return;
    }
    try {
      await api.deletePatient(p._id);
      setSuccessMsg(`Patient ${p.name} deleted.`);
      fetchPatients(search);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete patient');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1>Patient Management</h1>
          <p className="subtitle">WPL Mini Project</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <UserPlus size={15} /> Add Patient
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && !isModalOpen && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Simple Search Bar */}
      <div className="filter-card">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by name, patient ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <span className="text-muted small">{patients.length} patient(s)</span>
      </div>

      {/* Patient Table */}
      <div className="content-card">
        {loading ? (
          <p className="text-muted">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-muted">No patients found. Click "Add Patient" to register one.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age / Gender</th>
                  <th>Contact</th>
                  <th>Tests</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td><span className="code-badge">{p.patientId}</span></td>
                    <td>
                      <Link to={`/patients/${p._id}`} className="patient-name-link">
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.age} yrs / {p.gender}</td>
                    <td>{p.contact}</td>
                    <td>{p.testCount || 0} Test(s)</td>
                    <td>
                      <div className="action-buttons-flex">
                        <Link to={`/patients/${p._id}`} className="btn btn-outline btn-xs" title="View Profile">
                          <ExternalLink size={12} /> View
                        </Link>
                        <button onClick={() => openEditModal(p)} className="btn btn-secondary btn-xs" title="Edit">
                          <Edit size={12} />
                        </button>
                        <button onClick={() => handleDelete(p)} className="btn btn-danger-outline btn-xs" title="Delete">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Patient' : 'Register New Patient'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 45"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Phone Contact *</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="e.g. +91 98200 12345"
                  required
                />
              </div>

              <div className="form-group">
                <label>Clinical Symptoms / Medical History (Optional)</label>
                <textarea
                  rows="2"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="e.g. Routine checkup, suspected UTI, diabetic patient..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Save Changes' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
