import { getAllUsers } from '@/http/controller/users/getAllUsers';
import { Router } from 'express';

const getAllUsersRouter = Router();

getAllUsersRouter.get('/', async (req, res, next) => {
  await getAllUsers(req, res, next);
});

export { getAllUsersRouter };
