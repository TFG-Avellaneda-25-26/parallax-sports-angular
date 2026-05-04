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
    isVerified: computed(() => store.user()?.emailVerified),
    isAdmin: computed(() => store.user()?.role === 'ADMIN'),
    email: computed(() => store.user()?.email ?? ''),
    identities: computed(() => store.user()?.identities ?? []),
    displayName: computed(() => store.user()?.displayName ?? ''),
    timeZone: computed(() => store.user()?.settings?.timeZone ?? 'UTC'),
    locale: computed(() => store.user()?.settings?.locale ?? 'en')
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

    async markEmailVerified(): Promise<void> {
      const currentUser = store.user();

      if (!currentUser) return;
      patchState(store, { user: { ...currentUser, emailVerified: true } });
    },

    async updateEmail(newEmail: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      await lastValueFrom(userService.updateEmail(newEmail));
      patchState(store, { user: { ...user, email: newEmail, emailVerified: false } });
    },

    async updatePassword(password: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      await lastValueFrom(userService.updatePassword(password));
    },

    async updateDisplayName(displayName: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      await lastValueFrom(userService.updateDisplayName(displayName));
      patchState(store, { user: { ...user, displayName } });
    },

    async updateTimeZone(timeZone: string): Promise<void> {
      const user = store.user();
      if (!user?.settings) return;

      const settings = { ...user.settings, timeZone };
      await lastValueFrom(userService.updateSettings(settings));
      patchState(store, { user: { ...user, settings }});
    },

    async updateLocale(locale: string): Promise<void> {
      const user = store.user();
      if (!user?.settings) return;

      const settings = { ...user.settings, locale };
      await lastValueFrom(userService.updateSettings(settings));
      patchState(store, { user: { ...user, settings }});
    },

    async disconnectIdentity(identityId: number): Promise<void> {
      const user = store.user();
      if (!user) return;

      const updatedIdentities = user.identities?.filter(id => id.id !== identityId) ?? [];
      patchState(store, { user: { ...user, identities: updatedIdentities }});
    },

    async connectIdentity(provider: string): Promise<void> {
      await lastValueFrom(userService.initiateOAuth2(provider));
      await this.loadUser();
    },

    clearUser(): void {
      patchState(store, initialState);
    }
  }))
);
