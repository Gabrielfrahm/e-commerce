import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { DeleteCategoryDto } from '@modules/products/dtos/category/delete-category.dto';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCategoryUseCase
  implements BaseUseCase<DeleteCategoryDto, Either<Error, void>>
{
  constructor(
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(input: DeleteCategoryDto): Promise<Either<Error, void>> {
    const deleteCategory = await this.categoryRepository.delete(input.id);

    if (deleteCategory.isLeft()) {
      return left(deleteCategory.value);
    }

    return right(null);
  }
}
