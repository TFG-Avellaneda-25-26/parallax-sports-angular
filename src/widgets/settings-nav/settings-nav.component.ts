import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '@entities/user';
import { SettingsNavStore } from '@shared/stores';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';


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

  readonly selected = signal(['account']);

  constructor() {
    effect(() => {
      const [value] = this.selected();
      if (!value) return;

      const [route, fragment] = value.split('/');

      void this.router.navigate(['/settings', route], {
        fragment: fragment ?? undefined
      });
    });
  }

  visibleTree = computed(() =>
    this.userStore.isAdmin()
      ? this.navStore.tree()
      : this.navStore.tree().filter(node => node.name !== 'Admin')
  );
}
