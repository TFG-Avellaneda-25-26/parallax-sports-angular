import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, computed, effect, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'parallax-sports-theme';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly theme = signal<AppTheme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.theme.set(this.resolveInitialTheme());

    effect(() => {
      const nextTheme = this.theme();
      this.document.documentElement.setAttribute('data-theme', nextTheme);
      this.persistTheme(nextTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): AppTheme {
    const storedTheme = this.readStoredTheme();
    if (storedTheme) return storedTheme;

    const htmlTheme = this.document.documentElement.getAttribute('data-theme');
    if (htmlTheme === 'light' || htmlTheme === 'dark') return htmlTheme;

    if (this.prefersDarkMode()) return 'dark';
    return 'light';
  }

  private readStoredTheme(): AppTheme | null {
    if (!this.hasBrowserStorage()) return null;

    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  }

  private persistTheme(theme: AppTheme): void {
    if (!this.hasBrowserStorage()) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private prefersDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private hasBrowserStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
