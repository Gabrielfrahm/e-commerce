import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserTokenRepository } from './repository/userToken.repository';
import { AuthWithEmailAndPassword } from './usecases/auth-with-email-and-password.usecase';
import { JwtService } from './services/jwt.service';
import { CryptoService } from './services/crypto.service';
import { UserModule } from '@modules/users/user.module';
import { LoggingModule } from '@modules/logger/logger.module';

@Module({
  imports: [UserModule, LoggingModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: 'userTokenRepository',
      useFactory: (prismaService: PrismaService): UserTokenRepository =>
        new UserTokenRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: 'jwtService',
      useFactory: (): JwtService => new JwtService(),
    },
    {
      provide: 'cryptoService',
      useFactory: (): CryptoService => new CryptoService(12),
    },
    AuthWithEmailAndPassword,
  ],
  exports: ['userTokenRepository', 'jwtService', 'cryptoService'],
})
export class AuthModule {}
