import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export default api;

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenOficina');
  if (token && config.url !== '/login') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});