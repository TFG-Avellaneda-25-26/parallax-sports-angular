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

// Los tokens vienen en HTTPOnly cookies, no necesitamos guardarlos en frontend
export interface AuthResponse {
  // Respuesta vacía o confirmación, los tokens vienen en cookies
}

export interface CheckEmailResponse {
  exists: boolean;
}

export type FormMode = 'login' | 'register';
