import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { ClientController } from './controllers/client.controller';
import { SearchClientProductUseCase } from './usecases/product/search-client-products.usecase';
import { ProductsModel } from '@modules/products/products.module';
import { FindOneClientProductUseCase } from './usecases/product/find-one-product.usecase';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { CartRepository } from './repository/cart.repository';
import { AddProductCartUseCase } from './usecases/cart/add-product-cart.usecase';
import { AuthModule } from '@modules/auth/auth.module';
import { RemoveProductCartUseCase } from './usecases/cart/remove-product-cart.usecase';
import { GetProductCartUseCase } from './usecases/cart/get-product-cart.usecase';

@Module({
  imports: [LoggingModule, ProductsModel, AuthModule],
  controllers: [ClientController],
  providers: [
    PrismaService,
    {
      provide: 'cartRepository',
      useFactory: (prismaService: PrismaService): CartRepository =>
        new CartRepository(prismaService),
      inject: [PrismaService],
    },
    SearchClientProductUseCase,
    FindOneClientProductUseCase,
    AddProductCartUseCase,
    RemoveProductCartUseCase,
    GetProductCartUseCase,
  ],
  exports: ['cartRepository'],
})
export class ClientModulo {}
