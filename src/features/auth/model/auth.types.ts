export interface BaseAuthCredentials {
  email: string;
  password: string;
}

export interface AuthCredentials extends BaseAuthCredentials {
}

export interface RegisterCredentials extends BaseAuthCredentials {
  displayName: string;
}

export interface AuthResponse {
}

export interface CheckEmailResponse {
  exists: boolean;
}

export type FormMode = 'login' | 'register';
