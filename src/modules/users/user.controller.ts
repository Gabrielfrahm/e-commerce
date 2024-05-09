import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCommandClientDto,
  CreateOutputClientDto,
} from './dtos/create-client.dto';
import { CreateClienteWithEmailUseCase } from './usecases/create-cliente-with-email.usecase';
import { CreateEmployerUseCase } from './usecases/create-employer.usecase';
import {
  CreateEmployerDto,
  CreateOutputEmployerDto,
} from './dtos/create-employer.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly createClienteWithEmailUseCase: CreateClienteWithEmailUseCase,
    private readonly createEmployerUseCase: CreateEmployerUseCase,
  ) {}

  @Post('/client')
  @ApiOperation({ summary: 'Create User client.' })
  @ApiBody({
    type: CreateCommandClientDto,
    description: 'email client.',
  })
  @ApiResponse({
    status: 201,
    description: 'created client successfully.',
    type: CreateOutputClientDto,
  })
  @ApiResponse({ status: 403, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createClient(
    @Body() data: CreateCommandClientDto,
  ): Promise<CreateOutputClientDto> {
    const response = await this.createClienteWithEmailUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(`Creation failed client`, response.value.stack);
      throw response.value;
    }

    this.loggerService.log(`Creation successfully client: ${data.email}`);
    return response.value;
  }

  @Post('/employer')
  @ApiOperation({ summary: 'Create User Employer.' })
  @ApiBody({
    type: CreateEmployerDto,
    description: 'email Employer.',
  })
  @ApiResponse({
    status: 201,
    description: 'created Employer successfully.',
    type: CreateOutputEmployerDto,
  })
  @ApiResponse({ status: 403, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createEmployer(
    @Body() data: CreateEmployerDto,
  ): Promise<CreateOutputEmployerDto> {
    const response = await this.createEmployerUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Creation failed Employer`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`Creation successfully Employer: ${data.email}`);
    return response.value;
  }
}
