import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { EventService, SportEvent } from '@entities/event';
import { lastValueFrom } from 'rxjs';

interface EventState {
  events: SportEvent[];
  nextCursor: number | null;
  hasMore: boolean;
  isLoading: boolean;
}

const initialState: EventState = {
  events: [],
  nextCursor: null,
  hasMore: false,
  isLoading: false,
};

export const EventStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, eventService = inject(EventService)) => ({

    async loadInitialEvents(): Promise<void> {
      if (store.events().length > 0) return;
      patchState(store, { isLoading: true });

      try {
        const response = await lastValueFrom(eventService.fetchEvents());
        patchState(store, {
          events: response.items,
          nextCursor: response.nextCursor,
          hasMore: response.hasMore,
          isLoading: false,
        });
      } catch (error) {
        patchState(store, { ...initialState });
        throw error;
      }
    },

    async loadMore(): Promise<void> {
      if (!store.hasMore() || store.isLoading() || store.nextCursor() === null) {
        return;
      }
      patchState(store, { isLoading: true });

      try {
        const response = await lastValueFrom(
          eventService.fetchEvents(store.nextCursor()!)
        );

        patchState(store, {
          events: [...store.events(), ...response.items],
          nextCursor: response.nextCursor,
          hasMore: response.hasMore,
          isLoading: false,
        });
      } catch (error) {
        patchState(store, { isLoading: false });
        throw error;
      }
    },

    clearEvents(): void {
      patchState(store, initialState);
    },
  }))
);
