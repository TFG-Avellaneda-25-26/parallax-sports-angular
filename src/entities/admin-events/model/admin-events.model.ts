export type AlertChannel = 'telegram' | 'discord' | 'email';

export interface EventInjectionRequest {
  sportKey: string;
  eventName: string;
  eventType: string;
  competitionName: string | null;
  venueName: string | null;
  venueTimezone: string | null;
  startTimeUtc: string;
  channel: AlertChannel;
  leadTimeMinutes: number;
  targetUserId: number;
  eventImageUrl: string | null;
  team1ImageUrl: string | null;
  team2ImageUrl: string | null;
}

export interface EventInjectionResult {
  streamMessageId: string;
  streamName: string;
  idempotencyKey: string;
  sendAtUtc: string;
}

/** Sport keys that match the existing public endpoints in SecurityConfig. */
export const SPORT_OPTIONS: { key: string; label: string }[] = [
  { key: 'formula1', label: 'Formula 1' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'league-of-legends', label: 'League of Legends' },
  { key: 'valorant', label: 'Valorant' },
  { key: 'dota2', label: 'Dota 2' },
  { key: 'counter-strike', label: 'Counter-Strike' },
  { key: 'overwatch', label: 'Overwatch' },
];

export const CHANNEL_OPTIONS: AlertChannel[] = ['telegram', 'discord', 'email'];
