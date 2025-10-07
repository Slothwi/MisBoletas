// src/services/api.ts

import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '../constants/config';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar tokens
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar el token de autenticación si lo necesitas
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores comunes como 401, 403, etc.
    if (error.response?.status === 401) {
      // Manejar desautorización
    }
    return Promise.reject(error);
  }
);