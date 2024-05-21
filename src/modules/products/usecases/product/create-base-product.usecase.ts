import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  CreateProductDto,
  OutputProductDto,
} from '@modules/products/dtos/product/create-product.dto';
import { Products } from '@modules/products/entities/products.entity';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateBaseProductUseCase
  implements BaseUseCase<CreateProductDto, Either<Error, OutputProductDto>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    input: CreateProductDto,
  ): Promise<Either<Error, OutputProductDto>> {
    const productEntity = Products.CreateNew({
      ...input,
    });

    const product = await this.productRepository.create(productEntity);

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
    });
  }
}
