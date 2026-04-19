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
}
