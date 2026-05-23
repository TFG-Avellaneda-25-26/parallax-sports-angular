import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ImageDragAndDropComponent } from '@shared/ui';
import {
  AdminEventsService,
  AlertChannel,
  CHANNEL_OPTIONS,
  EventInjectionResult,
  SPORT_OPTIONS,
} from '@entities/admin-events';

interface FormState {
  sportKey: string;
  eventName: string;
  eventType: string;
  competitionName: string;
  venueName: string;
  venueTimezone: string;
  startTimeUtc: string;
  channel: AlertChannel;
  leadTimeMinutes: number;
  targetUserId: string;
}

const EMPTY_FORM: FormState = {
  sportKey: SPORT_OPTIONS[0].key,
  eventName: '',
  eventType: 'match',
  competitionName: '',
  venueName: '',
  venueTimezone: '',
  startTimeUtc: '',
  channel: 'telegram',
  leadTimeMinutes: 30,
  targetUserId: '',
};

@Component({
  selector: 'app-event-injection-modal',
  standalone: true,
  imports: [ImageDragAndDropComponent],
  templateUrl: './event-injection-modal.component.html',
  styleUrl: './event-injection-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInjectionModalComponent {
  private readonly service = inject(AdminEventsService);

  readonly closed = output<EventInjectionResult | null>();

  protected readonly sports = SPORT_OPTIONS;
  protected readonly channels = CHANNEL_OPTIONS;
  protected readonly form = signal<FormState>({ ...EMPTY_FORM });
  protected readonly images = signal<(File | null)[]>([null, null, null]);
  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly canSubmit = computed(() => {
    const f = this.form();
    return !!(
      f.sportKey &&
      f.eventName.trim() &&
      f.eventType.trim() &&
      f.startTimeUtc &&
      f.channel &&
      f.leadTimeMinutes > 0 &&
      f.targetUserId
    );
  });

  protected onField<K extends keyof FormState>(key: K, value: FormState[K]): void {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  protected onChannel(value: string): void {
    this.onField('channel', value as AlertChannel);
  }

  protected close(result: EventInjectionResult | null = null): void {
    this.closed.emit(result);
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit() || this.busy()) return;
    this.busy.set(true);
    this.errorMessage.set(null);

    try {
      const f = this.form();
      const [eventFile, team1File, team2File] = this.images();
      const [eventUrl, team1Url, team2Url] = await Promise.all([
        toDataUrl(eventFile),
        toDataUrl(team1File),
        toDataUrl(team2File),
      ]);

      const result = await lastValueFrom(this.service.inject({
        sportKey: f.sportKey,
        eventName: f.eventName.trim(),
        eventType: f.eventType.trim(),
        competitionName: f.competitionName.trim() || null,
        venueName: f.venueName.trim() || null,
        venueTimezone: f.venueTimezone.trim() || null,
        startTimeUtc: new Date(f.startTimeUtc).toISOString(),
        channel: f.channel,
        leadTimeMinutes: Number(f.leadTimeMinutes),
        targetUserId: Number(f.targetUserId),
        eventImageUrl: eventUrl,
        team1ImageUrl: team1Url,
        team2ImageUrl: team2Url,
      }));
      this.close(result);
    } catch {
      this.errorMessage.set('Injection failed. Check the inputs and try again.');
    } finally {
      this.busy.set(false);
    }
  }
}

function toDataUrl(file: File | null): Promise<string | null> {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
