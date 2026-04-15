import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { EventStore } from '@features/events/store/event.store';

export const eventResolver: ResolveFn<boolean> = async (route, state) => {

  const eventStore = inject(EventStore);

  try {
    await eventStore.loadInitialEvents();
    return true;
  } catch (error) {
    return false;
  }
};
