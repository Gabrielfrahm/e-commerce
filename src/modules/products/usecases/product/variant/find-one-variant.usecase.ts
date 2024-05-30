import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputVariantDto } from '@modules/products/dtos/product/variant/create-variant.dto';
import { FindOneVariantDto } from '@modules/products/dtos/product/variant/find-one-variant.dto';
import { VariantRepositoryInterface } from '@modules/products/interfaces/variant.repository';
import { Inject } from '@nestjs/common';

export class FindOneVariantUseCase
  implements BaseUseCase<FindOneVariantDto, Either<Error, OutputVariantDto>>
{
  constructor(
    @Inject('productVariantRepository')
    private readonly productVariantRepository: VariantRepositoryInterface,
  ) {}
  async execute(
    input: FindOneVariantDto,
  ): Promise<Either<Error, OutputVariantDto>> {
    const variant = await this.productVariantRepository.findById(input.id);

    if (variant.isLeft()) {
      return left(variant.value);
    }

    return right({
      id: variant.value.getId(),
      imageUrl: variant.value.getImageUrl(),
      price: variant.value.getPrice(),
      product: {
        id: variant.value.getProduct().getId(),
        name: variant.value.getProduct().getId(),
      },
      promotionalPrice: variant.value.getPromotionalPrice(),
      sku: variant.value.getSku(),
      stockQuantity: variant.value.getStockQuantity(),
      attributes: variant.value.getAttributes().map((att) => ({
        id: att.getId(),
        value: att.getValue(),
      })),
    });
  }
}
