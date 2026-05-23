import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FilterDrawerStore } from '@features/dashboard/store/filter-drawer.store';
import { SportNode } from '@features/dashboard/store/event-filter.store';
import { FilterTreeComponent } from '../filter-tree/filter-tree';

@Component({
  selector: 'app-filter-drawer',
  imports: [FilterTreeComponent],
  templateUrl: './filter-drawer.html',
  styleUrl: './filter-drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerComponent {
  private readonly drawerStore = inject(FilterDrawerStore);

  readonly nodes = input.required<SportNode[]>();

  protected readonly isOpen = this.drawerStore.isOpen;

  protected close(): void {
    this.drawerStore.close();
  }
}
