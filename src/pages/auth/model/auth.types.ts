export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface BaseAuthCredentials {
  email: string;
  password: string;
}

export interface AuthCredentials extends BaseAuthCredentials {
  // Solo email y password
}

export interface RegisterCredentials extends BaseAuthCredentials {
  displayName: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string | null;
  emailVerified: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CheckEmailResponse {
  exists: boolean;
}

export type FormMode = 'login' | 'register';
