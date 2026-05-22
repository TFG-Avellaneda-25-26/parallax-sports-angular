import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FilterLevel } from '@features/dashboard/store/event-filter.store';

export type FilterRowAction = 'showOnly' | 'hide' | 'clear';

@Component({
  selector: 'app-filter-tree-row',
  imports: [],
  templateUrl: './filter-tree-row.html',
  styleUrl: './filter-tree-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTreeRowComponent {
  readonly level = input.required<FilterLevel>();
  readonly label = input.required<string>();
  readonly count = input<number>(0);
  readonly isShowOnly = input<boolean>(false);
  readonly isHidden = input<boolean>(false);
  readonly isExpandable = input<boolean>(false);
  readonly isExpanded = input<boolean>(false);

  readonly action = output<FilterRowAction>();
  readonly toggleExpand = output<void>();

  protected readonly menuOpen = signal(false);
  protected readonly indent = computed(() => {
    switch (this.level()) {
      case 'sport': return 0;
      case 'competition': return 1;
      case 'eventType': return 2;
      case 'participant': return 2;
    }
  });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private detachOutsideClick: (() => void) | null = null;

  protected onPrimaryClick(): void {
    this.action.emit(this.isShowOnly() ? 'clear' : 'showOnly');
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.action.emit(this.isHidden() ? 'clear' : 'hide');
  }

  protected onExpandClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleExpand.emit();
  }

  protected onMenuToggle(event: MouseEvent): void {
    event.stopPropagation();
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    if (next) {
      this.detachOutsideClick = this.renderer.listen('document', 'click', (e: Event) => {
        if (!this.elementRef.nativeElement.contains(e.target as Node)) {
          this.closeMenu();
        }
      });
    } else {
      this.detachOutsideClick?.();
      this.detachOutsideClick = null;
    }
  }

  protected dispatch(action: FilterRowAction, event: MouseEvent): void {
    event.stopPropagation();
    this.closeMenu();
    this.action.emit(action);
  }

  private closeMenu(): void {
    this.menuOpen.set(false);
    this.detachOutsideClick?.();
    this.detachOutsideClick = null;
  }
}
