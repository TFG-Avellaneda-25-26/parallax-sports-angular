import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '@entities/user';
import { SettingsAsideStore, SettingsNavStore } from '@shared/stores';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { SettingsNavIconComponent } from '@shared/ui';


@Component({
  selector: 'app-settings-nav',
  imports: [Tree, TreeItem, TreeItemGroup, NgTemplateOutlet, SettingsNavIconComponent],
  templateUrl: './settings-nav.component.html',
  styleUrl: './settings-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNavComponent {
  readonly navStore = inject(SettingsNavStore);
  readonly userStore = inject(UserStore);
  readonly router = inject(Router);
  private readonly asideStore = inject(SettingsAsideStore);

  readonly selected = this.navStore.selected;

  onSelect(value: string[]) {
    this.navStore.setSelected(value);

    const [selected] = value;
    if (!selected) return;

    const [route, fragment] = selected.split('/');
    void this.router.navigate(['/settings', route], {
      fragment: fragment ?? undefined
    });

    // When the tree is shown inside the mobile drawer, picking a section
    // should close it. close() is a no-op when the drawer isn't open.
    this.asideStore.close();
  }

  visibleTree = computed(() =>
    this.userStore.isAdmin()
      ? this.navStore.tree()
      : this.navStore.tree().filter(node => node.value !== 'admin')
  );
}
