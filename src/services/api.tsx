import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { BASE_URL, API_TIMEOUT } from '../constants/config';
import secureStorageService from './secureStorageService';
import { logger } from '../utils/logger';

const TAG = 'APIService';

// Configuración del axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para requests - Agregar JWT Token
api.interceptors.request.use(
  async (config) => {
    try {
      logger.log(TAG, `🔍 Request interceptor: ${config.url}`);
      
      const token = await secureStorageService.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        logger.log(TAG, '✅ Token added to request headers');
      } else {
        logger.warn(TAG, 'No token found in secure storage');
      }
      
      if (__DEV__) {
        logger.debug(TAG, {
          method: config.method?.toUpperCase(),
          url: (config.baseURL || '') + (config.url || ''),
          hasAuth: !!config.headers.Authorization,
        });
      }
    } catch (error) {
      logger.error(TAG, `Error getting auth token: ${error}`);
    }
    
    return config;
  },
  (error) => {
    logger.error(TAG, `Request interceptor error: ${error}`);
    return Promise.reject(error);
  }
);

// Interceptor para responses - Manejo de errores y logs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      logger.debug(TAG, {
        status: response.status,
        url: response.config.url,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      logger.debug(TAG, {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
    }

    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await secureStorageService.clearAuthData();
        logger.log(TAG, '⚠️ Token expired, user logged out');
      } catch (storageError) {
        logger.error(TAG, `Error clearing storage: ${storageError}`);
      }
    }
    
    // Manejo de errores de red
    if (!error.response) {
      // Error de conexión
      logger.error(TAG, 'Network error - no response received');
      return Promise.reject({
        message: 'Error de conexión. Verifica tu internet.',
        type: 'NETWORK_ERROR'
      });
    }
    
    // Formatear error para el frontend
    const errorMessage = (error.response?.data as any)?.detail || 
                        (error.response?.data as any)?.message || 
                        error.message || 
                        'Error desconocido';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      type: 'API_ERROR'
    });
  }
);

// Funciones helper para diferentes tipos de requests
export const apiService = {
  // Helper para asegurar que las URLs estén bien formadas
  _normalizeUrl: (url: string): string => {
    // Si la URL ya empieza con /, la dejamos como está
    // Si no, agregamos el /
    return url.startsWith('/') ? url : `/${url}`;
  },

  // GET requests
  get: async <T = any>(url: string, params?: object): Promise<T> => {
    const response = await api.get(apiService._normalizeUrl(url), { params });
    return response.data;
  },

  // POST requests
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.post(apiService._normalizeUrl(url), data);
    return response.data;
  },

  // PUT requests
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.put(apiService._normalizeUrl(url), data);
    return response.data;
  },

  // DELETE requests
  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete(apiService._normalizeUrl(url));
    return response.data;
  },

  // PATCH requests
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.patch(apiService._normalizeUrl(url), data);
    return response.data;
  },

  // Upload file
  uploadFile: async <T = any>(url: string, formData: FormData): Promise<T> => {
    const response = await api.post(apiService._normalizeUrl(url), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
      // Cambié de /health a /docs para usar el endpoint que sí existe
      await api.get('/docs');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Get current config
  getConfig: () => ({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
  }),
};

export { api };
export default api;