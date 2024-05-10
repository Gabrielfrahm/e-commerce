import { BaseUseCase } from '@common/interfaces/usecases.interface';
import {
  CreateCommandClientDto,
  CreateOutputClientDto,
} from '../dtos/create-client.dto';
import { Either, left, right } from '@common/utils/either';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export class CreateClienteWithEmailUseCase
  implements
    BaseUseCase<CreateCommandClientDto, Either<Error, CreateOutputClientDto>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
    @InjectQueue('usersQueue') private usersQueue: Queue,
  ) {}

  async execute(
    input: CreateCommandClientDto,
  ): Promise<Either<Error, CreateOutputClientDto>> {
    const client = await this.userRepository.createClient(input.email);

    if (client.isLeft()) {
      return left(client.value);
    }

    await this.usersQueue.add('send.email.client', {
      email: client.value.getEmail(),
    });

    return right({
      id: client.value.getId(),
      email: client.value.getEmail(),
      type: client.value.getType(),
      createdAt: client.value.getCreatedAt(),
      updatedAt: client.value.getUpdatedAt(),
    });
  }
}
