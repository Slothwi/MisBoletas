// Interfaces que coinciden con el schema Supabase (tabla perfiles)
export interface User {
  id_usuario: string;      // UUID de Supabase
  email: string;           // Email único
  nombre_completo?: string; // Nombre del usuario
  fecha_registro?: string;  // Timestamp de registro
}

export interface LoginCredentials {
  correo: string;      // Backend espera 'correo'
  contrasena: string;  // Backend espera 'contrasena'
}

export interface RegisterData {
  nombre: string;
  correo: string;     // Backend espera 'correo'
  contrasena: string; // Backend espera 'contrasena'
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
  access_token?: string;
  token_type?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
  type?: string;
}

// Tipos para formularios
export interface LoginFormData {
  correo: string;      // Cambiar 'email' por 'correo'
  contrasena: string;  // Cambiar 'password' por 'contrasena'
  rememberMe?: boolean;
}

export interface RegisterFormData {
  nombre: string;
  correo: string;         // Cambiar 'email' por 'correo'
  contrasena: string;     // Cambiar 'password' por 'contrasena'
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

// Tipos para contexto de autenticación
export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}