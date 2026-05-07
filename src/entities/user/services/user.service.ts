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
    return this.apiClient.put<void>('/api/users/email', newEmail);
  }

  updatePassword(password: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/password', password);
  }

  updateDisplayName(displayName: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/display-name', displayName);
  }

  initiateOAuth2(provider: string): void {
    window.location.href = `${this.apiBaseUrl}/oauth2/authorization/${provider}`;
  }

  disconnectIdentity(identityId: number): Observable<void> {
    return this.apiClient.delete<void>(`/api/users/identities/${identityId}`);
  }

  deleteAccount(): Observable<void> {
    return this.apiClient.delete<void>('/api/users/me');
  }

  updateTimeZone(timeZone: string): Observable<void> {
    return this.apiClient.put<void>('/api/users/timezone', timeZone);
  }
}
