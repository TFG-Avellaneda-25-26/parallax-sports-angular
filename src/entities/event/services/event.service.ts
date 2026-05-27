import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api';
import { EventFeedResponse } from '@entities/event';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiClient = inject(ApiClient);

  fetchEvents(after?: number, size?: number): Observable<EventFeedResponse> {
    const params: string[] = [];
    if (after != null) params.push(`after=${after}`);
    if (size != null) params.push(`size=${size}`);
    const path = params.length > 0 ? `/api/events?${params.join('&')}` : '/api/events';
    return this.apiClient.get<EventFeedResponse>(path);
  }
}
