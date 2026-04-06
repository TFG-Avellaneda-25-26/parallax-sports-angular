export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  emailVerified: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CheckEmailResponse {
  exists: boolean;
}

export type FormMode = 'login' | 'register';
