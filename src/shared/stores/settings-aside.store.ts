import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface SettingsAsideState {
  isOpen: boolean;
}

const initialState: SettingsAsideState = { isOpen: false };

export const SettingsAsideStore = signalStore(
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
