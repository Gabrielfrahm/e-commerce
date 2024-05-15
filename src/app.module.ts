import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/database/prisma/prisma.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { LoggingModule } from '@modules/logger/logger.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import redisConfig from '@config/redis.config';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { ProductsModel } from '@modules/products/products.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    LoggingModule,
    NotificationsModule,
    ProductsModel,
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redisConfig] })],
      useFactory: (configDatabase: ConfigType<typeof redisConfig>) => ({
        redis: {
          port: configDatabase.port,
          host: configDatabase.host,
        },
      }),
      inject: [redisConfig.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [],
})
export class AppModule {}
