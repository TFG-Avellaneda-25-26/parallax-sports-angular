import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface FilterDrawerState {
  isOpen: boolean;
}

const initialState: FilterDrawerState = { isOpen: false };

export const FilterDrawerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    open(): void {
      patchState(store, { isOpen: true });
    },
    close(): void {
      patchState(store, { isOpen: false });
    },
    toggle(): void {
      patchState(store, { isOpen: !store.isOpen() });
    },
  })),
);
