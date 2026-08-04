import { prisma } from '@/lib/prisma';
import { TokenService } from '@/services/tokenService';
import type { NextFunction, Request, Response } from 'express';
import { Profile } from 'generated/prisma/enums';

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body as { refreshToken: string };

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required.' });
  }

  try {
    const decoded = TokenService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: '',
      role: user.profile as Profile,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error('Error Refresh Token: ', error);
    return res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
}
