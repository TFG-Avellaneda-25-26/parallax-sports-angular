import { afterNextRender, afterRenderEffect, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { EventCardGridComponent, EventStore, EventTableComponent } from '@features/event';
import {
  DashboardToolbarComponent,
  DashboardViewStore,
  EventFilterStore,
  FilterDrawerComponent,
  FilterTreeComponent,
  buildTree,
} from '@features/dashboard';
import { ScrollTrigger } from '@shared/lib';

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
  readonly eventStore = inject(EventStore);

  private readonly destroyRef = inject(DestroyRef);
  sentinel = viewChild<ElementRef>('sentinel');

  protected readonly view = this.viewStore.view;
  protected readonly treeNodes = computed(() => buildTree(this.eventStore.events()));
  protected readonly filteredEvents = computed(() => {
    this.filterStore.activeFilters();
    return this.filterStore.applyFilters(this.eventStore.events());
  });

  constructor () {
    afterNextRender(() => {
      const trigger = ScrollTrigger.create({
        trigger: this.sentinel()?.nativeElement,
        start: 'top bottom',
        onEnter: () => this.tryLoadMore(),
        onEnterBack: () => this.tryLoadMore(),
      });

      this.destroyRef.onDestroy(() => trigger.kill());
    });

    let previousCount = 0;
    afterRenderEffect(() => {
      const count = this.eventStore.events().length;
      if (count !== previousCount) {
        previousCount = count;
        ScrollTrigger.refresh();
      }
    })
  }

  private tryLoadMore() {
    if (this.eventStore.hasMore() && !this.eventStore.isLoading()) {
      this.eventStore.loadMore();
    } else {
      console.log('Not loading more: hasMore=', this.eventStore.hasMore(), 'isLoading=', this.eventStore.isLoading());
    }
  }
}
