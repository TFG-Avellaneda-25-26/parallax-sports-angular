import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface AuthTransitionState {
  isTransitioning: boolean;
}

const initialState: AuthTransitionState = { isTransitioning: false };

/**
 * Tracks the brief "you're in, hold on" window between successful auth
 * (login or register) and the router landing on /dashboard. Lives at root
 * so the overlay can be rendered at the app shell level and survive the
 * auth-container being torn down by navigation.
 */
export const AuthTransitionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    start(): void {
      patchState(store, { isTransitioning: true });
    },
    stop(): void {
      patchState(store, { isTransitioning: false });
    },
  })),
);
