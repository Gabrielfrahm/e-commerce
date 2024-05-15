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

@Module({
  imports: [LoggingModule, AuthModule],
  controllers: [CategoryController],
  providers: [
    PrismaService,
    {
      provide: 'categoryRepository',
      useFactory: (prismaService: PrismaService): CategoryRepository =>
        new CategoryRepository(prismaService),
      inject: [PrismaService],
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindOneCategoryUseCase,
  ],
  exports: ['categoryRepository'],
})
export class ProductsModel {}
