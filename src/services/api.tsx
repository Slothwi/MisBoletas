import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, API_TIMEOUT, STORAGE_CONFIG } from '../constants/config';

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
      console.log('🔍 Request interceptor start for:', config.url);
      console.log('🔍 Using token key:', STORAGE_CONFIG.authTokenKey);
      
      const token = await AsyncStorage.getItem(STORAGE_CONFIG.authTokenKey);
      
      console.log('🔍 Request interceptor:', {
        url: (config.baseURL || '') + (config.url || ''),
        tokenExists: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NULL',
        tokenKey: STORAGE_CONFIG.authTokenKey
      });
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request headers');
      } else {
        console.log('⚠️ No token found in AsyncStorage for key:', STORAGE_CONFIG.authTokenKey);
        
        // Vamos a verificar qué claves existen
        try {
          const allKeys = await AsyncStorage.getAllKeys();
          console.log('📱 All AsyncStorage keys:', allKeys);
          
          // Intentar buscar tokens con diferentes claves
          const possibleTokenKeys = allKeys.filter(key => key.includes('token') || key.includes('auth'));
          for (const key of possibleTokenKeys) {
            const value = await AsyncStorage.getItem(key);
            console.log(`🔑 Found potential token in key "${key}":`, value ? `${value.substring(0, 20)}...` : 'NULL');
          }
        } catch (storageError) {
          console.error('❌ Error checking AsyncStorage keys:', storageError);
        }
      }
      
      // Log para debugging en desarrollo
      if (__DEV__) {
        console.log('🔵 API Request:', {
          method: config.method?.toUpperCase(),
          url: (config.baseURL || '') + (config.url || ''),
          hasAuth: !!config.headers.Authorization,
          headers: config.headers,
          data: config.data,
        });
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - Manejo de errores y logs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log para debugging en desarrollo
    if (__DEV__) {
      console.log('🟢 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Log para debugging
    if (__DEV__) {
      console.log('🔴 API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await AsyncStorage.multiRemove([
          STORAGE_CONFIG.authTokenKey,
          STORAGE_CONFIG.userDataKey
        ]);
        
        // Navegar al login (se implementará en los componentes)
        console.log('Token expired, user logged out');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    
    // Manejo de errores de red
    if (!error.response) {
      // Error de conexión
      console.error('Network error - no response received');
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