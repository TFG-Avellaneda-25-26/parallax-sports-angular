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
    return this.apiClient.get<User>('/api/users/me');
  }
}
