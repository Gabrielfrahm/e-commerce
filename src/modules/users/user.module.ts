import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserRepository } from '@modules/users/repository/user.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: 'userRepository',
      useFactory: (prismaService: PrismaService): UserRepository =>
        new UserRepository(prismaService),
      inject: [PrismaService],
    },
  ],
  exports: ['userRepository'],
})
export class UserModule {}
