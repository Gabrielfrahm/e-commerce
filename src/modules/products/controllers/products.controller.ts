import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
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

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly createBaseProductUseCase: CreateBaseProductUseCase,
    private readonly findOneBaseProductUseCase: FindOneBaseProductUseCase,
    private readonly updateBaseProductUseCase: UpdateBaseProductUseCase,
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
}
