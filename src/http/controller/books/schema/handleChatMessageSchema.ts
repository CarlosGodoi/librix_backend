import z from 'zod';

export const handleChatMessageBodySchema = z.object({
  message: z.string().min(1, 'A mensagem não pode estar vazia.'),
});

export const handleChatMessageParamsSchema = z.object({
  userId: z.uuid(),
});

export type HandleChatMessageBodySchema = z.infer<typeof handleChatMessageBodySchema>;
export type HandleChatMessageParamsSchema = z.infer<typeof handleChatMessageParamsSchema>;
