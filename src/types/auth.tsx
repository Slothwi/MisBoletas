// types/auth.ts
export interface User {
  id?: string;
  username: string;
  password: string;
  email?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}