import type { NextFunction, Request, Response } from 'express';
import { authBodySchema } from './schemas/authSchema';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { JwtTokenProvider } from '@/services/token/jwt-token-provider';
import { AppError } from '@/utils/errors/appError';

export async function authenticateController(req: Request, res: Response, next: NextFunction) {
  const { email, password } = authBodySchema.parse(req.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const auth = await authenticateUseCase.execute({ email, password });

    const tokenService = new JwtTokenProvider();

    const accessToken = tokenService.generateAccessToken({
      userId: auth.user.id,
      email: auth.user.email,
      role: auth.user.profile,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: auth.user.id,
    });

    return res.status(200).json({
      user: auth.user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(401).send({ message: error.message });
    }
    next(error);
  }
}
