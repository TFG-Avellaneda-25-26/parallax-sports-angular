import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UserStore } from '@entities/user';
import { SettingsNavStore } from '@shared/stores';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';


@Component({
  selector: 'app-settings-nav',
  imports: [Tree, TreeItem, TreeItemGroup, RouterLink, NgTemplateOutlet],
  templateUrl: './settings-nav.component.html',
  styleUrl: './settings-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNavComponent {
  readonly navStore = inject(SettingsNavStore);
  readonly userStore = inject(UserStore);
  readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url }
  )

  readonly selected = computed(() => {
    const segment = this.currentUrl().replace('/settings/', '');
    return [segment];
  })

  visibleTree = computed(() =>
    this.userStore.isAdmin()
      ? this.navStore.tree()
      : this.navStore.tree().filter(node => node.name !== 'Admin')
  );
}
