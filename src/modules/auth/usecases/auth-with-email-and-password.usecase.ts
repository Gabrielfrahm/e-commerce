import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { JwtInterface } from '@modules/auth/interfaces/jwt.interface';
import { CryptoInterface } from '../interfaces/crypto.interface';
import { UseCaseException } from '@common/exceptions/usecase.exception';
import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/users/interfaces/user.repository.interface';

export interface Input {
  email: string;
  password: string;
}

export type Output = Either<Error, { token: string }>;

@Injectable()
export class AuthWithEmailAndPassword implements BaseUseCase<Input, Output> {
  constructor(
    private readonly jwtService: JwtInterface,
    private readonly cryptoService: CryptoInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      return left(user.value);
    }

    const comparePassword = await this.cryptoService.compare(
      input.password,
      user.value.getPassword(),
    );

    if (!comparePassword) {
      return left(new UseCaseException('Invalid credentials', 401));
    }

    const token = await this.jwtService.generateToken({}, '7d');

    if (token.isLeft()) {
      return left(token.value);
    }

    return right({ token: token.value });
  }
}
