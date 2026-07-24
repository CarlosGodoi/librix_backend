import type { LoanStatus } from 'generated/prisma/enums';

export interface IUpdateLoanDTO {
  id: string;
  dueDate?: Date;
  status?: LoanStatus;
}
