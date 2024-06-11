import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchClientProductUseCase } from '../usecases/product/search-client-products.usecase';

import {
  SearchClintVariantsDto,
  OutputSearchClientVariantsDto,
} from '@modules/products/dtos/product/variant/search-client-variant.dto';
import { FindOneCategoryDto } from '@modules/products/dtos/category/find-one-category.dto';
import { OutputVariantDto } from '@modules/products/dtos/product/variant/create-variant.dto';
import { FindOneClientProductUseCase } from '../usecases/product/find-one-product.usecase';
import { AddProductCartUseCase } from '../usecases/cart/add-product-cart.usecase';
import { AddProductCartDto } from '../dtos/add-product-cart.dto';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { RemoveProductCartDto } from '../dtos/remove-product-cart.dto';
import { RemoveProductCartUseCase } from '../usecases/cart/remove-product-cart.usecase';
import {
  GetProductCartDto,
  OutputProductCartDto,
} from '../dtos/get-product-cart.dto';
import { GetProductCartUseCase } from '../usecases/cart/get-product-cart.usecase';
import { CardDto, CardOutputDto } from '../dtos/card/card.dto';
import { CreateCardUseCase } from '../usecases/card/create-card.usecase';
import { DeleteCardDto } from '../dtos/card/deleteCard.dto';
import { DeleteCardUseCase } from '../usecases/card/delete-card.usecase';
import { GetAllCardUseCase } from '../usecases/card/get-all-cards.usecase';
import { FindCardUseCase } from '../usecases/card/find-one-card.usecase';
import { FindOneCardOutputDto } from '../dtos/card/find-one-card.dto';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(
    private readonly searchClientProductUseCase: SearchClientProductUseCase,
    private readonly findOneClientProductUseCase: FindOneClientProductUseCase,

    private readonly addProductCartUseCase: AddProductCartUseCase,
    private readonly removeProductCartUseCase: RemoveProductCartUseCase,
    private readonly getProductCartUseCase: GetProductCartUseCase,

    private readonly createCardUseCase: CreateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
    private readonly getAllCardUseCase: GetAllCardUseCase,
    private readonly findCardUseCase: FindCardUseCase,

    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
  ) {}

  @Get('/products')
  @ApiOperation({ summary: 'search Client Products.' })
  @ApiBody({
    type: SearchClintVariantsDto,
    description: 'command for search Client products.',
  })
  @ApiResponse({
    status: 200,
    description: 'search Client Products successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async search(
    @Query() data: SearchClintVariantsDto,
  ): Promise<OutputSearchClientVariantsDto> {
    const response = await this.searchClientProductUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to search Client products with params  ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to search Client products with params ${JSON.stringify(data)} `,
    );

    return response.value;
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'Find  product.' })
  @ApiBody({
    type: FindOneCategoryDto,
    description: 'command for Find  product.',
  })
  @ApiResponse({
    status: 200,
    description: 'Find product successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOneVarian(@Param('id') id: string): Promise<OutputVariantDto> {
    const response = await this.findOneClientProductUseCase.execute({
      id,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try find product with id : ${id}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`find product with id : ${id}`);
    return response.value;
  }

  @Post('/cart')
  @Roles([UserRole.Client])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @ApiOperation({ summary: 'add product in cart.' })
  @ApiBody({
    type: AddProductCartDto,
    description: 'command for add product.',
  })
  @ApiResponse({
    status: 200,
    description: 'add product successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addProductCart(@Body() data: AddProductCartDto): Promise<string> {
    const response = await this.addProductCartUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try add product in cart user id : ${data.clientId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`add product in cart user id : ${data.clientId}`);
    return response.value;
  }

  @Post('/cart/remove')
  @Roles([UserRole.Client])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @ApiOperation({ summary: 'remove product in cart.' })
  @ApiBody({
    type: RemoveProductCartDto,
    description: 'command for remove product.',
  })
  @ApiResponse({
    status: 200,
    description: 'remove product successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async removeProductCart(@Body() data: RemoveProductCartDto): Promise<string> {
    const response = await this.removeProductCartUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try remove product in cart user id : ${data.clientId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`remove product in cart user id : ${data.clientId}`);
    return response.value;
  }

  @Get('cart/:clientId')
  async getCartClient(
    @Param() data: GetProductCartDto,
  ): Promise<OutputProductCartDto> {
    const response = await this.getProductCartUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try get cart user id : ${data.clientId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`get cart user id : ${data.clientId}`);
    return response.value;
  }

  @Post('card')
  async createCard(@Body() data: CardDto): Promise<CardOutputDto> {
    const response = await this.createCardUseCase.execute({
      ...data,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try create card user id : ${data.userId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`get card user id : ${data.userId}`);
    return response.value;
  }

  @Delete('card/:cardId')
  async DeleteCard(@Param() data: DeleteCardDto): Promise<void> {
    const response = await this.deleteCardUseCase.execute({
      cardId: data.cardId,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try delete card id : ${data.cardId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`delete card id : ${data.cardId}`);
    return response.value;
  }

  @Get('card/:userId')
  async getAllCard(@Param('userId') userId: string): Promise<CardDto[]> {
    const response = await this.getAllCardUseCase.execute(userId);

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try get all card id : ${userId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`get card id : ${userId}`);
    return response.value;
  }

  @Get('card/find/:cardId')
  async findOneCard(
    @Param('userId') cardId: string,
  ): Promise<FindOneCardOutputDto> {
    const response = await this.findCardUseCase.execute({
      cardId: cardId,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try find one card id : ${cardId}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`get find one card id : ${cardId}`);

    return response.value;
  }
}
