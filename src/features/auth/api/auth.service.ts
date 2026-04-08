import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  AuthCredentials, 
  RegisterCredentials, 
  AuthResponse,
  CheckEmailResponse 
} from '../model/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authEndpoint = '/api/auth';

  // Signals para almacenar estados de respuestas
  private authResponse = signal<AuthResponse | null>(null);
  private authError = signal<any>(null);
  private authLoading = signal(false);

  private registerResponse = signal<AuthResponse | null>(null);
  private registerError = signal<any>(null);
  private registerLoading = signal(false);

  private checkEmailResponse = signal<CheckEmailResponse | null>(null);
  private checkEmailError = signal<any>(null);

  // Getters para acceder a los signals desde componentes
  getAuthResponse(): Signal<AuthResponse | null> {
    return this.authResponse.asReadonly();
  }

  getAuthError(): Signal<any> {
    return this.authError.asReadonly();
  }

  getAuthLoading(): Signal<boolean> {
    return this.authLoading.asReadonly();
  }

  getRegisterResponse(): Signal<AuthResponse | null> {
    return this.registerResponse.asReadonly();
  }

  getRegisterError(): Signal<any> {
    return this.registerError.asReadonly();
  }

  getRegisterLoading(): Signal<boolean> {
    return this.registerLoading.asReadonly();
  }

  getCheckEmailResponse(): Signal<CheckEmailResponse | null> {
    return this.checkEmailResponse.asReadonly();
  }

  getCheckEmailError(): Signal<any> {
    return this.checkEmailError.asReadonly();
  }

  // Métodos para ejecutar llamadas
  login(credentials: AuthCredentials): void {
    this.authLoading.set(true);
    this.authError.set(null);

    this.http.post<AuthResponse>(
      `${this.authEndpoint}/login`,
      credentials
    ).subscribe({
      next: (response) => {
        this.authResponse.set(response);
        this.authLoading.set(false);
      },
      error: (err) => {
        this.authError.set(err);
        this.authLoading.set(false);
      },
    });
  }

  register(credentials: RegisterCredentials): void {
    this.registerLoading.set(true);
    this.registerError.set(null);

    this.http.post<AuthResponse>(
      `${this.authEndpoint}/register`,
      credentials
    ).subscribe({
      next: (response) => {
        this.registerResponse.set(response);
        this.registerLoading.set(false);
      },
      error: (err) => {
        this.registerError.set(err);
        this.registerLoading.set(false);
      },
    });
  }

  checkEmailExists(email: string): void {
    this.http.get<CheckEmailResponse>(
      `${this.authEndpoint}/check-email?email=${encodeURIComponent(email)}`
    ).subscribe({
      next: (response) => {
        this.checkEmailResponse.set(response);
      },
      error: (err) => {
        this.checkEmailError.set(err);
      },
    });
  }
}
