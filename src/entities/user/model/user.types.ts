export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  emailVerified: boolean;
}

export type UserRole = 'USER' | 'ADMIN';
