import { makeHandleChatMessageUseCase } from '@/use-cases/factories/make-handle-chat-message-use-case';
import type { NextFunction, Request, Response } from 'express';
import {
  handleChatMessageBodySchema,
  handleChatMessageParamsSchema,
} from './schema/handleChatMessageSchema';

export async function handleChatMessageController(req: Request, res: Response, next: NextFunction) {
  const { userId } = handleChatMessageParamsSchema.parse(req.params);
  const { message } = handleChatMessageBodySchema.parse(req.body);

  const handleChatMessageUseCase = makeHandleChatMessageUseCase();
  const { reply } = await handleChatMessageUseCase.execute({ userId, message });

  return res.status(200).json({ reply });
}
