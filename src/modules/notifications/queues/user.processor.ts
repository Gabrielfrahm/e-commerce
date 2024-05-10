import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import {
  MailServiceInterface,
  SendMailPayload,
} from '../interfaces/mail-service.interface';

@Processor('usersQueue')
export class UsersProcessor {
  constructor(
    @Inject('mailService')
    private readonly mailService: MailServiceInterface<SendMailPayload, void>,
  ) {}

  @Process('user.email.send')
  async sendEmail({ data }: Job<string>): Promise<void> {
    console.log(data);
    await this.mailService.sendMail({
      to: data,
      subject: 'Email para definição de senha',
      text: 'Definição de senha',
      html: `test`,
    });
  }
}
