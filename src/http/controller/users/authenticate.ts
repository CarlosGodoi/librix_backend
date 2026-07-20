import type { NextFunction, Request, Response } from 'express';
import { authBodySchema } from './schemas/authSchema';
import { TokenService } from '@/services/tokenService';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const { email, password } = authBodySchema.parse(req.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const auth = await authenticateUseCase.execute({ email, password });

    const accessToken = TokenService.generateAccessToken({
      userId: auth.user.id,
      email: auth.user.email,
      role: auth.user.profile,
    });

    const refreshToken = TokenService.generateRefreshToken({
      userId: auth.user.id,
    });

    return res.status(200).json({
      user: auth.user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
