import { registerUserController } from '@/http/controller/users/register';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const registerUserRouter = Router();

registerUserRouter.post(
  '/register',
  autorize('ADMIN', 'VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await registerUserController(req, res, next);
  },
);

export { registerUserRouter };
