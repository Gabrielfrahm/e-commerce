import { AuthModule } from '@modules/auth/auth.module';
import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/categories.controller';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryUseCase } from './usecases/category/create-category.usecase';
import { UpdateCategoryUseCase } from './usecases/category/update-category.usecase';
import { DeleteCategoryUseCase } from './usecases/category/delete-category.usecase';
import { FindOneCategoryUseCase } from './usecases/category/find-one-category.usecase';
import { SearchCategoriesUseCase } from './usecases/category/search-categories.usecase';
import { ProductsController } from './controllers/products.controller';
import { CreateBaseProductUseCase } from './usecases/product/create-base-product.usecase';
import { ProductRepository } from './repositories/product.repository';
import { FindOneBaseProductUseCase } from './usecases/product/find-one-base-product.usecase';
import { UploadFileInterface } from '@common/interfaces/upload-file.interface';
import { FreeImageService } from '@common/services/freeImage.service';
import { UpdateBaseProductUseCase } from './usecases/product/update-base-product.usecase';
import { DeleteBaseProductUseCase } from './usecases/product/delete-base-product.usecase';
import { SearchBaseProductsUseCase } from './usecases/product/search-base-products.usecase';
import { CreateVariantUseCase } from './usecases/product/variant/create-variant.usecase';
import { AttributesRepository } from './repositories/attributes.repository';
import { VariantRepository } from './repositories/variant.repository';
import { UpdateVariantUseCase } from './usecases/product/variant/update-variant.usecase';

@Module({
  imports: [LoggingModule, AuthModule],
  controllers: [CategoryController, ProductsController],
  providers: [
    PrismaService,
    {
      provide: 'categoryRepository',
      useFactory: (prismaService: PrismaService): CategoryRepository =>
        new CategoryRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'productRepository',
      useFactory: (prismaService: PrismaService): ProductRepository =>
        new ProductRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'productAttributeRepository',
      useFactory: (prismaService: PrismaService): AttributesRepository =>
        new AttributesRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'productVariantRepository',
      useFactory: (prismaService: PrismaService): VariantRepository =>
        new VariantRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'uploadFileService',
      useFactory: (): UploadFileInterface => new FreeImageService(),
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindOneCategoryUseCase,
    SearchCategoriesUseCase,
    CreateBaseProductUseCase,
    FindOneBaseProductUseCase,
    UpdateBaseProductUseCase,
    DeleteBaseProductUseCase,
    SearchBaseProductsUseCase,
    CreateVariantUseCase,
    UpdateVariantUseCase,
  ],
  exports: [
    'categoryRepository',
    'productRepository',
    'productAttributeRepository',
    'productVariantRepository',
  ],
})
export class ProductsModel {}
