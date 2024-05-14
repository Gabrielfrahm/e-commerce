import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Inject, Injectable } from '@nestjs/common';
import { RecoveryPasswordDto } from '../dtos/recovety-password.dto';
import { Either, left, right } from '@common/utils/either';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { randomInt } from 'crypto';
import { UserCodeDAOInterface } from '../interfaces/user-token.dao.interface';
import { UseCaseException } from '@common/exceptions/usecase.exception';

@Injectable()
export class RecoveryPasswordUseCase
  implements BaseUseCase<RecoveryPasswordDto, Either<Error, string>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @InjectQueue('usersQueue') private usersQueue: Queue,
    @Inject('userCodeDAO')
    private readonly userCodeDao: UserCodeDAOInterface,
  ) {}

  async execute(input: RecoveryPasswordDto): Promise<Either<Error, string>> {
    const user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      return left(user.value);
    }

    if (user.value.getType() === 'client') {
      return left(
        new UseCaseException(`user not found ${user.value.getEmail()}`, 404),
      );
    }

    const code = await this.userCodeDao.createCode({
      code: randomInt(100000, 999999),
      userId: user.value.getId(),
    });

    if (code.isLeft()) {
      return left(code.value);
    }

    await this.usersQueue.add('send.email.recovery.password', {
      email: user.value.getEmail(),
      name: user.value.getName(),
      code: code.value.code,
      link: `${process.env.BASE_URL}/users/password`,
    });

    return right('ok');
  }
}
