import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { DeleteVariantDto } from '@modules/products/dtos/product/variant/delete-variant.dto';
import { VariantRepositoryInterface } from '@modules/products/interfaces/variant.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteVariantUseCase
  implements BaseUseCase<DeleteVariantDto, Either<Error, void>>
{
  constructor(
    @Inject('productVariantRepository')
    private readonly productVariantRepository: VariantRepositoryInterface,
  ) {}

  async execute(input: DeleteVariantDto): Promise<Either<Error, void>> {
    const deleteVariant = await this.productVariantRepository.delete(input.id);

    if (deleteVariant.isLeft()) {
      return left(deleteVariant.value);
    }

    return right(null);
  }
}
