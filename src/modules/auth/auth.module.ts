import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserTokenRepository } from './repository/userToken.repository';
import { AuthWithEmailAndPassword } from './usecases/auth-with-email-and-password.usecase';
import { JwtService } from './services/jwt.service';
import { CryptoService } from './services/crypto.service';
import { UserModule } from '@modules/users/user.module';
import { LoggingModule } from '@modules/logger/logger.module';
import { AuthWithEmail } from './usecases/auth-with-email.usecase';
import { AuthenticationGuard } from './middlewares/authenticate.guard';
import { RolesGuard } from './middlewares/role.guard';

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
    {
      provide: AuthenticationGuard,
      useFactory: (jwtService: JwtService): AuthenticationGuard =>
        new AuthenticationGuard(jwtService),
      inject: ['jwtService'],
    },
    {
      provide: RolesGuard,
      useClass: RolesGuard,
    },
    AuthWithEmailAndPassword,
    AuthWithEmail,
  ],
  exports: [
    'userTokenRepository',
    'jwtService',
    'cryptoService',
    AuthenticationGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
