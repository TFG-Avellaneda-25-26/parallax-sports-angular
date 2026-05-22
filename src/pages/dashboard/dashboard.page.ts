import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { EventCardGridComponent, EventStore, EventTableComponent } from '@features/event';
import {
  DashboardToolbarComponent,
  DashboardViewStore,
  EventFilterStore,
  FilterDrawerComponent,
  FilterTreeComponent,
  buildTree,
} from '@features/dashboard';

@Component({
  imports: [
    DashboardToolbarComponent,
    FilterTreeComponent,
    FilterDrawerComponent,
    EventTableComponent,
    EventCardGridComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly viewStore = inject(DashboardViewStore);
  private readonly filterStore = inject(EventFilterStore);
  private readonly eventStore = inject(EventStore);

  protected readonly view = this.viewStore.view;
  protected readonly treeNodes = computed(() => buildTree(this.eventStore.events()));
  protected readonly filteredEvents = computed(() => this.filterStore.applyFilters(this.eventStore.events()));
}
