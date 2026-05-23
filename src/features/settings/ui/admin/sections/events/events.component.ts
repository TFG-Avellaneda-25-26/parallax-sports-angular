import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EventInjectionResult } from '@entities/admin-events';
import { EventInjectionModalComponent } from './event-injection-modal.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [EventInjectionModalComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  protected readonly modalOpen = signal(false);
  protected readonly lastResult = signal<EventInjectionResult | null>(null);

  protected open(): void {
    this.modalOpen.set(true);
  }

  protected onClosed(result: EventInjectionResult | null): void {
    this.modalOpen.set(false);
    if (result) this.lastResult.set(result);
  }
}
