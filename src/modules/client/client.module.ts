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
import { CardRepository } from './repository/card.repository';
import { CreateCardUseCase } from './usecases/card/create-card.usecase';
import { DeleteCardUseCase } from './usecases/card/delete-card.usecase';
import { GetAllCardUseCase } from './usecases/card/get-all-cards.usecase';
import { FindCardUseCase } from './usecases/card/find-one-card.usecase';
import { UpdateCardUseCase } from './usecases/card/update-card.usecase';

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
    {
      provide: 'cardRepository',
      useFactory: (prismaService: PrismaService): CardRepository =>
        new CardRepository(prismaService),
      inject: [PrismaService],
    },
    SearchClientProductUseCase,
    FindOneClientProductUseCase,
    AddProductCartUseCase,
    RemoveProductCartUseCase,
    GetProductCartUseCase,
    CreateCardUseCase,
    DeleteCardUseCase,
    GetAllCardUseCase,
    FindCardUseCase,
    UpdateCardUseCase,
  ],
  exports: ['cartRepository', 'cardRepository'],
})
export class ClientModulo {}
