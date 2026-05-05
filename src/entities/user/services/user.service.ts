import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api';
import { User } from '@entities/user';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@shared/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiClient = inject(ApiClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  fetchCurrentUser(): Observable<User> {
    return this.apiClient.get<User>('/api/users/me');
  }

  updateEmail(email: string,newEmail: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/email', { email: email, newEmail: newEmail });
  }

  updatePassword(password: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/password', { password: password });
  }

  updateDisplayName(displayName: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/display-name', displayName);
  }

  updateSettings(settings: Partial<User['settings']>): Observable<void> {
    return this.apiClient.put<void>('/api/users/me/settings', { settings });
  }

  initiateOAuth2(provider: string): void {
    window.location.href = `${this.apiBaseUrl}/oauth2/authorization/${provider}`;
  }

  disconnectIdentity(identityId: number): Observable<void> {
    return this.apiClient.delete<void>(`/api/users/identities/${identityId}`);
  }
}
