import { Router } from 'express';
import { registerUserRouter } from './user/userRegisterRoute';
import { authRouter } from './user/authRoute';
import { getAllUsersRouter } from './user/getAllUsersRoute';
import { getUserByIdRouter } from './user/getUserByIdRoute';
import { deleteUserRouter } from './user/deleteUserRoute';
import { updateUserRouter } from './user/updateUserRoute';
import { registerBookRouter } from './books/registerBookRoute';
import { registerLoanRouter } from './loans/registerLoanRoute';
import { getAllBooksRouter } from './books/getAllBooksRoute';
import { uploadImageBookRouter } from './books/uploadImageRoute';

const router = Router();

// User Routes
router.use('/', registerUserRouter);
router.use('/auth', authRouter);
router.use('/users', getAllUsersRouter);
router.use('/user', getUserByIdRouter);
router.use('/user', deleteUserRouter);
router.use('/user', updateUserRouter);

// Books Routes
router.use('/book', registerBookRouter);
router.use('/book', uploadImageBookRouter);
router.use('/books', getAllBooksRouter);

// Loans Routes
router.use('/loan', registerLoanRouter);
export { router };
