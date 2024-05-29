import { UploadFileInterface } from '@common/interfaces/upload-file.interface';
import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputVariantDto } from '@modules/products/dtos/product/variant/create-variant.dto';
import { UpdateVariantDto } from '@modules/products/dtos/product/variant/update-variant.dto';
import { ProductsAttributes } from '@modules/products/entities/products-attributes.entity';
import { ProductsVariantAttributes } from '@modules/products/entities/products-variant-attributes.entity';
import { AttributesRepositoryInterface } from '@modules/products/interfaces/attributes.repository';
import { VariantRepositoryInterface } from '@modules/products/interfaces/variant.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateVariantUseCase
  implements BaseUseCase<UpdateVariantDto, Either<Error, OutputVariantDto>>
{
  constructor(
    @Inject('productAttributeRepository')
    private readonly productAttributeRepository: AttributesRepositoryInterface,
    @Inject('productVariantRepository')
    private readonly productVariantRepository: VariantRepositoryInterface,
    @Inject('uploadFileService')
    private readonly uploadService: UploadFileInterface,
  ) {}

  async execute(
    input: UpdateVariantDto,
  ): Promise<Either<Error, OutputVariantDto>> {
    const variant = await this.productVariantRepository.findById(
      input.variantId,
    );

    if (variant.isLeft()) {
      return left(variant.value);
    }

    let uploadLink = variant.value.getImageUrl();

    if (input.imageUrl) {
      const newUploadLink = await this.uploadService.uploadFile(input.imageUrl);

      if (newUploadLink.isLeft()) {
        return left(newUploadLink.value);
      }
      uploadLink = newUploadLink.value;
    }

    const attributes: ProductsAttributes[] = [];
    let variantAttributes: ProductsVariantAttributes[] =
      variant.value.getAttributes();

    if (input.attributes && input.attributes.length > 0) {
      for (const attribute of input.attributes) {
        const findAtt = await this.productAttributeRepository.findByName(
          JSON.parse(attribute.toString()).name,
        );

        if (findAtt.isLeft()) {
          return left(findAtt.value);
        }

        attributes.push(findAtt.value);
      }

      variantAttributes = input.attributes.map((attribute, index) =>
        ProductsVariantAttributes.CreateNew({
          productAttribute: attributes[index],
          productVariant: variant.value,
          value: JSON.parse(attribute.toString()).value,
        }),
      );
    }

    variant.value.Update({
      price: input.price,
      promotionalPrice: input.promotionalPrice,
      imageUrl: uploadLink,
      stockQuantity: input.stockQuantity,
    });

    variant.value.setAttributes(variantAttributes);

    const updatedVariant = await this.productVariantRepository.update(
      variant.value,
    );

    if (updatedVariant.isLeft()) {
      return left(updatedVariant.value);
    }

    return right({
      id: updatedVariant.value.getId(),
      imageUrl: updatedVariant.value.getImageUrl(),
      price: updatedVariant.value.getPrice(),
      product: {
        id: updatedVariant.value.getProduct().getId(),
        name: updatedVariant.value.getProduct().getId(),
      },
      promotionalPrice: updatedVariant.value.getPromotionalPrice(),
      sku: updatedVariant.value.getSku(),
      stockQuantity: updatedVariant.value.getStockQuantity(),
      attributes: variantAttributes.map((att) => ({
        id: att.getId(),
        value: att.getValue(),
      })),
    });
  }
}
