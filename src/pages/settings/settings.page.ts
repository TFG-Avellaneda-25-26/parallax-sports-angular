import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SettingsAsideStore, SettingsNavStore } from '@shared/stores';
import { SettingsNavComponent } from '@widgets/settings-nav';
import { AutocompleteComponent } from '@features/settings';

@Component({
  imports: [SettingsNavComponent, RouterOutlet, AutocompleteComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsNavStore],
})
export class SettingsPage {
  private readonly router = inject(Router);
  private readonly navStore = inject(SettingsNavStore);
  protected readonly asideStore = inject(SettingsAsideStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.redirectIfBareSettings(this.router.url);

    const sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.redirectIfBareSettings(e.urlAfterRedirects));

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected toggleAside(): void {
    this.asideStore.toggle();
  }

  protected closeAside(): void {
    this.asideStore.close();
  }

  // /settings is a shell — children live at /settings/<section>. If the URL
  // is the bare /settings (header link clicked while already here, or first
  // entry without a remembered section), bounce to the last-selected node so
  // the content area is never empty.
  private redirectIfBareSettings(url: string): void {
    const [path] = url.split('?');
    if (path !== '/settings' && path !== '/settings/') return;

    const [value] = this.navStore.selected();
    if (!value) return;

    const [route, fragment] = value.split('/');
    void this.router.navigate(['/settings', route], {
      fragment: fragment ?? undefined,
    });
  }
}
