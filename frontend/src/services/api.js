const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Patients
  getPatients: async (search = '') => {
    const url = search ? `${API_BASE_URL}/patients?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/patients`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  getPatientById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/patients/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  createPatient: async (patientData) => {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(patientData)
    });
    return handleResponse(res);
  },

  updatePatient: async (id, patientData) => {
    const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(patientData)
    });
    return handleResponse(res);
  },

  deletePatient: async (id) => {
    const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Urine Tests
  getDefinitions: async () => {
    const res = await fetch(`${API_BASE_URL}/tests/reference-definitions`);
    return handleResponse(res);
  },

  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/tests/stats/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getTests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/tests${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getTestById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/tests/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getPatientHistory: async (patientId) => {
    const res = await fetch(`${API_BASE_URL}/tests/patient/${patientId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createTest: async (formData) => {
    // If formData is FormData instance, send without Content-Type so browser sets boundary
    const isFormData = formData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/tests`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData)
    });
    return handleResponse(res);
  },

  // Seed data refresh
  resetAndSeed: async () => {
    const res = await fetch(`${API_BASE_URL}/seed/reset-and-seed`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
