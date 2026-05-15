import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface FilterDrawerState {
  open: boolean;
}

const initialState: FilterDrawerState = { open: false };

export const FilterDrawerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    open(): void {
      patchState(store, { open: true });
    },
    close(): void {
      patchState(store, { open: false });
    },
    toggle(): void {
      patchState(store, { open: !store.open() });
    },
  })),
);
