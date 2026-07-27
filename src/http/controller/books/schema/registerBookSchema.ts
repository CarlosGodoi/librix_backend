import { z } from 'zod';
import { BookCategory } from '../type/book-category';

const brDateToISO = (val: string) => {
  const [day, month, year] = val.split('/');
  return `${year}-${month}-${day}`;
};

export const registerBookBodySchema = z.object({
  title: z.string().trim().min(1, { message: 'Titulo é obrigatório.' }),
  author: z.string().trim().min(1, { message: 'Autor é obrigatório.' }),
  isbn: z.string().trim().min(1, { message: 'ISBN é obrigatório.' }),
  publisher: z.string(),
  category: z.enum(BookCategory),
  year: z.preprocess((val) => {
    if (typeof val === 'string') return brDateToISO(val);
    return val;
  }, z.coerce.date().optional()),
  copies: z.number(),
  synopsis: z.string().nullish(),
  coverUrl: z.string().nullish(),
});

export type RegisterBookBodySchema = z.infer<typeof registerBookBodySchema>;
