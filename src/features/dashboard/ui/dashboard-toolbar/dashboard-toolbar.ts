import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardViewStore, type DashboardView } from '@features/dashboard/store/dashboard-view.store';
import { FilterDrawerStore } from '@features/dashboard/store/filter-drawer.store';

@Component({
  selector: 'app-dashboard-toolbar',
  imports: [],
  templateUrl: './dashboard-toolbar.html',
  styleUrl: './dashboard-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardToolbarComponent {
  private readonly viewStore = inject(DashboardViewStore);
  private readonly drawerStore = inject(FilterDrawerStore);

  protected readonly view = this.viewStore.view;

  protected setView(view: DashboardView): void {
    this.viewStore.setView(view);
  }

  protected openFilters(): void {
    this.drawerStore.open();
  }
}
