import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserService, User, UserSettings } from "@entities/user";
import { lastValueFrom } from "rxjs";
import { Router } from "@angular/router";

interface UserState {
  user: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
}

const SUPPORTED_PROVIDERS = ['google', 'discord'] as const;

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
    timezone: computed(() => store.user()?.settings?.timezone ?? ''),
    defaultView: computed(() => store.user()?.settings?.defaultView ?? ''),
    dateFormat: computed(() => store.user()?.settings?.dateFormat ?? ''),
    linkedProviders: computed(() => {
      const linked = store.user()?.identities ?? [];
      return SUPPORTED_PROVIDERS.map(provider => ({
        provider,
        identity: linked.find(i => i.provider === provider) ?? null,
        isLinked: linked.some(i => i.provider === provider)
      }))
    }),
  })),

  withMethods((store, userService = inject(UserService), router = inject(Router)) => ({

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

      try {
        await lastValueFrom(userService.updateEmail(store.email(),newEmail));
        patchState(store, { user: { ...user, email: newEmail, emailVerified: false } });
      } catch (error) {
        console.error('Failed to update email. Reverting to previous state.');
        throw error;
      }
    },

    async updatePassword(password: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.updatePassword(password));
      } catch (error) {
        console.error('Failed to update password.');
        throw error;
      }
    },

    async updateDisplayName(displayName: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.updateDisplayName(displayName));
        patchState(store, { user: { ...user, displayName } });
      } catch (error) {
        console.error('Failed to update display name.');
        throw error;
      }
    },

    async disconnectIdentity(identityId: number): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.disconnectIdentity(identityId));
        const updatedIdentities = user.identities?.filter(id => id.id !== identityId) ?? [];
        patchState(store, { user: { ...user, identities: updatedIdentities }});
      } catch (error) {
        console.error('Failed to disconnect identity.');
        throw error;
      }
    },

    async linkIdentity(provider: string): Promise<void> {
      try {
        userService.initiateOAuth2(provider);
      } catch (error) {
        console.error('Failed to link identity.');
        throw error;
      }
    },

    async deleteAccount(): Promise<void> {
      try {
        await lastValueFrom(userService.deleteAccount());
        patchState(store, initialState);
        router.navigate(['/']);
      } catch (error) {
        console.error('Failed to delete account.');
        throw error;
      }
    },

    async updateTimeZone(timeZone: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.updateTimeZone(timeZone));
        patchState(store, { user: {
          ...user, settings: { ...user.settings, timeZone } as UserSettings
        }
        });
      } catch (error) {
        console.error('Failed to update time zone.');
        throw error;
      }
    },

    async updateDefaultView(defaultView: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.updateDefaultView(defaultView));
        patchState(store, { user: {
          ...user, settings: { ...user.settings, defaultView: defaultView.toLowerCase() } as UserSettings
        }});
      } catch (error) {
        console.error('Failed to update default view.');
        throw error;
      }
    },

    async updateDateFormat(dateFormat: string): Promise<void> {
      const user = store.user();
      if (!user) return;

      try {
        await lastValueFrom(userService.updateDateFormat(dateFormat));
        patchState(store, { user: {
          ...user, settings: { ...user.settings, dateFormat } as UserSettings
        }});
      } catch (error) {
        console.error('Failed to update date format.');
        throw error;
      }
    },

    clearUser(): void {
      patchState(store, initialState);
    }
  }))
);
