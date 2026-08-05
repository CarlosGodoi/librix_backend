import type { RefreshTokenPayload, TokenPayload } from "./types.ts";

export interface TokenProvider {
  generateAccessToken(payload: TokenPayload): string;

  generateRefreshToken(payload: RefreshTokenPayload): string;

  verifyRefreshToken(token: string): RefreshTokenPayload;
}
