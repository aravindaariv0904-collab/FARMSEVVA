import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// In production, this comes from ENV
const API_URL = 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., auto logout or refresh token)
      useAuthStore.getState().logout();
    }
    // Could add retry logic here for network errors
    return Promise.reject(error);
  }
);
