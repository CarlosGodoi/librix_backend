import { env } from '@/config';
import Jwt from 'jsonwebtoken';
import type { RefreshTokenPayload, TokenPayload } from './types';
import type { TokenProvider } from './token-provider';

export class JwtTokenProvider implements TokenProvider {
  generateAccessToken(payload: TokenPayload): string {
    return Jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return Jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return Jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }
}
