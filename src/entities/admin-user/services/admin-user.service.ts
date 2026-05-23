import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiClient } from '@shared/api';
import {
  AdminUserDetails,
  AdminUserPage,
  AdminUserSearch,
  UserRole,
} from '../model/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly api = inject(ApiClient);

  search(filters: AdminUserSearch) {
    let params = new HttpParams();
    if (filters.q) params = params.set('q', filters.q);
    if (filters.role) params = params.set('role', filters.role);
    if (filters.emailVerified != null) params = params.set('emailVerified', String(filters.emailVerified));
    if (filters.page != null) params = params.set('page', String(filters.page));
    if (filters.size != null) params = params.set('size', String(filters.size));
    const query = params.toString();
    return this.api.get<AdminUserPage>(`/api/admin/users${query ? '?' + query : ''}`);
  }

  get(id: number) {
    return this.api.get<AdminUserDetails>(`/api/admin/users/${id}`);
  }

  changeEmail(id: number, email: string) {
    return this.api.put<void>(`/api/admin/users/${id}/email`, { email });
  }

  changeDisplayName(id: number, displayName: string) {
    return this.api.put<void>(`/api/admin/users/${id}/display-name`, { displayName });
  }

  markVerified(id: number) {
    return this.api.put<void>(`/api/admin/users/${id}/verify`, {});
  }

  changeRole(id: number, role: UserRole) {
    return this.api.put<void>(`/api/admin/users/${id}/role`, { role });
  }

  delete(id: number) {
    return this.api.delete<void>(`/api/admin/users/${id}`);
  }
}
