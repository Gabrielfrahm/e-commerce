import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputCategoryDto } from '@modules/products/dtos/category/category.dto';
import { FindOneCategoryDto } from '@modules/products/dtos/category/find-one-category.dto';
import { Category } from '@modules/products/entities/categories.entity';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindOneCategoryUseCase
  implements BaseUseCase<FindOneCategoryDto, Either<Error, OutputCategoryDto>>
{
  constructor(
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(
    input: FindOneCategoryDto,
  ): Promise<Either<Error, OutputCategoryDto>> {
    const category = await this.categoryRepository.findById(input.id);

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
