// src/types/auth.tsx

// Interfaces que coinciden con el schema Supabase (tabla perfiles)
export interface User {
  id_usuario: string;
  email: string;
  nombre_completo?: string;
  avatar_url?: string;      // ✅ (Ya corregido antes)
  fecha_registro?: string;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
  rememberMe?: boolean; // ✅ AGREGADO: Esto soluciona el error "Object literal..."
}

export interface RegisterData {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string; // ✅ (Ya corregido antes)
  token_type: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
  type?: string;
}

export interface LoginFormData {
  correo: string;
  contrasena: string;
  rememberMe?: boolean;
}


export interface RegisterFormData {
  nombre: string;
  correo: string;
  contrasena: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<void>; // ✅ Actualizado
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}