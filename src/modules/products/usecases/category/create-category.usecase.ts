import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  CommandCreateCategoryDto,
  OutputCategoryDto,
} from '@modules/products/dtos/category/category.dto';
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

    const outputCategory = await this.buildCategoryHierarchy(category.value);

    return right(outputCategory);
  }

  private async buildCategoryHierarchy(
    category: Category,
  ): Promise<OutputCategoryDto> {
    const parentCategoryId = category.getParentCategoryId();
    let parentCategoryDto = null;

    if (parentCategoryId) {
      const parentCategoryOrError =
        await this.categoryRepository.findById(parentCategoryId);

      if (parentCategoryOrError.isLeft()) {
        throw new Error('Parent category not found');
      }

      const parentCategory = parentCategoryOrError.value;
      parentCategoryDto = await this.buildCategoryHierarchy(parentCategory);
    }

    return {
      id: category.getId(),
      name: category.getName(),
      parentCategoryId: category.getParentCategoryId(),
      parentCategory: parentCategoryDto,
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt(),
      deletedAt: category.getDeletedAt(),
    };
  }
}
