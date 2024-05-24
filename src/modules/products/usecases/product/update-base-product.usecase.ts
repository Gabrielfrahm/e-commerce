import { UploadFileInterface } from '@common/interfaces/upload-file.interface';
import { BaseUseCase } from '@common/interfaces/usecases.interface';
import { Either, left, right } from '@common/utils/either';
import { OutputProductDto } from '@modules/products/dtos/product/create-product.dto';
import { UpdateProductDto } from '@modules/products/dtos/product/update-product.dto';
import { Category } from '@modules/products/entities/categories.entity';
import { CategoryRepositoryInterface } from '@modules/products/interfaces/category.repository';
import { ProductRepositoryInterface } from '@modules/products/interfaces/product.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateBaseProductUseCase
  implements BaseUseCase<UpdateProductDto, Either<Error, OutputProductDto>>
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
    input: UpdateProductDto,
  ): Promise<Either<Error, OutputProductDto>> {
    const product = await this.productRepository.findById(input.id);

    if (product.isLeft()) {
      return left(product.value);
    }

    let uploadLink = product.value.getImageUrl();
    let categoriesEntities: Category[] = product.value.getCategories();
    if (input.categories) {
      categoriesEntities = [];
      for (const categoryName of input.categories) {
        const category = await this.categoryRepository.findByName(categoryName);

        if (category.isLeft()) {
          return left(category.value);
        }

        categoriesEntities.push(category.value);
      }
    }

    if (input.imageUrl) {
      const newUploadLink = await this.uploadService.uploadFile(input.imageUrl);

      if (newUploadLink.isLeft()) {
        return left(newUploadLink.value);
      }
      uploadLink = newUploadLink.value;
    }

    product.value.Update({
      basePrice: input.basePrice,
      description: input.description,
      name: input.name,
      taxRate: input.taxRate,
      imageUrl: uploadLink,
      categories: categoriesEntities,
    });

    const productUpdate = await this.productRepository.update(product.value);

    if (productUpdate.isLeft()) {
      return left(productUpdate.value);
    }

    return right({
      id: productUpdate.value.getId(),
      basePrice: productUpdate.value.getBasePrice(),
      description: productUpdate.value.getDescription(),
      imageUrl: productUpdate.value.getImageUrl(),
      name: productUpdate.value.getName(),
      taxRate: productUpdate.value.getTaxRate(),
      categories: productUpdate.value.getCategories().map((category) => ({
        id: category.getId(),
        name: category.getName(),
      })),
    });
  }
}
