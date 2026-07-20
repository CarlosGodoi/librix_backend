import { authenticate } from '@/http/controller/users/authenticate';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/', async (req, res, next) => {
  await authenticate(req, res, next);
});

export { authRouter };
