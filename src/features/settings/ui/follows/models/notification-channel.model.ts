export type NotificationChannelKey = 'telegram' | 'discord' | 'email';

export const SUPPORTED_NOTIFICATION_CHANNELS: NotificationChannelKey[] = [
  'telegram',
  'discord',
  'email',
];

export interface NotificationChannelEntry {
  channel: NotificationChannelKey;
  enabled: boolean;
  defaultLeadTimeMinutes: number;
}

export interface SportNotificationChannels {
  sportId: number;
  sportKey: string;
  sportName: string;
  channels: NotificationChannelEntry[];
}

export interface UpdateNotificationChannelRequest {
  enabled: boolean;
  defaultLeadTimeMinutes: number;
}
