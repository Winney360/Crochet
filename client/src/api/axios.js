import axios from 'axios';

// Use environment variable with fallback for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle expired or invalid admin sessions
let redirectingToLogin = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout - using fallback data');
      return Promise.reject(error);
    }

    // 401 means the stored JWT is expired, revoked, or signed with a
    // different secret. Drop the dead session and send the admin back to
    // the login page instead of leaving them stuck on a dead dashboard.
    if (error.response?.status === 401) {
      const hadToken = Boolean(
        localStorage.getItem('adminToken') || localStorage.getItem('token')
      );

      if (hadToken && !redirectingToLogin) {
        redirectingToLogin = true;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminData');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/admin/login?expired=1';
      }
    }

    return Promise.reject(error);
  }
);

export default api;