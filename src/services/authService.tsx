import { ApiError, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';
import secureStorageService from './secureStorageService';
import { logger } from '../utils/logger';

const TAG = 'AuthService';

class AuthService {
  // ✅ MODIFICADO: Acepta credentials Y rememberMe
  async login(credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> {
    try {
      logger.log(TAG, `🔄 Iniciando sesión... Recordarme: ${credentials.rememberMe}`);

      // Datos puros para el backend (sin rememberMe)
      const loginData = {
        correo: credentials.correo,
        contrasena: credentials.contrasena
      };

      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, loginData);

      if (response.access_token) {
        // 1. Guardar Access Token y Usuario
        await this.storeTokenAndUser(response.access_token, response.user);

        // 2. Lógica "Recordarme" (Refresh Token)
        if (credentials.rememberMe && response.refresh_token) {
          logger.log(TAG, '💾 Guardando Refresh Token');
          // ✅ Ahora secureStorageService sí tiene saveItem
          await secureStorageService.saveItem('refresh_token', response.refresh_token);
        } else {
          // Si no marcó recordarme, borramos cualquier refresh token previo
          await secureStorageService.deleteItem('refresh_token');
        }
      }

      logger.log(TAG, '✅ Login exitoso');
      return response;

    } catch (error: any) {
      logger.error(TAG, `Error en login: ${error.response?.data || error.message}`);
      // ... manejo de errores estándar ...
      let errorMessage = 'Error en el login.';
      if (error.response?.status === 401) errorMessage = 'Credenciales incorrectas.';
      else if (error.response?.status === 404) errorMessage = 'Usuario no encontrado.';
      
      const apiError: ApiError = {
        message: errorMessage,
        status: error.response?.status,
        details: error.response?.data,
      };
      throw apiError;
    }
  }

  // ✅ NUEVO: Intentar refrescar sesión
  async tryRefreshSession(): Promise<boolean> {
    try {
      const refreshToken = await secureStorageService.getItem('refresh_token');
      if (!refreshToken) return false;

      logger.log(TAG, '🔄 Renovando sesión...');
      // Endpoint para refrescar (asegúrate que el backend lo tenga)
      const response = await apiService.post<AuthResponse>('/users/refresh-token', {
        refresh_token: refreshToken
      });

      if (response.access_token) {
        await this.storeTokenAndUser(response.access_token, response.user);
        if (response.refresh_token) {
            await secureStorageService.saveItem('refresh_token', response.refresh_token);
        }
        return true;
      }
      return false;
    } catch (error) {
      logger.warn(TAG, '❌ Sesión expirada, requiere login');
      await this.logout();
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (token) return true;
      
      // Si no hay token, intentar refrescar antes de decir que no
      return await this.tryRefreshSession();
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      logger.log(TAG, '🚪 Cerrando sesión');
      await secureStorageService.clearAuthData();
    } catch (error) {
      logger.error(TAG, `Error en logout: ${error}`);
      throw error;
    }
  }

  // ✅ CORREGIDO: updateProfile con endpoint y tipos correctos
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      logger.log(TAG, '📝 Actualizando perfil');
      
      // Mapeo para el backend (User -> UserUpdateRequest)
      const updatePayload = {
        nombre_usuario: userData.nombre_completo,
        avatar_url: userData.avatar_url
      };

      // Endpoint correcto: /users/me
      const response = await apiService.put<User>('/users/me', updatePayload);
      
      // Actualizar localmente
      const currentUser = await secureStorageService.getUser();
      if (currentUser) {
        await secureStorageService.storeUser({ ...currentUser, ...response });
      }
      
      return response;
    } catch (error: any) {
      logger.error(TAG, `Error actualizando perfil: ${error}`);
      throw new Error('Error actualizando perfil');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
      // ... (Mismo código de registro que tenías, funciona bien) ...
       try {
        const deepLinkUrl = 'misboletas://auth-callback';
        const registerData = {
            nombre: userData.nombre,
            correo: userData.correo,
            contrasena: userData.contrasena,
            redirect_to: deepLinkUrl,
        };
        const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, registerData);
        if (response.access_token) {
            await this.storeTokenAndUser(response.access_token, response.user);
        }
        return response;
    } catch (error: any) {
         let errorMessage = 'Error en registro';
         if(error.response?.status === 400) errorMessage = 'El correo ya existe.';
         throw new Error(errorMessage);
    }
  }
  
  // Helpers
  async getToken(): Promise<string | null> { return await secureStorageService.getToken(); }
  async getStoredUser(): Promise<User | null> { return await secureStorageService.getUser(); }
  
  private async storeTokenAndUser(token: string, user: User): Promise<void> {
    await secureStorageService.storeToken(token);
    await secureStorageService.storeUser(user);
  }
}

export default new AuthService();