import { z } from 'zod';
import { BookCategory } from '../type/book-category';

export const registerBookBodySchema = z.object({
  title: z.string().trim().min(1, { message: 'Titulo é obrigatório.' }),
  author: z.string().trim().min(1, { message: 'Autor é obrigatório.' }),
  isbn: z.string().trim().min(1, { message: 'ISBN é obrigatório.' }),
  publisher: z.string(),
  category: z.enum(BookCategory),
  year: z.number(),
  copies: z.number(),
  synopsis: z.string().nullish(),
  coverUrl: z.string().nullish(),
});

export type RegisterBookBodySchema = z.infer<typeof registerBookBodySchema>;
