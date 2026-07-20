import { Router } from 'express';
import { registerUserRouter } from './user/userRegisterRoute';
import { authRouter } from './user/authRoute';
import { getAllUsersRouter } from './user/getAllUsersRoute';
import { getUserByIdRouter } from './user/getUserByIdRoute';
import { deleteUserRouter } from './user/deleteUserRoute';

const router = Router();

router.use('/', registerUserRouter);
router.use('/auth', authRouter);
router.use('/users', getAllUsersRouter);
router.use('/user', getUserByIdRouter);
router.use('/user', deleteUserRouter);

export { router };
