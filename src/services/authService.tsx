import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, LoginResponse, RegisterResponse, User } from '../types/auth';
import { api } from './api';

const AUTH_TOKEN_KEY = '@MisBoletas:token';
const USER_DATA_KEY = '@MisBoletas:userData';

/**
 * Registra un nuevo usuario en el backend
 */
export const registerUser = async (user: User): Promise<RegisterResponse> => {
  try {
    console.log('🔄 Registrando usuario:', user.username);
    
    const response = await api.post<RegisterResponse>('auth/register', {
      username: user.username,
      password: user.password,
      email: user.email || `${user.username}@ejemplo.com`
    });

    console.log('✅ Usuario registrado exitosamente');
    return response.data;

  } catch (error: any) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
    
    const apiError: ApiError = {
      message: error.response?.data?.message || 
               error.response?.data?.detail || 
               'Error en el registro. Por favor intenta nuevamente.',
      status: error.response?.status,
      details: error.response?.data,
    };
    
    throw apiError;
  }
};

/**
 * Inicia sesión de usuario en el backend
 */
export const loginUser = async (credentials: Omit<User, 'email'>): Promise<LoginResponse> => {
  try {
    console.log('🔄 Iniciando sesión para usuario:', credentials.username);

    // Para FastAPI (usando OAuth2 compatible)
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<LoginResponse>('auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Login exitoso');
    return response.data;

  } catch (error: any) {
    console.error('❌ Error en login:', error.response?.data || error.message);

    // Mapeo de errores comunes de FastAPI
    let errorMessage = 'Error en el login. Por favor intenta nuevamente.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Usuario no encontrado.';
    } else if (error.response?.status === 422) {
      errorMessage = 'Datos de entrada inválidos.';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Error de conexión. Verifica tu internet.';
    } else if (error.code === 'TIMEOUT_ERROR') {
      errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.';
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
      details: error.response?.data,
    };

    throw apiError;
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 */
export const getUserProfile = async (token: string): Promise<any> => {
  try {
    console.log('🔄 Obteniendo perfil de usuario');

    const response = await api.get('auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Perfil obtenido exitosamente');
    return response.data;

  } catch (error: any) {
    console.error('❌ Error obteniendo perfil:', error.response?.data || error.message);

    const apiError: ApiError = {
      message: error.response?.data?.message || 
               'Error obteniendo perfil de usuario',
      status: error.response?.status,
      details: error.response?.data,
    };

    throw apiError;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async (token: string): Promise<void> => {
  try {
    console.log('🔄 Cerrando sesión en el servidor');

    await api.post('auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Logout exitoso en servidor');

  } catch (error: any) {
    // Aún si hay error, consideramos el logout exitoso del lado del cliente
    console.warn('⚠️ Warning durante logout en servidor:', error.response?.data || error.message);
    
    // No lanzamos error para no interrumpir el logout del cliente
    // Solo log el warning y continuamos
  }
};

/**
 * Verifica si el token es válido
 */
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await getUserProfile(token);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Actualiza los datos del usuario
 */
export const updateUserProfile = async (
  userId: string, 
  userData: Partial<User>, 
  token: string
): Promise<any> => {
  try {
    console.log('🔄 Actualizando perfil de usuario:', userId);

    const response = await api.put(`auth/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Perfil actualizado exitosamente');
    return response.data;

  } catch (error: any) {
    console.error('❌ Error actualizando perfil:', error.response?.data || error.message);

    const apiError: ApiError = {
      message: error.response?.data?.message || 
               'Error actualizando perfil de usuario',
      status: error.response?.status,
      details: error.response?.data,
    };

    throw apiError;
  }
};

/**
 * Solicita restablecimiento de contraseña
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    console.log('🔄 Solicitando restablecimiento de contraseña para:', email);

    await api.post('auth/forgot-password', { email });

    console.log('✅ Solicitud de restablecimiento enviada');

  } catch (error: any) {
    console.error('❌ Error solicitando restablecimiento:', error.response?.data || error.message);

    const apiError: ApiError = {
      message: error.response?.data?.message || 
               'Error solicitando restablecimiento de contraseña',
      status: error.response?.status,
      details: error.response?.data,
    };

    throw apiError;
  }
};

/**
 * Restablece la contraseña con token
 */
export const resetPassword = async (
  token: string, 
  newPassword: string
): Promise<void> => {
  try {
    console.log('🔄 Restableciendo contraseña');

    await api.post('auth/reset-password', {
      token,
      new_password: newPassword
    });

    console.log('✅ Contraseña restablecida exitosamente');

  } catch (error: any) {
    console.error('❌ Error restableciendo contraseña:', error.response?.data || error.message);

    const apiError: ApiError = {
      message: error.response?.data?.message || 
               'Error restableciendo contraseña',
      status: error.response?.status,
      details: error.response?.data,
    };

    throw apiError;
  }
};

// Funciones de manejo de token
export const saveAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

// Función para guardar datos del usuario
export const saveUserData = async (userData: any) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Función para obtener datos del usuario
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Función para limpiar todos los datos de autenticación
export const clearAuthData = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_DATA_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  verifyToken,
  updateUserProfile,
  requestPasswordReset,
  resetPassword,
};