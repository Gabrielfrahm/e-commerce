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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandUpdateCategoryDto } from '../dtos/category/update-category.dto';
import { UpdateCategoryUseCase } from '../usecases/category/update-category.usecase';
import { DeleteCategoryDto } from '../dtos/category/delete-category.dto';
import { DeleteCategoryUseCase } from '../usecases/category/delete-category.usecase';
import { FindOneCategoryUseCase } from '../usecases/category/find-one-category.usecase';
import { FindOneCategoryDto } from '../dtos/category/find-one-category.dto';
import { SearchCategoriesUseCase } from '../usecases/category/search-categories.usecase';
import {
  OutputSearchCategoriesDto,
  SearchCategoriesDto,
} from '../dtos/category/search-categories.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly findOneCategoryUseCase: FindOneCategoryUseCase,
    private readonly searchCategoriesUseCase: SearchCategoriesUseCase,

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

  @Delete(':id')
  @ApiOperation({ summary: 'delete Category for products.' })
  @ApiBody({
    type: DeleteCategoryDto,
    description: 'command for delete Category.',
  })
  @ApiResponse({
    status: 201,
    description: 'delete Category successfully.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async delete(@Param() id: DeleteCategoryDto): Promise<void> {
    const response = await this.deleteCategoryUseCase.execute(id);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to delete category with id ${id.id}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to delete category with id ${id.id} `,
    );

    return response.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'delete Category for products.' })
  @ApiBody({
    type: FindOneCategoryDto,
    description: 'command for delete Category.',
  })
  @ApiResponse({
    status: 201,
    description: 'find Category successfully.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer, UserRole.Client])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async get(@Param() id: FindOneCategoryDto): Promise<OutputCategoryDto> {
    const response = await this.findOneCategoryUseCase.execute(id);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to find category with id ${id.id}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to find category with id ${id.id} `,
    );

    return response.value;
  }

  @Get()
  @ApiOperation({ summary: 'search Categories for products.' })
  @ApiBody({
    type: SearchCategoriesDto,
    description: 'command for delete Category.',
  })
  @ApiResponse({
    status: 200,
    description: 'find Categories successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles([UserRole.Admin, UserRole.Employer, UserRole.Client])
  async search(
    @Query() data: SearchCategoriesDto,
  ): Promise<OutputSearchCategoriesDto> {
    const response = await this.searchCategoriesUseCase.execute(data);

    if (response.isLeft()) {
      await this.loggerService.error(
        `fail to search category with params  ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    await this.loggerService.log(
      `successfully to search category with params ${JSON.stringify(data)} `,
    );

    return response.value;
  }
}
