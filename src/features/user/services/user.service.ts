import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api/api-client';
import { User } from '@shared/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiClient = inject(ApiClient);

  fetchCurrentUser(): Observable<User> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.apiClient.get<User>(`/api/users/${userId}`);
  }
}
