import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';

import {
  OutputSearchProductsDto,
  SearchProductsDto,
} from '@modules/products/dtos/product/search-product.dto';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SearchBaseProductsUseCase
  implements
    BaseUseCase<SearchProductsDto, Either<Error, OutputSearchProductsDto>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    input: SearchProductsDto,
  ): Promise<Either<Error, OutputSearchProductsDto>> {
    const products = await this.productRepository.list(input);
    if (products.isLeft()) {
      return left(products.value);
    }

    return right({
      data: products.value.data.map((product) => ({
        id: product.getId(),
        basePrice: product.getBasePrice(),
        description: product.getDescription(),
        imageUrl: product.getImageUrl(),
        name: product.getName(),
        taxRate: product.getTaxRate(),
        categories: product.getCategories().map((category) => ({
          id: category.getId(),
          name: category.getName(),
        })),
      })),
      meta: products.value.meta,
    });
  }
}
