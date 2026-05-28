import { afterNextRender, afterRenderEffect, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
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

  private readonly isNarrow = signal(false);
  protected readonly effectiveView = computed(() =>
    this.isNarrow() ? 'cards' : this.viewStore.view(),
  );
  protected readonly treeNodes = computed(() => buildTree(this.eventStore.events()));
  protected readonly filteredEvents = computed(() => {
    this.filterStore.activeFilters();
    return this.filterStore.applyFilters(this.eventStore.events());
  });

  constructor () {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(max-width: 720px)');
      this.isNarrow.set(mql.matches);
      const onChange = (e: MediaQueryListEvent) => this.isNarrow.set(e.matches);
      mql.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => mql.removeEventListener('change', onChange));
    }

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
