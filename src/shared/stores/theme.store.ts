import { DOCUMENT } from '@angular/common';
import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

export type AppTheme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'parallax-sports-theme';


export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState({
    theme: 'light' as AppTheme
  }),

  withComputed(({ theme }) => ({
    isDark: computed(() => theme() === 'dark')
  })),

  withMethods((store) => ({
    toggleTheme(): void {
      const nextTheme = store.theme() === 'dark' ? 'light' : 'dark';
      patchState(store, { theme: nextTheme });
    }
  })),

  withHooks({
    onInit(store, document = inject(DOCUMENT)) {
      const initialTheme = resolveInitialTheme(document);
      patchState(store, { theme: initialTheme });

      effect(() => {
        document.documentElement.setAttribute('data-theme', store.theme());
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(THEME_STORAGE_KEY, store.theme());
        }
      });
    }
  })
)

function resolveInitialTheme(document: Document): AppTheme {

  if (typeof window !== 'undefined' && typeof window.localStorage) {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  }

  const htmlTheme = document.documentElement.getAttribute('data-theme');
  if (htmlTheme === 'light' || htmlTheme === 'dark') return htmlTheme;

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}
