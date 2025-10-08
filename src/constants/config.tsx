import { Platform } from 'react-native';

export const ENVIRONMENTS = {
  LOCAL: 'LOCAL',
  DEV: 'DEV',
  PROD: 'PROD'
} as const;

export type Environment = keyof typeof ENVIRONMENTS;

export const CURRENT_ENV = (process.env.EXPO_PUBLIC_ENV || ENVIRONMENTS.DEV) as Environment;

// Configuración para diferentes entornos
const API_CONFIG: Record<Environment, { baseURL: string; timeout: number }> = {
  LOCAL: {
    baseURL: Platform.OS === 'android'
      ? 'http://10.0.2.2:8000/api'  // Android emulator
      : Platform.OS === 'ios'
      ? 'http://localhost:8000/api'  // iOS simulator
      : 'http://localhost:8000/api', // Web
    timeout: 15000,
  },
  DEV: {
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://back-misboletas.onrender.com',
    timeout: 15000,
  },
  PROD: {
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://back-misboletas.onrender.com',
    timeout: 10000,
  },
};

export const BASE_URL = API_CONFIG[CURRENT_ENV].baseURL;
export const API_TIMEOUT = API_CONFIG[CURRENT_ENV].timeout;

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
    api: BASE_URL,
    support: 'https://back-misboletas.onrender.com/support',
    privacyPolicy: 'https://back-misboletas.onrender.com/privacy',
    termsOfService: 'https://back-misboletas.onrender.com/terms',
  },
};

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  authTokenKey: '@MisBoletas:auth_token',
  userDataKey: '@MisBoletas:user_data',
  appSettingsKey: '@MisBoletas:app_settings',
  cacheKey: '@MisBoletas:app_cache',
};

export default {
  API_CONFIG,
  APP_CONFIG,
  STORAGE_CONFIG,
  BASE_URL,
  CURRENT_ENV,
};