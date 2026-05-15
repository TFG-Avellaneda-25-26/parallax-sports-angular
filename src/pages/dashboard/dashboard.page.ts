import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EventCardGridComponent, EventTableComponent } from '@features/event';
import {
  DashboardToolbarComponent,
  DashboardViewStore,
  EventFilterStore,
  FilterDrawerComponent,
  FilterTreeComponent,
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

  protected readonly view = this.viewStore.view;
  protected readonly filteredEvents = this.filterStore.filteredEvents;
}
