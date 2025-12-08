import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth';

// Contexto de autenticación
interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Estado inicial
const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
};

// Provider del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const router = useRouter();

  // Verificar estado de autenticación al cargar la app
  useEffect(() => {
    checkAuthStatus();
    
    // Solo verificar autenticación al cargar, no continuamente
    // Verificar continuamente causaba que los formularios se recarguen
    
    return () => {};
  }, []);

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const token = await authService.getToken();
      const storedUser = await authService.getStoredUser();
      
      if (token && storedUser) {
        // Verificar si es un token local simulado
        const isLocalToken = token.startsWith('local_token_');
        
        if (isLocalToken) {
          // Token local, aceptarlo directamente sin validación al servidor
          console.log('✅ Autenticación local detectada');
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: storedUser,
            token,
            error: null,
          });
        } else {
          // Token de backend, verificar si sigue siendo válido
          const isValid = await authService.isAuthenticated();
          
          if (isValid) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: storedUser,
              token,
              error: null,
            });
          } else {
            // Token inválido, limpiar datos
            await authService.clearAuthData();
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              token: null,
              error: null,
            });
          }
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: 'Error verificando autenticación',
      });
    }
  };

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(credentials);
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        token: response.access_token,
        error: null,
      });
      
      console.log('✅ User logged in successfully');
      
      // Redirigir a la pantalla principal
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error en el login',
      }));
      throw error;
    }
  };

  // Función de registro
  const register = async (userData: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.register(userData);
      
      // Si no hay token, el usuario debe confirmar email primero
      if (!response.access_token) {
        console.log('⏳ Email confirmation pending');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: response.user,
          token: null,
          error: null,
        });
        // No redirigir, mostrar mensaje en pantalla de registro
        return;
      }
      
      // Si hay token, es autenticado
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        token: response.access_token,
        error: null,
      });
      
      console.log('✅ User registered successfully');
      
      // Redirigir a la pantalla principal
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error en el registro',
      }));
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null,
      });
      
      console.log('✅ User logged out successfully');
      
      // Redirigir al login
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      // Aún si hay error, limpiar el estado local
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null,
      });
      
      router.replace('/(auth)/login');
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (!authState.user?.idUsuario) {
        throw new Error('Usuario no encontrado');
      }
      
      const updatedUser = await authService.updateProfile({
        ...userData,
        idUsuario: authState.user.idUsuario,
      });
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: updatedUser,
        error: null,
      }));
      
      console.log('✅ Profile updated successfully');
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error actualizando perfil',
      }));
      throw error;
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Hook simplificado para componentes que solo necesitan el estado
export const useAuthState = () => {
  const { authState } = useAuth();
  return authState;
};

// Hook para verificar si el usuario está autenticado
export const useIsAuthenticated = () => {
  const { authState } = useAuth();
  return authState.isAuthenticated;
};

// Hook para obtener el usuario actual
export const useCurrentUser = () => {
  const { authState } = useAuth();
  return authState.user;
};

export default useAuth;