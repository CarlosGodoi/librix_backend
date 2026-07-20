import type { UsersRepository } from '@/repositories/users-repository';
import { AppError } from '@/utils/errors/appError';
import { compare } from 'bcrypt';
import type { User } from 'generated/prisma/client';

interface IAuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface IAuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('error', 'Invalid credentials.');
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      throw new AppError('error', 'Invalid credentials.');
    }

    return { user };
  }
}
