import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserService, User } from "@entities/user";
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
    timeZone: computed(() => store.user()?.settings?.timeZone ?? 'UTC'),
    locale: computed(() => store.user()?.settings?.locale ?? 'en'),
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

      await lastValueFrom(userService.updateEmail(store.email(),newEmail));
      patchState(store, { user: { ...user, email: newEmail, emailVerified: false } });
      console.log('Email updated, marked as unverified');
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

    async disconnectIdentity(identityId: number): Promise<void> {
      const user = store.user();
      if (!user) return;

      await lastValueFrom(userService.disconnectIdentity(identityId));
      const updatedIdentities = user.identities?.filter(id => id.id !== identityId) ?? [];
      patchState(store, { user: { ...user, identities: updatedIdentities }});
    },

    async linkIdentity(provider: string): Promise<void> {
      userService.initiateOAuth2(provider);
    },

    async deleteAccount(): Promise<void> {
      await lastValueFrom(userService.deleteAccount());
      patchState(store, initialState);
      router.navigate(['/']);
    },

    clearUser(): void {
      patchState(store, initialState);
    }
  }))
);
