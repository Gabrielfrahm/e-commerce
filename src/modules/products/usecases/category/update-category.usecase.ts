import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputCategoryDto } from '@modules/products/dtos/category/category.dto';
import { CommandUpdateCategoryDto } from '@modules/products/dtos/category/update-category.dto';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCategoryUseCase
  implements
    BaseUseCase<CommandUpdateCategoryDto, Either<Error, OutputCategoryDto>>
{
  constructor(
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(
    input: CommandUpdateCategoryDto,
  ): Promise<Either<Error, OutputCategoryDto>> {
    const category = await this.categoryRepository.findById(input.id);

    if (category.isLeft()) {
      return left(category.value);
    }

    if (input.name) {
      category.value.setName(input.name);
    }

    if (input.parentCategoryId) {
      category.value.setParentCategoryId(input.parentCategoryId);
    }

    const updatedCategory = await this.categoryRepository.update(
      category.value,
    );

    if (updatedCategory.isLeft()) {
      return left(updatedCategory.value);
    }

    return right({
      id: updatedCategory.value.getId(),
      name: updatedCategory.value.getName(),
      parentCategoryId: updatedCategory.value.getParentCategoryId(),
      createdAt: updatedCategory.value.getCreatedAt(),
      updatedAt: updatedCategory.value.getUpdatedAt(),
      deletedAt: updatedCategory.value.getDeletedAt(),
    });
  }
}
