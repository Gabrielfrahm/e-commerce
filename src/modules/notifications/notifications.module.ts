import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { UsersProcessor } from './queues/user.processor';

@Module({
  imports: [LoggingModule],
  controllers: [],
  providers: [UsersProcessor],
  exports: [UsersProcessor],
})
export class NotificationsModule {}
