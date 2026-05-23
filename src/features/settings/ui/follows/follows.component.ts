import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import {
  NotificationChannelKey,
  SportNotificationChannels,
  SUPPORTED_NOTIFICATION_CHANNELS,
} from './models/notification-channel.model';
import { NotificationChannelsService } from './services/notification-channels.service';
import { CheckboxIconComponent } from '@shared/ui';

interface ChannelRowState {
  enabled: boolean;
  defaultLeadTimeMinutes: number;
  saving: boolean;
  error: string | null;
}

interface SportRow {
  sportId: number;
  sportKey: string;
  sportName: string;
  channels: Record<NotificationChannelKey, ChannelRowState>;
}

const DEFAULT_LEAD_MINUTES = 30;

function buildSportRow(s: SportNotificationChannels): SportRow {
  const channels = {} as Record<NotificationChannelKey, ChannelRowState>;
  for (const key of SUPPORTED_NOTIFICATION_CHANNELS) {
    const existing = s.channels.find(c => c.channel === key);
    channels[key] = {
      enabled: existing?.enabled ?? false,
      defaultLeadTimeMinutes: existing?.defaultLeadTimeMinutes ?? DEFAULT_LEAD_MINUTES,
      saving: false,
      error: null,
    };
  }
  return {
    sportId: s.sportId,
    sportKey: s.sportKey,
    sportName: s.sportName,
    channels,
  };
}

@Component({
  selector: 'app-settings-follows',
  imports: [CheckboxIconComponent],
  templateUrl: './follows.component.html',
  styleUrl: './follows.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowsComponent {
  private readonly navStore = inject(SettingsNavStore);
  private readonly service = inject(NotificationChannelsService);

  protected readonly channels = SUPPORTED_NOTIFICATION_CHANNELS;
  protected readonly sports = signal<SportRow[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly isEmpty = computed(() => this.sports().length === 0);

  constructor() {
    void this.load();

    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;
      const el = document.getElementById(section);
      if (!el) return;
      setTimeout(() => scrollToSection(el), 0);
    });
  }

  protected async toggleEnabled(sportId: number, channel: NotificationChannelKey, next: boolean): Promise<void> {
    this.patchChannel(sportId, channel, { enabled: next });
    await this.saveRow(sportId, channel);
  }

  protected async updateLeadTime(sportId: number, channel: NotificationChannelKey, raw: string): Promise<void> {
    const minutes = Number.parseInt(raw, 10);
    if (!Number.isFinite(minutes) || minutes < 1) {
      this.patchChannel(sportId, channel, { error: 'Lead time must be at least 1 minute' });
      return;
    }
    this.patchChannel(sportId, channel, { defaultLeadTimeMinutes: minutes, error: null });
    await this.saveRow(sportId, channel);
  }

  private async load(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const list = await lastValueFrom(this.service.list());
      this.sports.set(list.map(buildSportRow));
    } catch {
      this.loadError.set('Failed to load notification preferences.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async saveRow(sportId: number, channel: NotificationChannelKey): Promise<void> {
    const row = this.sports().find(s => s.sportId === sportId);
    if (!row) return;
    const state = row.channels[channel];

    this.patchChannel(sportId, channel, { saving: true, error: null });
    try {
      await lastValueFrom(this.service.upsert(sportId, channel, {
        enabled: state.enabled,
        defaultLeadTimeMinutes: state.defaultLeadTimeMinutes,
      }));
      this.patchChannel(sportId, channel, { saving: false });
    } catch {
      this.patchChannel(sportId, channel, {
        saving: false,
        error: 'Failed to save. Please try again.',
      });
    }
  }

  private patchChannel(
    sportId: number,
    channel: NotificationChannelKey,
    patch: Partial<ChannelRowState>,
  ): void {
    this.sports.update(rows =>
      rows.map(row => {
        if (row.sportId !== sportId) return row;
        return {
          ...row,
          channels: {
            ...row.channels,
            [channel]: { ...row.channels[channel], ...patch },
          },
        };
      }),
    );
  }
}
