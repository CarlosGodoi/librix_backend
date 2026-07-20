import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/errors/appError';
import { env } from '../../config/index';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

export async function verifyJwt(req: Request, _: Response, next: NextFunction) {
  const authHeader = req.headers.authorization as string;

  if (!authHeader) {
    return next(new AppError('error', 'Unauthorized.', 401));
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('error', 'Unauthorized', 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

    const userExists = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      return next(new AppError('error', 'User not exists.', 401));
    }

    req.user = {
      id: userExists.id,
      role: userExists.profile,
    };

    next();
  } catch (error) {
    console.error(error);

    next(new AppError('error', 'Invalid token.', 401));
  }
}
