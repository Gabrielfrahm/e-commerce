import { BaseUseCase } from '@common/interfaces/usecases.interface';
import {
  CreateEmployerDto,
  CreateOutputEmployerDto,
} from '../dtos/create-employer.dto';
import { Either, left, right } from '@common/utils/either';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';

export class CreateEmployerUseCase
  implements
    BaseUseCase<CreateEmployerDto, Either<Error, CreateOutputEmployerDto>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(
    input: CreateEmployerDto,
  ): Promise<Either<Error, CreateOutputEmployerDto>> {
    const employerEntity = User.createNew({
      email: input.email,
      name: input.name,
      type: 'employer',
    });

    const employer = await this.userRepository.createEmployer(employerEntity);

    if (employer.isLeft()) {
      return left(employer.value);
    }

    return right({
      id: employer.value.getId(),
      email: employer.value.getEmail(),
      name: employer.value.getName(),
      type: employer.value.getType(),
      createdAt: employer.value.getCreatedAt(),
      updatedAt: employer.value.getUpdatedAt(),
    });
  }
}
