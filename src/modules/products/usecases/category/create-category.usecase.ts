import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  CommandCreateCategoryDto,
  OutputCategoryDto,
} from '@modules/products/dtos/category.dto';
import { Category } from '@modules/products/entities/categories.entity';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateCategoryUseCase
  implements
    BaseUseCase<CommandCreateCategoryDto, Either<Error, OutputCategoryDto>>
{
  constructor(
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(
    input: CommandCreateCategoryDto,
  ): Promise<Either<Error, OutputCategoryDto>> {
    let parentCategoryId: string = undefined;

    if (input.parentCategoryId) {
      const category = await this.categoryRepository.findById(
        input.parentCategoryId,
      );

      if (category.isLeft()) {
        return left(category.value);
      }

      parentCategoryId = category.value.getId();
    }

    const category = await this.categoryRepository.create(
      Category.CreateNew({
        name: input.name,
        parentCategoryId: parentCategoryId,
      }),
    );

    if (category.isLeft()) {
      return left(category.value);
    }

    return right({
      id: category.value.getId(),
      name: category.value.getName(),
      parentCategoryId: category.value.getParentCategoryId(),
      createdAt: category.value.getCreatedAt(),
      updatedAt: category.value.getUpdatedAt(),
      deletedAt: category.value.getDeletedAt(),
    });
  }
}
