import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { CreateCommand } from '../dtos/create-or-recovery-password.dto';
import { Either, left, right } from '@common/utils/either';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { UserCodeDAOInterface } from '../interfaces/user-token.dao.interface';
import { CryptoInterface } from '@modules/auth/interfaces/crypto.interface';

@Injectable()
export class CreateOrRecoveryPasswordUseCase
  implements BaseUseCase<CreateCommand, Either<Error, string>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('userCodeDAO')
    private readonly userCodeDao: UserCodeDAOInterface,
    @Inject('cryptoService')
    private readonly cryptoService: CryptoInterface,
  ) {}

  async execute(input: CreateCommand): Promise<Either<Error, string>> {
    const code = await this.userCodeDao.findCode(Number(input.code));

    if (code.isLeft()) {
      return left(code.value);
    }

    const user = await this.userRepository.findById(code.value.userId);

    if (user.isLeft()) {
      return left(user.value);
    }

    const password = await this.cryptoService.hash(input.password);

    if (password.isLeft()) {
      return left(password.value);
    }

    user.value.setPassword(password.value);

    const updatedUser = await this.userRepository.updatedUser(user.value);

    if (updatedUser.isLeft()) {
      return left(updatedUser.value);
    }

    return right('ok');
  }
}
