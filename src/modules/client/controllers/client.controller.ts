import {
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Query,
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

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(
    private readonly searchClientProductUseCase: SearchClientProductUseCase,
    private readonly findOneClientProductUseCase: FindOneClientProductUseCase,

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
}
