import { getBookRecommendations } from '@/http/controller/books/getBookRecommendations';
import { Router } from 'express';

const getBooksRecommendationsRouter = Router();

getBooksRecommendationsRouter.get('/recommendations/:userId', async (req, res, next) => {
  await getBookRecommendations(req, res, next);
});

export { getBooksRecommendationsRouter };
