import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fitnesstracker-backend-docker.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          const message = data.detail || 'Validation error occurred.';
          toast.error(Array.isArray(message) ? message[0].msg : message);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.detail || 'An error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', new URLSearchParams(credentials), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => api.get('/api/auth/me'),
  refreshToken: () => api.post('/api/auth/refresh'),
};

// User API functions
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getStats: () => api.get('/api/users/stats'),
  deleteAccount: () => api.delete('/api/users/profile'),
};

// Exercise API functions
export const exerciseAPI = {
  getAll: (params) => api.get('/api/exercises', { params }),
  getById: (id) => api.get(`/api/exercises/${id}`),
  create: (data) => api.post('/api/exercises', data),
  update: (id, data) => api.put(`/api/exercises/${id}`, data),
  delete: (id) => api.delete(`/api/exercises/${id}`),
  search: (query, limit = 50) => api.get(`/api/exercises/search/${query}`, { params: { limit } }),
};

// Recipe API functions
export const recipeAPI = {
  getAll: (params) => api.get('/api/recipes', { params }),
  getById: (id) => api.get(`/api/recipes/${id}`),
  create: (data) => api.post('/api/recipes', data),
  update: (id, data) => api.put(`/api/recipes/${id}`, data),
  delete: (id) => api.delete(`/api/recipes/${id}`),
  search: (query, limit = 50) => api.get(`/api/recipes/search/${query}`, { params: { limit } }),
  getByMealType: (mealType, limit = 20) => api.get(`/api/recipes/by-meal-type/${mealType}`, { params: { limit } }),
};

// Plan API functions
export const planAPI = {
  getAll: (params) => api.get('/api/plans', { params }),
  getById: (id) => api.get(`/api/plans/${id}`),
  create: (data) => api.post('/api/plans', data),
  update: (id, data) => api.put(`/api/plans/${id}`, data),
  delete: (id) => api.delete(`/api/plans/${id}`),
  generate: (data) => api.post('/api/plans/generate', data),
  getActive: () => api.get('/api/plans/current/active'),
};

export default api; 