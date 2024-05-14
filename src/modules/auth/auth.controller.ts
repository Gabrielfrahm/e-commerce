import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthWithEmailAndPassword } from './usecases/auth-with-email-and-password.usecase';
import { CreateCommandAuthDto, OutputAuthDto } from './dtos/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthWithEmail } from './usecases/auth-with-email.usecase';
import {
  CreateClientCommandAuthDto,
  CreateClientOutputAuthDto,
} from './dtos/auth-client.dto';
import { AuthenticationGuard } from './middlewares/authenticate.guard';
import { Roles } from './decorators/role.decorator';
import { RolesGuard } from './middlewares/role.guard';
import { UserRole } from './middlewares/roles.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly authWithEmailAndPasswordUseCase: AuthWithEmailAndPassword,
    private readonly authWithEmailUseCase: AuthWithEmail,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiBody({
    type: CreateCommandAuthDto,
    description: 'Authentication credentials.',
  })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: OutputAuthDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with email.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async authWithEmailAndPassword(
    @Body() data: CreateCommandAuthDto,
  ): Promise<OutputAuthDto> {
    const response = await this.authWithEmailAndPasswordUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Authentication failed for user: ${data.email}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`User authenticated successfully: ${data.email}`);
    return response.value;
  }

  @Post('/client')
  @ApiOperation({ summary: 'Authenticate with email' })
  @ApiBody({
    type: CreateClientCommandAuthDto,
    description: 'Authentication emails.',
  })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: CreateClientOutputAuthDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with email.',
  })
  @ApiResponse({
    status: 401,
    description: 'not allowed.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async authWithEmail(
    @Body() data: CreateClientCommandAuthDto,
  ): Promise<CreateClientOutputAuthDto> {
    const response = await this.authWithEmailUseCase.execute(data);

    if (response.isLeft()) {
      this.loggerService.error(
        `Authentication failed for user client: ${data.email}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`User authenticated successfully: ${data.email}`);
    return response.value;
  }

  @Get()
  @Roles([UserRole.Admin, UserRole.Employer])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async test(): Promise<string> {
    return 'ok';
  }
}
