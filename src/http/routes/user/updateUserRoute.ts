import { updateUserController } from '@/http/controller/users/updateUser';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const updateUserRouter = Router();

updateUserRouter.put(
  '/update/:id',
  autorize('ADMIN', 'VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await updateUserController(req, res, next);
  },
);

export { updateUserRouter };
