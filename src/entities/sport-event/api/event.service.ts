import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api/api-client';
import { EventFeedResponse } from '../model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiClient = inject(ApiClient);

  fetchEvents(from: string, to: string, after?: number, size?: number): Observable<EventFeedResponse> {
    let path = `/api/events?from=${from}&to=${to}`;
    if (after != null) path += `&after=${after}`;
    if (size != null) path += `&size=${size}`;
    return this.apiClient.get<EventFeedResponse>(path);
  }
}
