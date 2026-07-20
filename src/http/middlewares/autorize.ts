import type { Profile } from 'generated/prisma/enums';
import { verifyJwt } from './verify-jwt';
import { verifyUserRole } from './verify-user-role';
import type { RequestHandler } from 'express';

export function autorize(...roles: Profile[]): RequestHandler[] {
  return [verifyJwt, verifyUserRole(...roles)];
}
