import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserService } from "../services/user.service";
import { lastValueFrom } from "rxjs";
import { User } from "@shared/model/user.model";

interface UserState {
  user: User | null;
  isloading: boolean;
}

const initialState: UserState = {
  user: null,
  isloading: false,
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
      patchState(store, { isloading: true});

      try {
        const user = await lastValueFrom(userService.fetchCurrentUser());
        patchState(store, { user, isloading: false });
      } catch (error) {
        patchState(store, { user: null, isloading: false });
        throw error;
      }
    },

    clearUser(): void {
      patchState(store, initialState);
    }
  }))
);
