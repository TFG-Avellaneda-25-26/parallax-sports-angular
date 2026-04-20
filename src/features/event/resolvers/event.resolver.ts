import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { EventStore } from '@features/event'

export const eventResolver: ResolveFn<boolean> = async () => {

  const eventStore = inject(EventStore);

    await eventStore.loadInitialEvents();
    return true;
};
