import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserRepository } from '@modules/users/repository/user.repository';
import { UserController } from './user.controller';
import { LoggingModule } from '@modules/logger/logger.module';
import { CreateClienteWithEmailUseCase } from './usecases/create-cliente-with-email.usecase';
import { CreateEmployerUseCase } from './usecases/create-employer.usecase';

@Module({
  imports: [LoggingModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: 'userRepository',
      useFactory: (prismaService: PrismaService): UserRepository =>
        new UserRepository(prismaService),
      inject: [PrismaService],
    },
    CreateClienteWithEmailUseCase,
    CreateEmployerUseCase,
  ],
  exports: ['userRepository'],
})
export class UserModule {}
