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
  protected readonly locale = this.userStore.locale;
  protected readonly timeZone = this.userStore.timeZone;

  protected readonly hasVenueImage = computed(() => !!this.event().venueImageUrl);

  protected readonly cardBackground = computed(() => {
    const url = this.event().venueImageUrl;
    if (!url) return 'none';
    return `linear-gradient(180deg, rgba(1, 22, 39, 0.55) 0%, rgba(1, 22, 39, 0.92) 100%), url("${url}")`;
  });

  protected readonly showStatus = computed(() => this.event().status !== 'scheduled');
}
