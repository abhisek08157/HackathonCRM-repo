import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
};

// Customer API calls
export const customerAPI = {
  getAll: (params) => API.get('/customers', { params }),
  create: (customerData) => API.post('/customers', customerData),
  getById: (id) => API.get(`/customers/${id}`),
  update: (id, customerData) => API.put(`/customers/${id}`, customerData),
  delete: (id) => API.delete(`/customers/${id}`),
  addNote: (id, noteData) => API.post(`/customers/${id}/notes`, noteData),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboard: () => API.get('/analytics/dashboard'),
  getCallPerformance: () => API.get('/analytics/call-performance'),
};

export default API;
