import type { Profile } from 'generated/prisma/enums';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Profile;
}

export interface RefreshTokenPayload {
  userId: string;
}
