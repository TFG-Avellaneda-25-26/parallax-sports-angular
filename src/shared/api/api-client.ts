import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@shared/config';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(path: string) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(`${this.baseUrl}${fullPath}`, {
      withCredentials: true,
    });
  }

  post<T>(path: string, body: unknown) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.post<T>(`${this.baseUrl}${fullPath}`, body, {
      withCredentials: true,
    });
  }

  put<T>(path: string, body: unknown) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.put<T>(`${this.baseUrl}${fullPath}`, body, {
      withCredentials: true,
    });
  }

  delete<T>(path: string) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.delete<T>(`${this.baseUrl}${fullPath}`, {
      withCredentials: true,
    });
  }
}
