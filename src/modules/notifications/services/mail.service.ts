import {
  MailServiceInterface,
  SendMailPayload,
} from '../interfaces/mail-service.interface';

import * as hbs from 'nodemailer-express-handlebars';

import { createTransport } from 'nodemailer';
import { handlebarsOptions } from '../templates/template-config';
import { Inject, LoggerService } from '@nestjs/common';
import { Either, left, right } from '@common/utils/either';

export class NodemailerService
  implements MailServiceInterface<SendMailPayload, void>
{
  private transporter = createTransport({
    name: process.env.MAIL_DOMAIN,
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  }).use('compile', hbs(handlebarsOptions));

  constructor(
    @Inject('WinstonLoggerService')
    private readonly loggerService: LoggerService,
  ) {}

  async sendMail(payload: SendMailPayload): Promise<Either<Error, void>> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        ...payload,
      });
      await this.loggerService.log(`sending email to ${payload.to}`);

      return right(null);
    } catch (error) {
      await this.loggerService.error(`Error sending email`, error);
      return left(error);
    }
  }
}
