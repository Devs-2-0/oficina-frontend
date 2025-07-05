import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export default api;

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Variável para controlar se o toast de erro 403 já foi exibido
let hasShown403Toast = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenOficina');
  if (token && config.url !== '/login') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403 && !hasShown403Toast) {
      hasShown403Toast = true;
      const errorMessage = error.response?.data?.message || 'Acesso negado. Você não tem permissão para acessar este recurso.';
      toast.error(errorMessage);

      // Se a mensagem for específica sobre permissão, redirecionar após 5 segundos
      if (error.response?.data?.message === "Acesso negado pois usuário não possui permissão") {
        setTimeout(() => {
          window.location.href = '/feed';
        }, 1500);
      }

      // Reset da flag após 3 segundos para permitir novos toasts se necessário
      setTimeout(() => {
        hasShown403Toast = false;
      }, 3000);
    }
    return Promise.reject(error);
  }
);