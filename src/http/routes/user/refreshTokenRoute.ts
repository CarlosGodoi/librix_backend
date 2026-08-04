import { refreshTokenController } from '@/http/controller/users/refreshToken';
import { Router } from 'express';

const refreshTokenRouter = Router();

refreshTokenRouter.post('/', async (req, res, next) => {
  await refreshTokenController(req, res, next);
});

export { refreshTokenRouter };
