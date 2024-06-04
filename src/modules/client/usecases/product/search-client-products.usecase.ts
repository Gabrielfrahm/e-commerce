import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  SearchClintVariantsDto,
  OutputSearchClientVariantsDto,
} from '@modules/products/dtos/product/variant/search-client-variant.dto';
import { VariantRepositoryInterface } from '@modules/products/interfaces/variant.repository';
import { Inject } from '@nestjs/common';

export class SearchClientProductUseCase
  implements
    BaseUseCase<
      SearchClintVariantsDto,
      Either<Error, OutputSearchClientVariantsDto>
    >
{
  constructor(
    @Inject('productVariantRepository')
    private readonly productVariantRepository: VariantRepositoryInterface,
  ) {}

  async execute(
    input: SearchClintVariantsDto,
  ): Promise<Either<Error, OutputSearchClientVariantsDto>> {
    const variantProducts =
      await this.productVariantRepository.listClient(input);
    if (variantProducts.isLeft()) {
      return left(variantProducts.value);
    }

    return right({
      data: variantProducts.value.data.map((variant) => ({
        id: variant.getId(),
        imageUrl: variant.getImageUrl(),
        price: variant.getPrice(),
        product: {
          id: variant.getProduct().getId(),
          name: variant.getProduct().getId(),
        },
        promotionalPrice: variant.getPromotionalPrice(),
        sku: variant.getSku(),
        stockQuantity: variant.getStockQuantity(),
        attributes: variant.getAttributes().map((att) => ({
          id: att.getId(),
          value: att.getValue(),
        })),
      })),
      meta: variantProducts.value.meta,
    });
  }
}
