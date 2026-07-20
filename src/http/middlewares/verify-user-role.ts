import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors/appError';
import type { Profile } from '../../../generated/prisma/enums';

export function verifyUserRole(...allowedRoles: Profile[]) {
  return (req: Request, _: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new AppError('error', 'Permission denied: Insufficient role', 403));
    }

    next();
  };
}
