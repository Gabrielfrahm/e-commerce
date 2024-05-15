import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryUseCase } from '../usecases/category/create-category.usecase';
import {
  CommandCreateCategoryDto,
  OutputCategoryDto,
} from '../dtos/category/category.dto';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/auth/middlewares/roles.enum';
import { AuthenticationGuard } from '@modules/auth/middlewares/authenticate.guard';
import { RolesGuard } from '@modules/auth/middlewares/role.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandUpdateCategoryDto } from '../dtos/category/update-category.dto';
import { UpdateCategoryUseCase } from '../usecases/category/update-category.usecase';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,

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

  @Patch(':id')
  @ApiOperation({ summary: 'updated Category for products.' })
  @ApiBody({
    type: CommandUpdateCategoryDto,
    description: 'command for updated Category.',
  })
  @ApiResponse({
    status: 201,
    description: 'updated Category successfully.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category already exist.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async update(
    @Body() data: Omit<CommandUpdateCategoryDto, 'id'>,
    @Param('id') id: string,
  ): Promise<OutputCategoryDto> {
    const response = await this.updateCategoryUseCase.execute({
      id,
      ...data,
    });

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to update category with name ${data.name}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to update category with name ${data.name} `,
    );
    return response.value;
  }
}
