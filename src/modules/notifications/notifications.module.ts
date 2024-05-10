import { LoggingModule } from '@modules/logger/logger.module';
import { Module } from '@nestjs/common';
import { UsersProcessor } from './queues/user.processor';
import { NodemailerService } from './services/mail.service';

@Module({
  imports: [LoggingModule],
  controllers: [],
  providers: [
    {
      provide: 'mailService',
      useFactory: (): NodemailerService => new NodemailerService(),
    },
    {
      provide: UsersProcessor,
      useFactory: (nodemailerService: NodemailerService): UsersProcessor =>
        new UsersProcessor(nodemailerService),
      inject: ['mailService'],
    },
  ],
  exports: [UsersProcessor, 'mailService'],
})
export class NotificationsModule {}
