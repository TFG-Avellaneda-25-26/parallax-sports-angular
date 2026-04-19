import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { EventStore } from '@features/event'

export const eventResolver: ResolveFn<boolean> = async (route, state) => {

  const eventStore = inject(EventStore);

  try {
    await eventStore.loadInitialEvents();
    return true;
  } catch (error) {
    throw error;
  }
};
