import z from 'zod';
import { isvalidPassword } from '../../../../utils/errors/validatePassword';

export const registerUserBodySchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  email: z.string(),
  phone: z.string(),
  profile: z.enum(['ADMIN', 'LIBRARIAN', 'VISITOR']),
  situation: z.enum(['ACTIVE', 'INACTIVE']),
  password: z.string().refine(isvalidPassword, {
    message:
      'A senha deve conter no mínimo 6 digitos, 1 Letra maiúscula, número e caractere especial.',
  }),
});

export type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;
