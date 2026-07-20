import type { User } from '../../../generated/prisma/browser';
import type { Profile, Status } from '../../../generated/prisma/enums';
import type { UsersRepository } from '../../repositories/users-repository';
import { hash } from 'bcrypt';
import { AppError } from '../../utils/errors/appError';

interface IRegisterUseCaseRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  profile: Profile;
  situation: Status;
}

interface IRegisterUseCaseResponse {
  user: User;
}

export class RegisterUserUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    phone,
    password,
    profile,
    situation,
  }: IRegisterUseCaseRequest): Promise<IRegisterUseCaseResponse> {
    try {
      const password_hash = await hash(password, 8);

      const emailExists = await this.usersRepository.findByEmail(email);

      if (emailExists) {
        throw new AppError('email', `Este e-mail já esta em uso.`);
      }

      const user = await this.usersRepository.create({
        name,
        email,
        phone,
        password: password_hash,
        profile,
        situation,
      });

      return { user };
    } catch (error) {
      console.error('Erro no RegisterUseCase', error);
      throw error;
    }
  }
}
