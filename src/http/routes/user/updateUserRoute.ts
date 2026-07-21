import { updateUser } from '@/http/controller/users/updateUser';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const updateUserRouter = Router();

updateUserRouter.put(
  '/update/:id',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await updateUser(req, res, next);
  },
);

export { updateUserRouter };
