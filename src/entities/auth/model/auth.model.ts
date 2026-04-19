import { signal } from "@angular/core";

export interface AuthData extends PasswordData {
  displayName: string;
  email: string;
}

export interface PasswordData {
  password: string;
  confirmPassword: string;
}

export interface EmailAvailabilityResponse {
  available: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
}

export interface AuthResponse {
  userId: number;
  emailVerified: boolean;
}
