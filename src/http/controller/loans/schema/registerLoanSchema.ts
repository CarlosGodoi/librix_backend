import { z } from 'zod';

const brDateToISO = (val: string) => {
  const [day, month, year] = val.split('/');
  return `${year}-${month}-${day}`;
};

export const registerLoanBodySchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  loanDate: z.preprocess((val) => {
    if (typeof val === 'string') return brDateToISO(val);
    return val;
  }, z.coerce.date().optional()),
  dueDate: z.preprocess((val) => {
    if (typeof val === 'string') return brDateToISO(val);
    return val;
  }, z.coerce.date().optional()),
  returnDate: z.preprocess((val) => {
    if (typeof val === 'string') return brDateToISO(val);
    return val;
  }, z.coerce.date().optional()),
  status: z.enum(['INPROGRESS', 'DELAYED', 'RETURNED']),
});

export type RegisterLoanBodySchema = z.infer<typeof registerLoanBodySchema>;
