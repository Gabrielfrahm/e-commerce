import {
  BadRequestException,
  Controller,
  Inject,
  LoggerService,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCategoryUseCase } from '../usecases/category/create-category.usecase';

import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { ApiTags } from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { extname } from 'path';
import { diskStorage } from 'multer';
import { Slug } from '@common/utils/slug';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,

    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
  ) {}

  @Post('')
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImage', maxCount: 1 }], {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          return cb(
            null,
            `${Slug.createFromText(file.originalname.split('.')[0]).value}-${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== 'image/png') {
          return cb(
            new BadRequestException(
              'Invalid file type. image/png are supported.',
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  async create(
    @UploadedFiles() files: { productImage: Express.Multer.File[] },
  ): Promise<void> {
    console.log(files.productImage);
  }
}
