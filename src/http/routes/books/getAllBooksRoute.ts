import { getAllBooksController } from '@/http/controller/books/getAllBooks';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getAllBooksRouter = Router();

getAllBooksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await getAllBooksController(req, res, next);
});

export { getAllBooksRouter };
