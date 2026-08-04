import { env } from '@/config';
import Jwt from 'jsonwebtoken';
import type { RefreshTokenPayload, TokenPayload } from './type/token-payload';

const { JWT_SECRET, JWT_REFRESH_SECRET = 'refresh-token-secret' } = env;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined');
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return Jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return Jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return Jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }
}
