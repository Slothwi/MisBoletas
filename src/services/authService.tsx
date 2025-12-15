import { ApiError, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';
import secureStorageService from './secureStorageService';
import { logger } from '../utils/logger';

const TAG = 'AuthService';

class AuthService {
  
  // 👇 Función TRADUCTORA: Backend (Inglés) -> App (Español)
  private mapResponseToUser(data: any): User {
    return {
      id_usuario: data.id || data.id_usuario,
      email: data.email || data.correo,
      // Prioridad: full_name (backend) > nombre_completo (app) > nombre > "Usuario"
      nombre_completo: data.full_name || data.nombre_completo || data.nombre || 'Usuario',
      avatar_url: data.avatar_url, // Ahora guardará "boletin", "boletina", etc.
      fecha_registro: data.created_at || data.fecha_registro
    };
  }

  async login(credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> {
    try {
      logger.log(TAG, `🔄 Iniciando sesión... Recordarme: ${credentials.rememberMe}`);

      const loginData = {
        correo: credentials.correo,
        contrasena: credentials.contrasena
      };

      const response: any = await apiService.post(API_ENDPOINTS.auth.login, loginData);

      if (response.access_token) {
        const userMapped = this.mapResponseToUser(response.user);
        await this.storeTokenAndUser(response.access_token, userMapped);

        if (credentials.rememberMe && response.refresh_token) {
          await secureStorageService.saveItem('refresh_token', response.refresh_token);
        } else {
          await secureStorageService.deleteItem('refresh_token');
        }
        
        return { ...response, user: userMapped };
      }

      logger.log(TAG, '✅ Login exitoso');
      return response;

    } catch (error: any) {
      logger.error(TAG, `Error en login: ${error.response?.data || error.message}`);
      let errorMessage = 'Error en el login.';
      if (error.response?.status === 401) errorMessage = 'Credenciales incorrectas.';
      
      const apiError: ApiError = {
        message: errorMessage,
        status: error.response?.status,
        details: error.response?.data,
      };
      throw apiError;
    }
  }

  async tryRefreshSession(): Promise<boolean> {
    try {
      const refreshToken = await secureStorageService.getItem('refresh_token');
      if (!refreshToken) return false;

      const response: any = await apiService.post('/users/refresh-token', {
        refresh_token: refreshToken
      });

      if (response.access_token) {
        const userMapped = this.mapResponseToUser(response.user);
        await this.storeTokenAndUser(response.access_token, userMapped);
        return true;
      }
      return false;
    } catch (error) {
      await this.logout();
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (token) return true;
      return await this.tryRefreshSession();
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    await secureStorageService.clearAuthData();
  }

  // ✅ CORREGIDO: Envía 'full_name' y traduce la respuesta
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      logger.log(TAG, '📝 Actualizando perfil');
      
      // Traducimos App -> Backend
      const updatePayload = {
        full_name: userData.nombre_completo, 
        avatar_url: userData.avatar_url
      };

      const response: any = await apiService.put('/users/me', updatePayload);
      
      // Traducimos Backend -> App
      const updatedUserMapped = this.mapResponseToUser(response);
      
      const currentUser = await secureStorageService.getUser();
      if (currentUser) {
        await secureStorageService.storeUser({ ...currentUser, ...updatedUserMapped });
      }
      
      return updatedUserMapped;
    } catch (error: any) {
      logger.error(TAG, `Error actualizando perfil: ${error}`);
      throw new Error('Error actualizando perfil');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
       try {
        const registerData = {
            nombre: userData.nombre,
            correo: userData.correo,
            contrasena: userData.contrasena,
        };
        const response: any = await apiService.post(API_ENDPOINTS.auth.register, registerData);
        
        if (response.access_token) {
            const userMapped = this.mapResponseToUser(response.user);
            await this.storeTokenAndUser(response.access_token, userMapped);
            return { ...response, user: userMapped };
        }
        return response;
    } catch (error: any) {
         let errorMessage = 'Error en registro';
         if(error.response?.status === 400) errorMessage = 'El correo ya existe.';
         throw new Error(errorMessage);
    }
  }
  
  async getToken(): Promise<string | null> { return await secureStorageService.getToken(); }
  async getStoredUser(): Promise<User | null> { return await secureStorageService.getUser(); }
  
  private async storeTokenAndUser(token: string, user: User): Promise<void> {
    await secureStorageService.storeToken(token);
    await secureStorageService.storeUser(user);
  }
}

export default new AuthService();