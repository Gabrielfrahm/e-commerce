import { UploadFileInterface } from '@common/interfaces/upload-file.interface';
import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  CreateVariantDto,
  OutputVariantDto,
} from '@modules/products/dtos/product/variant/create-variant.dto';
import { ProductsAttributes } from '@modules/products/entities/products-attributes.entity';
import { ProductsVariantAttributes } from '@modules/products/entities/products-variant-attributes.entity';
import { ProductsVariant } from '@modules/products/entities/products-variant.entity';
import { AttributesRepositoryInterface } from '@modules/products/interfaces/attributes.repository';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { VariantRepositoryInterface } from '@modules/products/interfaces/variant.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateVariantUseCase
  implements BaseUseCase<CreateVariantDto, Either<Error, OutputVariantDto>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('productAttributeRepository')
    private readonly productAttributeRepository: AttributesRepositoryInterface,
    @Inject('productVariantRepository')
    private readonly productVariantRepository: VariantRepositoryInterface,
    @Inject('uploadFileService')
    private readonly uploadService: UploadFileInterface,
  ) {}

  async execute(
    input: CreateVariantDto,
  ): Promise<Either<Error, OutputVariantDto>> {
    const attributes: ProductsAttributes[] = [];
    for (const attribute of input.attributes) {
      const findAtt = await this.productAttributeRepository.findByName(
        JSON.parse(attribute.toString()).name,
      );

      if (findAtt.isLeft()) {
        return left(findAtt.value);
      }

      attributes.push(findAtt.value);
    }

    const product = await this.productRepository.findById(input.productId);

    if (product.isLeft()) {
      return left(product.value);
    }

    const uploadLink = await this.uploadService.uploadFile(input.imageUrl);

    if (uploadLink.isLeft()) {
      return left(uploadLink.value);
    }

    const variant = ProductsVariant.CreateNew({
      imageUrl: uploadLink.value,
      price: input.price,
      promotionalPrice: input.promotionalPrice,
      product: product.value,
      sku: input.sku,
      stockQuantity: input.stockQuantity,
    });

    const variantAttributes = input.attributes.map((attribute, index) =>
      ProductsVariantAttributes.CreateNew({
        productAttribute: attributes[index],
        productVariant: variant,
        value: JSON.parse(attribute.toString()).value,
      }),
    );

    variant.setAttributes(variantAttributes);

    const createVariant = await this.productVariantRepository.create(variant);

    if (createVariant.isLeft()) {
      return left(createVariant.value);
    }

    return right({
      id: createVariant.value.getId(),
      imageUrl: createVariant.value.getImageUrl(),
      price: createVariant.value.getPrice(),
      product: {
        id: createVariant.value.getProduct().getId(),
        name: createVariant.value.getProduct().getId(),
      },
      promotionalPrice: createVariant.value.getPromotionalPrice(),
      sku: createVariant.value.getSku(),
      stockQuantity: createVariant.value.getStockQuantity(),
      attributes: variantAttributes.map((att) => ({
        id: att.getId(),
        value: att.getValue(),
      })),
    });
  }
}
