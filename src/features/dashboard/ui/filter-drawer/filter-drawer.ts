import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterDrawerStore } from '@features/dashboard/store/filter-drawer.store';
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

  protected readonly isOpen = this.drawerStore.isOpen;

  protected close(): void {
    this.drawerStore.close();
  }
}
