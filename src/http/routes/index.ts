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
import { getBookByIdRouter } from './books/getBookByIdRoute';
import { getBooksRecommendationsRouter } from './books/getBookRecommendationsRoute';
import { returnedLoanRouter } from './loans/returnedLoanRoute';
import { getAllLoansRouter } from './loans/getAllLoansRoute';
import { refreshTokenRouter } from './user/refreshTokenRoute';
import { updateBookRouter } from './books/updateBookRoute';
import { getLoansByUserIdRouter } from './loans/getLoansByUserIdRoute';
import { deleteBookRouter } from './books/deleteBook';
import { chatRouter } from './books/chat';

const router = Router();

// User Routes
router.use('/', registerUserRouter);
router.use('/auth', authRouter);
router.use('/refresh', refreshTokenRouter);
router.use('/users', getAllUsersRouter);
router.use('/user', getUserByIdRouter);
router.use('/user', deleteUserRouter);
router.use('/user', updateUserRouter);

// Books Routes
router.use('/book', registerBookRouter);
router.use('/book', uploadImageBookRouter);
router.use('/books', getAllBooksRouter);
router.use('/books', getBooksRecommendationsRouter);
router.use('/book', getBookByIdRouter);
router.use('/book', updateBookRouter);
router.use('/book', deleteBookRouter);

// Chat Route
router.use('/chat', chatRouter);

// Loans Routes
router.use('/loan', registerLoanRouter);
router.use('/loan', returnedLoanRouter);
router.use('/loans', getAllLoansRouter);
router.use('/loans', getLoansByUserIdRouter);
export { router };
