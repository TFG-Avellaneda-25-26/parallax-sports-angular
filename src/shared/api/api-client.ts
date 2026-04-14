import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@shared/config';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly options = { withCredentials: true };

  get<T>(path: string) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(`${this.baseUrl}${fullPath}`, this.options);
  }

  post<T>(path: string, body: unknown) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.post<T>(`${this.baseUrl}${fullPath}`, body, this.options);
  }

  put<T>(path: string, body: unknown) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.put<T>(`${this.baseUrl}${fullPath}`, body, this.options);
  }

  delete<T>(path: string) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.delete<T>(`${this.baseUrl}${fullPath}`, this.options);
  }
}
