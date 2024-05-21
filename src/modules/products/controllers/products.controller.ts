import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { ApiTags } from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { multerConfig } from '@config/multer.config';
import {
  CreateProductDto,
  OutputProductDto,
} from '../dtos/product/create-product.dto';
import { CreateBaseProductUseCase } from '../usecases/product/create-base-product.usecase';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly createBaseProductUseCase: CreateBaseProductUseCase,
  ) {}

  @Post('')
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imageUrl', maxCount: 1 }], multerConfig),
  )
  async create(
    @UploadedFiles() files: { imageUrl: Express.Multer.File[] },
    @Body() data: CreateProductDto,
  ): Promise<OutputProductDto> {
    const response = await this.createBaseProductUseCase.execute({
      ...data,
      imageUrl: `${process.env.BASE_URL}/${files.imageUrl[0].path}`,
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
}
