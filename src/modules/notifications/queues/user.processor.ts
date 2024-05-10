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

  @Process('send.email')
  async sendEmail({
    data,
  }: Job<{
    email: string;
    name: string;
  }>): Promise<void> {
    const mailOptions = {
      to: `${data.email}`,
      subject: 'Email para definição de senha',
      template: 'password-creation', // nome do template sem a extensão
      context: {
        email: data.name,
        mensagem: 'Esta é uma mensagem dinâmica.',
      },
    };

    await this.mailService.sendMail(mailOptions);
  }
}
