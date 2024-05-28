import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { DeleteBaseProductDto } from '@modules/products/dtos/product/delete-product.dto';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteBaseProductUseCase
  implements BaseUseCase<DeleteBaseProductDto, Either<Error, void>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(input: DeleteBaseProductDto): Promise<Either<Error, void>> {
    const product = await this.productRepository.findById(input.id);

    if (product.isLeft()) {
      return left(product.value);
    }

    const deleteProduct = await this.productRepository.delete(
      product.value.getId(),
    );

    if (deleteProduct.isLeft()) {
      return left(deleteProduct.value);
    }

    return right(null);
  }
}
