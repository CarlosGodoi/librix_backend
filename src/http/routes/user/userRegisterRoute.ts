import { registerUserController } from '@/http/controller/users/register';
import { Router } from 'express';

const registerUserRouter = Router();

registerUserRouter.post('/register', async (req, res, next) => {
  await registerUserController(req, res, next);
});

export { registerUserRouter };
