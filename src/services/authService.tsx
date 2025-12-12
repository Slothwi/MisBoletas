import { ApiError, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';
import secureStorageService from './secureStorageService';
import { logger } from '../utils/logger';

const TAG = 'AuthService';

class AuthService {
  // Login de usuario
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      logger.log(TAG, `🔄 Iniciando sesión para usuario: ${credentials.correo}`);

      // El backend espera JSON con correo y contrasena (ya coinciden)
      const loginData = {
        correo: credentials.correo,
        contrasena: credentials.contrasena
      };

      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, loginData);

      if (response.access_token) {
        await this.storeTokenAndUser(response.access_token, response.user);
      }

      logger.log(TAG, '✅ Login exitoso');
      return response;

    } catch (error: any) {
      logger.error(TAG, `Error en login: ${error.response?.data || error.message}`);

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
      logger.log(TAG, `📝 Registrando usuario: ${JSON.stringify({ ...userData, contrasena: '[HIDDEN]' })}`);
      
      // Generar URL de deep linking dinámicamente
      const deepLinkUrl = 'misboletas://auth-callback';
      
      const registerData = {
        nombre: userData.nombre,
        correo: userData.correo,
        contrasena: userData.contrasena,
        redirect_to: deepLinkUrl,
      };

      logger.log(TAG, '📤 Enviando datos de registro al servidor con deep link:' + deepLinkUrl);
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, registerData);

      logger.debug(TAG, {
        hasToken: !!response.access_token,
        hasUser: !!response.user,
        tokenPreview: response.access_token ? `${response.access_token.substring(0, 20)}...` : 'NULL',
      });

      if (response.access_token) {
        logger.log(TAG, '💾 Guardando token y usuario de forma segura...');
        await this.storeTokenAndUser(response.access_token, response.user);
        logger.log(TAG, '✅ Token y usuario guardados correctamente');
      } else {
        logger.warn(TAG, 'El servidor no devolvió un token de acceso');
      }

      logger.log(TAG, '✅ Registro exitoso');
      return response;

    } catch (error: any) {
      logger.error(TAG, `Error en registro: ${error.response?.data || error.message}`);

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
      logger.log(TAG, '🚪 Cerrando sesión');
      
      await secureStorageService.clearAuthData();
      
      logger.log(TAG, '✅ Logout exitoso');
    } catch (error) {
      logger.error(TAG, `Error en logout: ${error}`);
      throw error;
    }
  }

  // Obtener token almacenado
  async getToken(): Promise<string | null> {
    try {
      return await secureStorageService.getToken();
    } catch (error) {
      logger.error(TAG, `Error obteniendo token: ${error}`);
      return null;
    }
  }

  // Obtener usuario almacenado
  async getStoredUser(): Promise<User | null> {
    try {
      return await secureStorageService.getUser();
    } catch (error) {
      logger.error(TAG, `Error obteniendo usuario: ${error}`);
      return null;
    }
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      logger.error(TAG, `Error verificando autenticación: ${error}`);
      return false;
    }
  }

  // Actualizar perfil
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      logger.log(TAG, '📝 Actualizando perfil');
      
      const response = await apiService.put<User>(`users/${userData.id_usuario}`, userData);
      
      // Actualizar en storage
      await secureStorageService.storeUser(response);
      
      logger.log(TAG, '✅ Perfil actualizado');
      return response;
    } catch (error: any) {
      logger.error(TAG, `Error actualizando perfil: ${error}`);
      throw new Error('Error actualizando perfil');
    }
  }

  // Limpiar datos de autenticación
  async clearAuthData(): Promise<void> {
    try {
      await secureStorageService.clearAuthData();
      logger.log(TAG, '🧹 Datos de autenticación limpiados');
    } catch (error) {
      logger.error(TAG, `Error limpiando datos: ${error}`);
    }
  }

  // Función auxiliar para almacenar token y usuario
  private async storeTokenAndUser(token: string, user: User): Promise<void> {
    try {
      await secureStorageService.storeToken(token);
      await secureStorageService.storeUser(user);
      logger.log(TAG, '💾 Token y usuario almacenados');
    } catch (error) {
      logger.error(TAG, `Error almacenando datos: ${error}`);
      throw error;
    }
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;
export { AuthService };