import { ApiError, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';
import secureStorageService from './secureStorageService';
import { logger } from '../utils/logger';

const TAG = 'AuthService';

class AuthService {
  
  // 👇 Función TRADUCTORA MEJORADA
  // Busca todas las variantes posibles de nombre para que no falle
  private mapResponseToUser(data: any): User {
    if (!data) return {} as User;
    
    return {
      id_usuario: data.id || data.id_usuario,
      email: data.email || data.correo,
      // Busca full_name, fullName, nombre_completo, nombre, name...
      nombre_completo: data.full_name || data.fullName || data.nombre_completo || data.nombre || data.name || 'Usuario',
      avatar_url: data.avatar_url,
      fecha_registro: data.created_at || data.fecha_registro
    };
  }

  async login(credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> {
    try {
      logger.log(TAG, `🔄 Iniciando sesión...`);

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

      return response;

    } catch (error: any) {
      logger.error(TAG, `Error en login: ${error.message}`);
      const errorMessage = error.response?.status === 401 ? 'Credenciales incorrectas.' : 'Error en el login.';
      throw { message: errorMessage, status: error.response?.status };
    }
  }

  async tryRefreshSession(): Promise<boolean> {
    try {
      const refreshToken = await secureStorageService.getItem('refresh_token');
      if (!refreshToken) return false;

      const response: any = await apiService.post('/users/refresh-token', { refresh_token: refreshToken });

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
    const token = await this.getToken();
    if (token) return true;
    return await this.tryRefreshSession();
  }

  async logout(): Promise<void> {
    await secureStorageService.clearAuthData();
  }

  // ✅ CORRECCIÓN CLAVE: ACTUALIZACIÓN BLINDADA
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      logger.log(TAG, '📝 Actualizando perfil');
      
      // 1. Preparamos los datos para el Backend (Python usa full_name)
      const updatePayload = {
        full_name: userData.nombre_completo, 
        avatar_url: userData.avatar_url
      };

      // 2. Enviamos al servidor
      const response: any = await apiService.put('/users/me', updatePayload);
      
      // 3. Obtenemos el usuario actual guardado
      const currentUser = await secureStorageService.getUser();
      
      // 4. MEZCLA INTELIGENTE (Optimista):
      // Tomamos el usuario actual y le sobreescribimos lo que acabamos de enviar.
      // Esto asegura que la App muestre el cambio INMEDIATAMENTE, 
      // incluso si el backend devuelve un formato raro.
      const finalUser: User = {
        ...currentUser!, // Datos viejos
        ...this.mapResponseToUser(response), // Datos del server (si vienen bien)
        // 👇 FORZAMOS lo que el usuario escribió para asegurar que se vea
        nombre_completo: userData.nombre_completo || currentUser?.nombre_completo || 'Usuario',
        avatar_url: userData.avatar_url || currentUser?.avatar_url
      };
      
      // 5. Guardamos en el celular el usuario corregido
      const token = await this.getToken();
      if (token) {
        await this.storeTokenAndUser(token, finalUser);
      }
      
      return finalUser;
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