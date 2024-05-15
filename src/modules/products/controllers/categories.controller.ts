import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryUseCase } from '../usecases/category/create-category.usecase';
import {
  CommandCreateCategoryDto,
  OutputCategoryDto,
} from '../dtos/category.dto';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new Category for products.' })
  @ApiBody({
    type: CommandCreateCategoryDto,
    description: 'command for create a new Category.',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new Category successfully.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category already exist.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async create(
    @Body() data: CommandCreateCategoryDto,
  ): Promise<OutputCategoryDto> {
    const response = await this.createCategoryUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to create a new category with name ${data.name}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to create a new category with name ${data.name} `,
    );
    return response.value;
  }
}
