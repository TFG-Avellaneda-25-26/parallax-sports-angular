import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api';
import { EventInjectionRequest, EventInjectionResult } from '../model/admin-events.model';

@Injectable({ providedIn: 'root' })
export class AdminEventsService {
  private readonly api = inject(ApiClient);

  inject(body: EventInjectionRequest) {
    return this.api.post<EventInjectionResult>('/api/admin/events/inject', body);
  }
}
