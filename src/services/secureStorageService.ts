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
  // --- MÉTODOS EXISTENTES (Mantener) ---

  async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_CONFIG.authTokenKey, token);
      logger.log(TAG, '✅ Token guardado de forma segura');
    } catch (error) {
      logger.error(TAG, `Error guardando token: ${error}`);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_CONFIG.authTokenKey);
    } catch (error) {
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_CONFIG.authTokenKey);
    } catch (error) {
      logger.error(TAG, `Error eliminando token: ${error}`);
    }
  }

  async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_CONFIG.userDataKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await this.removeToken();
      await AsyncStorage.removeItem(STORAGE_CONFIG.userDataKey);
      // ✅ Limpiar también el refresh token al hacer logout
      await this.deleteItem('refresh_token');
    } catch (error) {
      logger.error(TAG, `Error limpiando datos: ${error}`);
    }
  }

  // --- ✅ NUEVOS MÉTODOS GENÉRICOS (Agregar esto soluciona el error) ---

  /**
   * Guardar un item genérico en SecureStore (ej: refresh_token)
   */
  async saveItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error(TAG, `Error guardando item ${key}: ${error}`);
    }
  }

  /**
   * Obtener un item genérico de SecureStore
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  }

  /**
   * Eliminar un item genérico de SecureStore
   */
  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error(TAG, `Error eliminando item ${key}: ${error}`);
    }
  }
}

export default new SecureStorageService();
export { SecureStorageService };