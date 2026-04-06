import { Injectable, effect, inject, signal } from '@angular/core';
import { 
  AuthUser,
  AuthResponse,
  FormMode 
} from './auth.types';
import { TokenStorage } from '../lib/token.storage';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenStorage = inject(TokenStorage);

  // Signals
  user = signal<AuthUser | null>(null);
  refreshToken = signal<string | null>(null);
  status = signal<'idle' | 'loading' | 'authenticated' | 'error'>('idle');
  error = signal<string | null>(null);
  currentFormMode = signal<FormMode>('login');

  // Computed signals
  isAuthenticated = signal(this.tokenStorage.has());
  isLoading() {
    return this.status() === 'loading';
  }

  hasError() {
    return this.status() === 'error';
  }

  setLoading(): void {
    this.status.set('loading');
    this.error.set(null);
  }

  setAuthenticatedUser(response: AuthResponse, user: AuthUser): void {
    // Store tokens
    this.tokenStorage.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
    
    // Store user info
    this.user.set(user);
    
    this.status.set('authenticated');
    this.error.set(null);
    this.isAuthenticated.set(true);
  }

  setError(error: string): void {
    this.status.set('error');
    this.error.set(error);
  }

  logout(): void {
    this.tokenStorage.clear();
    this.refreshToken.set(null);
    this.user.set(null);
    this.status.set('idle');
    this.error.set(null);
    this.isAuthenticated.set(false);
  }

  switchFormMode(mode: FormMode): void {
    this.currentFormMode.set(mode);
  }

  clearError(): void {
    this.error.set(null);
  }
}
