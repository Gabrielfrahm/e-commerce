import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { AuthWithEmailAndPassword } from './usecases/auth-with-email-and-password.usecase';
import { CreateCommandAuthDto, OutputAuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
    private readonly authWithEmailAndPasswordUseCase: AuthWithEmailAndPassword,
  ) {}

  @Post('')
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
}
