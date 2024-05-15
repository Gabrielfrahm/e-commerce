import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputCategoryDto } from '@modules/products/dtos/category/category.dto';
import {
  OutputSearchCategoriesDto,
  SearchCategoriesDto,
} from '@modules/products/dtos/category/search-categories.dto';
import { Category } from '@modules/products/entities/categories.entity';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SearchCategoriesUseCase
  implements
    BaseUseCase<SearchCategoriesDto, Either<Error, OutputSearchCategoriesDto>>
{
  constructor(
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(
    input: SearchCategoriesDto,
  ): Promise<Either<Error, OutputSearchCategoriesDto>> {
    const categories = await this.categoryRepository.list(input);
    if (categories.isLeft()) {
      return left(categories.value);
    }

    const outputCategory = await this.buildCategoryHierarchy(
      categories.value.data,
    );

    return right({
      data: outputCategory,
      meta: categories.value.meta,
    });
  }

  private async buildCategoryHierarchy(
    categories: Category[],
  ): Promise<OutputCategoryDto[]> {
    const categoriesReturned = [];
    for (const category of categories) {
      const parentCategoryId = category.getParentCategoryId();
      let parentCategoryDto = null;

      if (parentCategoryId) {
        const parentCategoryOrError =
          await this.categoryRepository.findById(parentCategoryId);

        if (parentCategoryOrError.isLeft()) {
          throw new Error('Parent category not found');
        }

        const parentCategory = parentCategoryOrError.value;
        parentCategoryDto = await this.buildCategoryHierarchy([parentCategory]);
      }

      categoriesReturned.push({
        id: category.getId(),
        name: category.getName(),
        parentCategoryId: category.getParentCategoryId(),
        parentCategory: parentCategoryDto,
        createdAt: category.getCreatedAt(),
        updatedAt: category.getUpdatedAt(),
        deletedAt: category.getDeletedAt(),
      });
    }
    return categoriesReturned;
  }
}
