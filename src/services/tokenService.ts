import { env } from '@/config';
import Jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_REFRESH_SECRET = 'refresh-token-secret' } = env;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined');
}

export class TokenService {
  static generateAccessToken(payload: object): string {
    return Jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: object): string {
    return Jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  static verifyRefreshToken(token: string): { userId: string } {
    return Jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  }
}
