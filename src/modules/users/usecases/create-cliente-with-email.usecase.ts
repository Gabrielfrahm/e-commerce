import { BaseUseCase } from '@common/interfaces/usecases.interface';
import {
  CreateCommandClientDto,
  CreateOutputClientDto,
} from '../dtos/create-client.dto';
import { Either, left, right } from '@common/utils/either';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { Inject } from '@nestjs/common';

export class CreateClienteWithEmailUseCase
  implements
    BaseUseCase<CreateCommandClientDto, Either<Error, CreateOutputClientDto>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(
    input: CreateCommandClientDto,
  ): Promise<Either<Error, CreateOutputClientDto>> {
    const client = await this.userRepository.createClient(input.email);

    if (client.isLeft()) {
      return left(client.value);
    }

    return right({
      id: client.value.getId(),
      email: client.value.getEmail(),
      type: client.value.getType(),
      createdAt: client.value.getCreatedAt(),
      updatedAt: client.value.getUpdatedAt(),
    });
  }
}
