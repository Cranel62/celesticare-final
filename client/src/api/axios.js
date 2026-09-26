import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
if (!configuredApiBase) throw new Error('VITE_API_BASE_URL must be configured.');

export const API_BASE = configuredApiBase.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;