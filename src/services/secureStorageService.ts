/**
 * Servicio centralizado de almacenamiento seguro
 * Maneja tokens en Secure Storage (encriptado)
 * Maneja datos de usuario en AsyncStorage (no sensible)
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_CONFIG } from '../constants/config';
import { logger } from '../utils/logger';
import { User } from '../types/auth';

const TAG = 'SecureStorageService';

class SecureStorageService {
  /**
   * Guardar token de forma segura (encriptado)
   */
  async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_CONFIG.authTokenKey, token);
      logger.log(TAG, '✅ Token guardado de forma segura');
    } catch (error) {
      logger.error(TAG, `Error guardando token: ${error}`);
      throw error;
    }
  }

  /**
   * Obtener token almacenado de forma segura
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_CONFIG.authTokenKey);
      if (token) {
        logger.log(TAG, '✅ Token recuperado desde almacenamiento seguro');
      } else {
        logger.log(TAG, '⚠️ No hay token almacenado');
      }
      return token;
    } catch (error) {
      logger.error(TAG, `Error recuperando token: ${error}`);
      return null;
    }
  }

  /**
   * Eliminar token
   */
  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_CONFIG.authTokenKey);
      logger.log(TAG, '✅ Token eliminado');
    } catch (error) {
      logger.error(TAG, `Error eliminando token: ${error}`);
    }
  }

  /**
   * Guardar datos del usuario (no sensible, en AsyncStorage)
   */
  async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(user));
      logger.log(TAG, `✅ Usuario ${user.email} guardado`);
    } catch (error) {
      logger.error(TAG, `Error guardando usuario: ${error}`);
      throw error;
    }
  }

  /**
   * Obtener datos del usuario almacenado
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_CONFIG.userDataKey);
      if (userJson) {
        const user = JSON.parse(userJson);
        logger.log(TAG, `✅ Usuario recuperado: ${user.email}`);
        return user;
      }
      logger.log(TAG, '⚠️ No hay usuario almacenado');
      return null;
    } catch (error) {
      logger.error(TAG, `Error recuperando usuario: ${error}`);
      return null;
    }
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  async clearAuthData(): Promise<void> {
    try {
      await this.removeToken();
      await AsyncStorage.removeItem(STORAGE_CONFIG.userDataKey);
      logger.log(TAG, '✅ Datos de autenticación limpiados');
    } catch (error) {
      logger.error(TAG, `Error limpiando datos: ${error}`);
    }
  }

  /**
   * Obtener todos los datos de autenticación (token + user)
   */
  async getAuthData(): Promise<{ token: string | null; user: User | null }> {
    try {
      const token = await this.getToken();
      const user = await this.getUser();
      return { token, user };
    } catch (error) {
      logger.error(TAG, `Error obteniendo datos de auth: ${error}`);
      return { token: null, user: null };
    }
  }
}

export default new SecureStorageService();
