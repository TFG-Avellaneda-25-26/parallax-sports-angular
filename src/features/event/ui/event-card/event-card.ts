import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SportEvent } from '@entities/event';
import { UserStore } from '@entities/user';
import { EventTimePipe } from '@shared/lib';

@Component({
  selector: 'app-event-card',
  imports: [EventTimePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  readonly event = input.required<SportEvent>();

  private readonly userStore = inject(UserStore);
  protected readonly timeZone = this.userStore.timezone;

  protected readonly circuitMask = computed(() => {
    const url = this.event().venueImageUrl;
    return url ? `url("${url}")` : 'none';
  });

  protected readonly showStatus = computed(() => this.event().status !== 'scheduled');
}
