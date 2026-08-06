import { makeRefreshTokenUseCase } from '@/use-cases/factories/make-refresh-token-use-case';
import { AppError } from '@/utils/errors/appError';
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
    if (error instanceof AppError) {
      return res.status(404).send({ message: error.message });
    }
    next(error);
  }
}
