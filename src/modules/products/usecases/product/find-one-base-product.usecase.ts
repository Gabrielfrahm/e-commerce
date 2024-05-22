import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputProductDto } from '@modules/products/dtos/product/create-product.dto';
import { FindOneBaseProduct } from '@modules/products/dtos/product/find-one-base-product.dto';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindOneBaseProductUseCase
  implements BaseUseCase<FindOneBaseProduct, Either<Error, OutputProductDto>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    input: FindOneBaseProduct,
  ): Promise<Either<Error, OutputProductDto>> {
    const product = await this.productRepository.findById(input.id);

    if (product.isLeft()) {
      return left(product.value);
    }

    return right({
      id: product.value.getId(),
      basePrice: product.value.getBasePrice(),
      description: product.value.getDescription(),
      imageUrl: product.value.getImageUrl(),
      name: product.value.getName(),
      taxRate: product.value.getTaxRate(),
      categories: product.value.getCategories().map((category) => ({
        id: category.getId(),
        name: category.getName(),
      })),
    });
  }
}
