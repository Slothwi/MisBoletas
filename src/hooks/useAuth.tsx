import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { clearAuthData, getAuthToken, getUserData, getUserProfile, loginUser, logoutUser, registerUser, saveAuthToken, saveUserData } from '@/src/services/authService';
import { ApiError, User } from '@/src/types/auth';

interface UseAuthReturn {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: Omit<User, 'email'>) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const isAuthenticated = !!token && !!user;

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials: Omit<User, 'email'>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(credentials);
      
      // Guardar token y datos del usuario
      await saveAuthToken(response.access_token);
      await saveUserData(response.user);
      
      setToken(response.access_token);
      setUser(response.user);
      
      console.log('✅ Login exitoso');
      
      // Redirigir a la pantalla principal
      router.replace('/(tabs)');
      
    } catch (err) {
      const authError = err as ApiError;
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: User): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await registerUser(userData);
      console.log('✅ Registro exitoso');
      
    } catch (err) {
      const authError = err as ApiError;
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Intentar cerrar sesión en el servidor si tenemos token
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.warn('Warning during server logout:', error);
    } finally {
      // Siempre limpiamos el almacenamiento local
      await clearAuthData();
      setToken(null);
      setUser(null);
      setLoading(false);
      console.log('✅ Logout exitoso');
      
      // Redirigir al login
      router.replace('/(auth)/login');
    }
  }, [token, router]);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const storedToken = await getAuthToken();
      const storedUser = await getUserData();
      
      if (storedToken && storedUser) {
        // Verificar si el token es válido obteniendo el perfil actualizado
        try {
          const userProfile = await getUserProfile(storedToken);
          setToken(storedToken);
          setUser(userProfile);
          console.log('✅ Sesión verificada correctamente');
        } catch (error) {
          // Token inválido, limpiamos todo
          console.warn('Token inválido, limpiando sesión');
          await clearAuthData();
          setToken(null);
          setUser(null);
        }
      } else {
        // No hay token almacenado, asegurarse de que el estado esté limpio
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      await clearAuthData();
      setToken(null);
      setUser(null);
    }
  }, []);

  // Verificar autenticación al cargar el hook
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Efecto para redirigir si no está autenticado y está en una ruta protegida
  useEffect(() => {
    const checkRouteProtection = async () => {
      const currentRoute = router;
      
      // Si no está autenticado y está intentando acceder a rutas de tabs, redirigir al login
      if (!isAuthenticated && !loading) {
        // Puedes agregar lógica adicional aquí para verificar rutas específicas
        console.log('Usuario no autenticado, verificando ruta actual...');
      }
    };

    checkRouteProtection();
  }, [isAuthenticated, loading, router]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };
};