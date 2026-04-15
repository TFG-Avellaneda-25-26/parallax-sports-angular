export interface User {
  // Core user properties
  id: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;

  // Optional profile properties
  settings?: UserSettings;
  sportSettings?: UserSportSettings[];
  follows?: UserSportFollow[];
  identities?: UserIdentity[];

  // Metadata
  createdAt?: string;
  lastLoginAt?: string;
}

export interface UserIdentity {
  id: string;
  provider: string;
  providerUsername: string | null;
  providerEmail: string | null;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'cards' | 'table' | 'calendar';
  timeZone: string;
  locale: string;
  updatedAt: string;
}

export interface UserSportSettings {
  sportId: string;
  followAll: boolean;
  eventTypeFilter: string[];
  notifyDefault: boolean;
}

export interface UserSportFollow {
  id: string;
  sportId: string;
  followType: 'competition' | 'participant';
  competitionId?: string;
  participantId?: string;
  eventTypeFilter: string[];
  notify: boolean;
}
