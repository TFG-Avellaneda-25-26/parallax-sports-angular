import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api';
import { User } from '@entities/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiClient = inject(ApiClient);

  fetchCurrentUser(): Observable<User> {
    return this.apiClient.get<User>('/api/users/me');
  }

  updateEmail(newEmail: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/update/email', { email: newEmail });
  }

  updatePassword(password: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/update/password', { password: password });
  }

  updateDisplayName(newDisplayName: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/me/update/display-name', { displayName: newDisplayName });
  }

  updateSettings(settings: Partial<User['settings']>): Observable<void> {
    return this.apiClient.put<void>('/api/users/me/settings', { settings });
  }

  initiateOAuth2(provider: string): Observable<void> {
    return this.apiClient.post<void>(`/oauth2/authorization/${provider}`, {});
  }
}
