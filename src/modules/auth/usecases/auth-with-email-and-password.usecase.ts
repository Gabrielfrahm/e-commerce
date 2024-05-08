import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { JwtInterface } from '@modules/auth/interfaces/jwt.interface';
import { CryptoInterface } from '../interfaces/crypto.interface';
import { UseCaseException } from '@common/exceptions/usecase.exception';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/users/interfaces/user.repository.interface';
import { UserTokenRepositoryInterface } from '../interfaces/userToken.reposioty.interface';

export interface Input {
  email: string;
  password: string;
}

export type Output = Either<Error, { token: string }>;

@Injectable()
export class AuthWithEmailAndPassword implements BaseUseCase<Input, Output> {
  constructor(
    @Inject('jwtService') private readonly jwtService: JwtInterface,
    @Inject('cryptoService') private readonly cryptoService: CryptoInterface,
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('userTokenRepository')
    private readonly userTokenRepository: UserTokenRepositoryInterface,
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

    if (!comparePassword.value) {
      return left(new UseCaseException('Invalid credentials', 401));
    }

    const token = await this.jwtService.generateToken(
      { id: user.value.getId(), email: user.value.getEmail() },
      '7d',
    );

    if (token.isLeft()) {
      return left(token.value);
    }

    const modelToken = await this.userTokenRepository.create(
      token.value,
      user.value.getId(),
    );

    if (modelToken.isLeft()) {
      return left(modelToken.value);
    }

    return right({ token: token.value });
  }
}
