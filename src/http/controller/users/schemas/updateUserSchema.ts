import z from 'zod';

const brDateToISO = (val: string) => {
  const [day, month, year] = val.split('/');
  return `${year}-${month}-${day}`;
};

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  email: z.string(),
  phone: z.string(),
  profile: z.enum(['ADMIN', 'LIBRARIAN', 'VISITOR']),
  situation: z.enum(['ACTIVE', 'INACTIVE']),
  updatedAt: z.preprocess((val) => {
    if (typeof val === 'string') return brDateToISO(val);
    return val;
  }, z.coerce.date().optional()),
});
