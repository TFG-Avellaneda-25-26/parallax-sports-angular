export type UserRole = 'USER' | 'ADMIN';

export interface AdminUserListItem {
  id: number;
  email: string;
  displayName: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminUserPage {
  content: AdminUserListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface AdminUserIdentity {
  id: number;
  provider: string;
  providerUsername: string | null;
  providerEmail: string | null;
}

export interface AdminUserSettings {
  theme: string;
  defaultView: string;
  timezone: string;
  dateFormat: string;
}

export interface AdminUserDetails {
  id: number;
  email: string;
  displayName: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  settings: AdminUserSettings | null;
  identities: AdminUserIdentity[];
  sportFollowCount: number;
  sportSettingCount: number;
}

export interface AdminUserSearch {
  q?: string | null;
  role?: UserRole | null;
  emailVerified?: boolean | null;
  page?: number;
  size?: number;
}
