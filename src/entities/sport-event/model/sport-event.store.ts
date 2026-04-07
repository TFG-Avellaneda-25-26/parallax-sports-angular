import { Injectable, signal, computed } from '@angular/core';
import type { SportEvent } from './sport-event.types';

@Injectable({ providedIn: 'root' })
export class SportEventStore {
  private readonly _events = signal<SportEvent[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasEvents = computed(() => this._events().length > 0);

  setEvents(events: SportEvent[]) {
    this._events.set(events);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  setError(error: string | null) {
    this._error.set(error);
  }
}
