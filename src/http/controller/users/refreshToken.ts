import { makeRefreshTokenUseCase } from '@/use-cases/factories/make-refresh-token-use-case';
import type { NextFunction, Request, Response } from 'express';

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body as { refreshToken: string };

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const refreshTokenUseCase = makeRefreshTokenUseCase();

    const { accessToken } = await refreshTokenUseCase.execute(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error Refresh Token: ', error);
    return res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
}
