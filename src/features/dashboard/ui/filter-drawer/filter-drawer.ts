import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterDrawerStore } from '../../store/filter-drawer.store';
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

  protected readonly open = this.drawerStore.open;

  protected close(): void {
    this.drawerStore.close();
  }
}
