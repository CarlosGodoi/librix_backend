import { handleChatMessageController } from '@/http/controller/books/handleChatMessage';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const chatRouter = Router();

chatRouter.post(
  '/:userId/message',
  autorize('VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await handleChatMessageController(req, res, next);
  },
);

export { chatRouter };
