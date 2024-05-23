import { UploadFileInterface } from '@common/interfaces/upload-file.interface';
import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import {
  CreateProductDto,
  OutputProductDto,
} from '@modules/products/dtos/product/create-product.dto';
import { Category } from '@modules/products/entities/categories.entity';
import { Products } from '@modules/products/entities/products.entity';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateBaseProductUseCase
  implements BaseUseCase<CreateProductDto, Either<Error, OutputProductDto>>
{
  constructor(
    @Inject('productRepository')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('categoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
    @Inject('uploadFileService')
    private readonly uploadService: UploadFileInterface,
  ) {}

  async execute(
    input: CreateProductDto,
  ): Promise<Either<Error, OutputProductDto>> {
    const categoriesEntities: Category[] = [];
    for (const categoryName of input.categories) {
      const category = await this.categoryRepository.findByName(categoryName);

      if (category.isLeft()) {
        return left(category.value);
      }

      categoriesEntities.push(category.value);
    }

    const uploadLink = await this.uploadService.uploadFile(input.imageUrl);

    if (uploadLink.isLeft()) {
      return left(uploadLink.value);
    }

    const productEntity = Products.CreateNew({
      ...input,
      categories: categoriesEntities,
      imageUrl: uploadLink.value,
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
      categories: product.value.getCategories().map((category) => ({
        id: category.getId(),
        name: category.getName(),
      })),
    });
  }
}
