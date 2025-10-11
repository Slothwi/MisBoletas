// Interfaces que coinciden con tu backend FastAPI
export interface User {
  idUsuario: number;      // Backend: idUsuario (no 'id')
  nombre: string;         // Backend: nombre ✓
  correo: string;         // Backend: correo (no 'email')
  fechaRegistro: string;  // Backend: fechaRegistro (no 'fecha_creacion')
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

// Estados de autenticación
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