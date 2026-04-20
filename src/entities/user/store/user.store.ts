import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserService, User } from "@entities/user";
import { lastValueFrom } from "rxjs";

interface UserState {
  user: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),
    userPreferences: computed(() => store.user()?.settings),
  })),

  withMethods((store, userService = inject(UserService)) => ({

    async loadUser(): Promise<void> {
      if (store.user()) return;
      patchState(store, { isLoading: true});

      try {
        const user = await lastValueFrom(userService.fetchCurrentUser());
        patchState(store, { user, isLoading: false });
      } catch (error) {
        patchState(store, { user: null, isLoading: false });
        throw error;
      }
    },

    clearUser(): void {
      patchState(store, initialState);
    }
  }))
);
