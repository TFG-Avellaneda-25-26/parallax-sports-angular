import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ProblemDetails } from '@shared/models';

interface ErrorState {
  error: ProblemDetails | null;
}

const initialState: ErrorState = {
  error: null
};

export const ErrorStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ error }) => ({
    status: () => error()?.status ?? null,
    haveInstance: () => !!error()?.instance
  })),

  withMethods((store) => ({
    set(error: ProblemDetails): void {
      patchState(store, { error });
    },

    clear(): void {
      patchState(store, initialState);
    }
  }))
);
