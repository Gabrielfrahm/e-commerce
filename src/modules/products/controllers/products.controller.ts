import {
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

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
  ) {}

  @Post('')
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'productImage', maxCount: 1 }],
      multerConfig,
    ),
  )
  async create(
    @UploadedFiles() files: { productImage: Express.Multer.File[] },
  ): Promise<void> {
    console.log(files.productImage);
  }
}
