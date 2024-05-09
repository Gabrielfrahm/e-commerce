import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { JwtInterface } from '@modules/auth/interfaces/jwt.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/users/interfaces/user.repository.interface';
import { UserTokenRepositoryInterface } from '../interfaces/userToken.reposioty.interface';
import {
  CreateClientCommandAuthDto,
  CreateClientOutputAuthDto,
} from '../dtos/auth-client.dto';
import { UseCaseException } from '@common/exceptions/usecase.exception';

@Injectable()
export class AuthWithEmail
  implements
    BaseUseCase<
      CreateClientCommandAuthDto,
      Either<Error, CreateClientOutputAuthDto>
    >
{
  constructor(
    @Inject('jwtService') private readonly jwtService: JwtInterface,
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('userTokenRepository')
    private readonly userTokenRepository: UserTokenRepositoryInterface,
  ) {}

  async execute(
    input: CreateClientCommandAuthDto,
  ): Promise<Either<Error, CreateClientOutputAuthDto>> {
    const user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      return left(user.value);
    }

    if (user.value.getType() !== 'client') {
      return left(new UseCaseException('not allowed', 401));
    }

    const token = await this.jwtService.generateToken(
      { id: user.value.getId(), type: user.value.getType() },
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
