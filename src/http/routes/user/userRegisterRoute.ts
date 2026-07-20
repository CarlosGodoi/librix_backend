import { Router } from 'express';
import { registerUser } from '../../controller/users/register';

const registerUserRouter = Router();

registerUserRouter.post('/register', async (req, res, next) => {
  await registerUser(req, res, next);
});

export { registerUserRouter };
