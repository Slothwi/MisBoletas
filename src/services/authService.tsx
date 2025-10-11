import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, LoginResponse, RegisterResponse, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiService } from './api';
import { STORAGE_CONFIG, API_ENDPOINTS } from '../constants/config';

// Usar las mismas claves que en config.tsx para consistencia
const AUTH_TOKEN_KEY = STORAGE_CONFIG.authTokenKey;
const USER_DATA_KEY = STORAGE_CONFIG.userDataKey;

class AuthService {
  // Login de usuario
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔄 Iniciando sesión para usuario:', credentials.correo);

      // El backend espera JSON con correo y contrasena (ya coinciden)
      const loginData = {
        correo: credentials.correo,
        contrasena: credentials.contrasena
      };

      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, loginData);

      if (response.access_token) {
        await this.storeTokenAndUser(response.access_token, response.user);
      }

      console.log('✅ Login exitoso');
      return response;

    } catch (error: any) {
      console.error('❌ Error en login:', error.response?.data || error.message);

      let errorMessage = 'Error en el login. Por favor intenta nuevamente.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Datos de entrada inválidos.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: error.response?.status,
        details: error.response?.data,
      };

      throw apiError;
    }
  }

  // Registro de usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Registrando usuario:', { ...userData, contrasena: '[HIDDEN]' });
      
      const registerData = {
        nombre: userData.nombre,
        correo: userData.correo,
        contrasena: userData.contrasena,
      };

      console.log('📤 Enviando datos de registro al servidor...');
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, registerData);

      console.log('📥 Respuesta del servidor:', {
        hasToken: !!response.access_token,
        hasUser: !!response.user,
        tokenPreview: response.access_token ? `${response.access_token.substring(0, 20)}...` : 'NULL',
      });

      if (response.access_token) {
        console.log('💾 Guardando token y usuario en AsyncStorage...');
        await this.storeTokenAndUser(response.access_token, response.user);
        console.log('✅ Token y usuario guardados correctamente');
      } else {
        console.warn('⚠️ El servidor no devolvió un token de acceso');
      }

      console.log('✅ Registro exitoso');
      return response;

    } catch (error: any) {
      console.error('❌ Error en registro:', error.response?.data || error.message);

      let errorMessage = 'Error en el registro. Por favor intenta nuevamente.';
      
      if (error.response?.status === 400) {
        errorMessage = 'El correo ya está registrado o datos inválidos.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Datos de entrada inválidos.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      throw new Error(errorMessage);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      console.log('🚪 Cerrando sesión');
      
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      throw error;
    }
  }

  // Obtener token almacenado
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  // Obtener usuario almacenado
  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_DATA_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      return false;
    }
  }

  // Actualizar perfil
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      console.log('📝 Actualizando perfil');
      
      const response = await apiService.put<User>(`users/${userData.idUsuario}`, userData);
      
      // Actualizar en storage
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response));
      
      console.log('✅ Perfil actualizado');
      return response;
    } catch (error: any) {
      console.error('❌ Error actualizando perfil:', error);
      throw new Error('Error actualizando perfil');
    }
  }

  // Limpiar datos de autenticación
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      console.log('🧹 Datos de autenticación limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  }

  // Función auxiliar para almacenar token y usuario
  private async storeTokenAndUser(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [AUTH_TOKEN_KEY, token],
        [USER_DATA_KEY, JSON.stringify(user)],
      ]);
      console.log('💾 Token y usuario almacenados');
    } catch (error) {
      console.error('❌ Error almacenando datos:', error);
      throw error;
    }
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;
export { AuthService };