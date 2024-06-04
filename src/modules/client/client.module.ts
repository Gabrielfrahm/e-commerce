import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { ClientController } from './controllers/client.controller';
import { SearchClientProductUseCase } from './usecases/product/search-client-products.usecase';
import { ProductsModel } from '@modules/products/products.module';
import { FindOneClientProductUseCase } from './usecases/product/find-one-product.usecase';

@Module({
  imports: [LoggingModule, ProductsModel],
  controllers: [ClientController],
  providers: [SearchClientProductUseCase, FindOneClientProductUseCase],
  exports: [],
})
export class ClientModulo {}
