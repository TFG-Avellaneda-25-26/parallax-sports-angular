import { inject, Injectable } from '@angular/core';
import { ApiClient } from '@shared/api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@entities/auth'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiClient = inject(ApiClient);

  login(credentials: LoginCredentials) {
    return this.apiClient.post<AuthResponse>('/api/auth/login', credentials);
  }

  register(credentials: RegisterCredentials) {
    return this.apiClient.post<AuthResponse>('/api/auth/register', credentials);
  }

  verifyEmail(code: string) {
    return this.apiClient.post('/api/auth/verify-email', { code });
  }

  resendVerification() {
    return this.apiClient.post('/api/auth/resend-verification', {});
  }

  logout() {
    return this.apiClient.post('/api/auth/logout', {});
  }

  initSettings(body: { timezone: string; theme: string }) {
    return this.apiClient.post('/api/users/settings/init', body);
  }

  sendEmailRecovery(email: string) {
    return this.apiClient.post('/api/auth/recover-email', { email: email });
  }
}
