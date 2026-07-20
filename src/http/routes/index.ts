import { Router } from 'express';
import { registerUserRouter } from './user/userRegisterRoute';
import { authRouter } from './user/authRoute';
import { getAllUsersRouter } from './user/getAllUsersRoute';
import { getUserByIdRouter } from './user/getUserByIdRoute';

const router = Router();

router.use('/', registerUserRouter);
router.use('/auth', authRouter);
router.use('/users', getAllUsersRouter);
router.use('/user', getUserByIdRouter);

export { router };
