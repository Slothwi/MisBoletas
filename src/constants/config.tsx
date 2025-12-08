import { Platform } from 'react-native';

export const ENVIRONMENTS = {
  LOCAL: 'LOCAL',
  DEV: 'DEV',
  PROD: 'PROD'
} as const;

export type Environment = keyof typeof ENVIRONMENTS;

export const CURRENT_ENV = (process.env.EXPO_PUBLIC_ENV || ENVIRONMENTS.PROD) as Environment;

// Leer URLs desde variables de entorno
const getApiUrl = (): string => {
  switch (CURRENT_ENV) {
    case 'LOCAL':
      return process.env.EXPO_PUBLIC_API_URL_LOCAL || 'http://192.168.88.3:8000/api/v1';
    case 'DEV':
      return process.env.EXPO_PUBLIC_API_URL_DEV || 'http://192.168.88.3:8000/api/v1';
    case 'PROD':
      return process.env.EXPO_PUBLIC_API_URL_PROD || 'https://misboletas-backend.onrender.com/api/v1';
    default:
      return 'https://misboletas-backend.onrender.com/api/v1';
  }
};

// Configuración para diferentes entornos
const API_CONFIG: Record<Environment, { baseURL: string; timeout: number }> = {
  LOCAL: {
    baseURL: getApiUrl(),
    timeout: 15000,
  },
  DEV: {
    baseURL: getApiUrl(),
    timeout: 15000,
  },
  PROD: {
    baseURL: getApiUrl(),
    timeout: 10000,
  },
};

export const BASE_URL = API_CONFIG[CURRENT_ENV].baseURL;
export const API_TIMEOUT = API_CONFIG[CURRENT_ENV].timeout;

// Log para debugging (solo en desarrollo)
if (__DEV__) {
  console.log('🌍 Environment:', CURRENT_ENV);
  console.log('🔗 API URL:', BASE_URL);
}

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Mis Boletas',
  version: '1.0.0',
  environment: CURRENT_ENV,
  
  // Features flags
  features: {
    enableAnalytics: CURRENT_ENV === 'PROD',
    enableDebugMenu: __DEV__,
    enableMockData: __DEV__,
  },
  
  // URLs importantes
  urls: {
    support: 'https://support.tu-dominio.com',
    privacyPolicy: 'https://tu-dominio.com/privacy',
    termsOfService: 'https://tu-dominio.com/terms',
  },
};

// Configuración de almacenamiento - Compatible con tu backend
export const STORAGE_CONFIG = {
  authTokenKey: '@MisBoletas:auth_token',
  userDataKey: '@MisBoletas:user_data', 
  appSettingsKey: '@MisBoletas:app_settings',
  cacheKey: '@MisBoletas:app_cache',
};

// Endpoints específicos de tu backend FastAPI
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    register: '/users/register',  // ✅ CORREGIDO: POST /users/register
    login: '/users/login',        // ✅ CORREGIDO: POST /users/login
    verifyOTP: '/users/verify-otp',  // POST /users/verify-otp (para deep links)
    confirm: '/users/confirm',    // GET /users/confirm (puente email → app)
    profile: '/users/me',
    updateProfile: '/users/',
  },
  // Categorías
  categorias: {
    list: '/categorias/',
    create: '/categorias/',
    update: '/categorias/',
    delete: '/categorias/',
    search: '/categorias/buscar/nombre/',
    colors: '/categorias/colores/predefinidos',
    stats: '/categorias/estadisticas/resumen',
  },
  // Productos
  productos: {
    list: '/productos/',  // Cambio: Era "/products/" → Ahora "/productos/" (coincide con backend)
    create: '/productos/',
    update: '/productos/',
    delete: '/productos/',
    categorias: '/productos/:id/categorias',
    addToCategory: '/productos/:id/categorias/:categoryId',
    removeFromCategory: '/productos/:id/categorias/:categoryId',
  },
  // Documentos
  documentos: {
    upload: '/documentos/upload/:productoId',
    list: '/documentos/by-product/:productoId',
    get: '/documentos/:documentoId',
    delete: '/documentos/:documentoId',
  },
  // Tickets de Soporte
  tickets: {
    create: '/tickets',
    list: '/tickets',
    detail: '/tickets/{id}',
  },
};

export default {
  API_CONFIG,
  APP_CONFIG,
  STORAGE_CONFIG,
  API_ENDPOINTS,
  BASE_URL,
  CURRENT_ENV,
};