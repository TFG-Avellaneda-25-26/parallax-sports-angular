import { inject, Injectable } from '@angular/core';
import { ApiClient } from '@shared/api';
import { 
  AuthCredentials, 
  RegisterCredentials, 
  AuthResponse,
  CheckEmailResponse 
} from '../model/auth.types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiClient = inject(ApiClient);
  private readonly authEndpoint = '/auth';

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>(
      `${this.authEndpoint}/login`,
      credentials
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>(
      `${this.authEndpoint}/register`,
      credentials
    );
  }

  checkEmailExists(email: string): Observable<CheckEmailResponse> {
    return this.apiClient.get<CheckEmailResponse>(
      `${this.authEndpoint}/check-email?email=${encodeURIComponent(email)}`
    );
  }
}
