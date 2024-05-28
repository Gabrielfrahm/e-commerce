import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { multerConfig } from '@config/multer.config';
import {
  CreateProductDto,
  OutputProductDto,
} from '../dtos/product/create-product.dto';
import { CreateBaseProductUseCase } from '../usecases/product/create-base-product.usecase';
import { FindOneBaseProduct } from '../dtos/product/find-one-base-product.dto';
import { FindOneBaseProductUseCase } from '../usecases/product/find-one-base-product.usecase';
import { UpdateBaseProductUseCase } from '../usecases/product/update-base-product.usecase';
import { UpdateProductDto } from '../dtos/product/update-product.dto';
import { DeleteBaseProductDto } from '../dtos/product/delete-product.dto';
import { DeleteBaseProductUseCase } from '../usecases/product/delete-base-product.usecase';
import {
  OutputSearchProductsDto,
  SearchProductsDto,
} from '../dtos/product/search-product.dto';
import { SearchBaseProductsUseCase } from '../usecases/product/search-base-products.usecase';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly createBaseProductUseCase: CreateBaseProductUseCase,
    private readonly findOneBaseProductUseCase: FindOneBaseProductUseCase,
    private readonly updateBaseProductUseCase: UpdateBaseProductUseCase,
    private readonly deleteBaseProductUseCase: DeleteBaseProductUseCase,
    private readonly searchBaseProductsUseCase: SearchBaseProductsUseCase,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Create a base product products.' })
  @ApiBody({
    type: CreateProductDto,
    description: 'command for create a new Base Product.',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new new Base Product successfully.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Base Product already exist.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imageUrl', maxCount: 1 }], multerConfig),
  )
  async create(
    @UploadedFiles() files: { imageUrl: Express.Multer.File[] },
    @Body() data: CreateProductDto,
  ): Promise<OutputProductDto> {
    console.log(files);
    const response = await this.createBaseProductUseCase.execute({
      ...data,
      imageUrl: files.imageUrl[0].path,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try register base product with name : ${data.name}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`create base product with name: ${data.name}`);
    return response.value;
  }

  @Get(':id')
  @Post('')
  @ApiOperation({ summary: 'Find a base product products.' })
  @ApiBody({
    type: FindOneBaseProduct,
    description: 'command for find  Base Product.',
  })
  @ApiResponse({
    status: 201,
    description: 'Find Base Product successfully.',
  })
  @ApiResponse({ status: 404, description: 'Base Product not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOneBaseProductById(
    @Param() data: FindOneBaseProduct,
  ): Promise<OutputProductDto> {
    const response = await this.findOneBaseProductUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try find base product with id : ${data.id}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`find base product with id: ${data.id}`);
    return response.value;
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imageUrl', maxCount: 1 }], multerConfig),
  )
  @ApiOperation({ summary: 'Update a base product products.' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'command for Update Base Product.',
  })
  @ApiResponse({
    status: 201,
    description: 'Update Base Product successfully.',
  })
  @ApiResponse({ status: 404, description: 'Base Product not found.' })
  @ApiResponse({ status: 409, description: 'Base Product name already exist.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateBaseProduct(
    @Param('id') id: string,
    @Body() data: Omit<UpdateProductDto, 'id'>,
    @UploadedFiles() files?: { imageUrl: Express.Multer.File[] },
  ): Promise<OutputProductDto> {
    const response = await this.updateBaseProductUseCase.execute({
      id,
      ...data,
      ...(files.imageUrl && {
        imageUrl: files.imageUrl[0].path,
      }),
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try update base product with id : ${id}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`update base product with id: ${id}`);
    return response.value;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete  a base product products.' })
  @ApiBody({
    type: DeleteBaseProductDto,
    description: 'command for Delete  Base Product.',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete Base Product successfully.',
  })
  @ApiResponse({ status: 404, description: 'Base Product not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteBaseProduct(@Param('id') id: string): Promise<void> {
    const response = await this.deleteBaseProductUseCase.execute({
      id,
    });

    if (response.isLeft()) {
      this.loggerService.error(
        `Erro when try Delete base product with id : ${id}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`Delete base product with id: ${id}`);
    return response.value;
  }

  @Get()
  @ApiOperation({ summary: 'search base Products.' })
  @ApiBody({
    type: SearchProductsDto,
    description: 'command for search base products.',
  })
  @ApiResponse({
    status: 200,
    description: 'search base Products successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer, UserRole.Client])
  async search(
    @Query() data: SearchProductsDto,
  ): Promise<OutputSearchProductsDto> {
    const response = await this.searchBaseProductsUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to search base products with params  ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to search base products with params ${JSON.stringify(data)} `,
    );

    return response.value;
  }
}
