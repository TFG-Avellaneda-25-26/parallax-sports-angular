import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { UserStore } from '@entities/user';

export type DashboardView = 'cards' | 'table';

interface DashboardViewState {
  view: DashboardView;
}

const initialState: DashboardViewState = {
  view: 'cards',
};

export const DashboardViewStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    setView(view: DashboardView): void {
      patchState(store, { view });
    },
  })),

  withHooks({
    onInit(store, userStore = inject(UserStore)) {
      const seeded = userStore.userPreferences()?.defaultView;
      if (seeded === 'cards' || seeded === 'table') {
        patchState(store, { view: seeded });
      }
    },
  }),
);
