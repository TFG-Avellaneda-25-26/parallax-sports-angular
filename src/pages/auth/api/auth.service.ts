import { inject, Injectable } from '@angular/core';
import { ApiClient } from '@shared/api';
import { 
  AuthCredentials, 
  RegisterCredentials, 
  AuthResponse,
  CheckEmailResponse 
} from '../model/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiClient = inject(ApiClient);

  login(credentials: AuthCredentials) {
    return this.apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  register(credentials: RegisterCredentials) {
    return this.apiClient.post<AuthResponse>('/auth/register', credentials);
  }

  checkEmailExists(email: string) {
    return this.apiClient.get<CheckEmailResponse>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  }
}
