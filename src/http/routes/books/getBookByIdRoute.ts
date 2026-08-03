import { getBookByIdController } from '@/http/controller/books/getBookById';
import { Router } from 'express';

const getBookByIdRouter = Router();

getBookByIdRouter.get('/:id', async (req, res, next) => {
  await getBookByIdController(req, res, next);
});

export { getBookByIdRouter };
