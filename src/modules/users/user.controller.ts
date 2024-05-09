import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCommandClientDto,
  CreateOutputClientDto,
} from './dtos/create-client.dto';
import { CreateClienteWithEmailUseCase } from './usecases/create-cliente-with-email.usecase';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly createClienteWithEmailUseCase: CreateClienteWithEmailUseCase,
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
}
