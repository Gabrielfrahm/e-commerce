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

  @Process('send.email.employer')
  async sendEmailEmployer({
    data,
  }: Job<{
    email: string;
    name: string;
    code: number;
    link: string;
  }>): Promise<void> {
    const mailOptions = {
      to: `${data.email}`,
      subject: 'Email para definição de senha',
      template: 'password-creation',
      context: {
        name: data.name,
        mensagem: 'Use esse código para definir sua senha.',
        code: data.code,
        link: data.link,
      },
    };

    const result = await this.mailService.sendMail(mailOptions);
    if (result.isLeft()) {
      throw result.value;
    }

    return result.value;
  }

  @Process('send.email.client')
  async sendEmailClient({
    data,
  }: Job<{
    email: string;
  }>): Promise<void> {
    const mailOptions = {
      to: `${data.email}`,
      subject: 'Email para definição de senha',
      template: 'welcome', // nome do template sem a extensão
      context: {
        email: data.email,
        mensagem: 'Esta é uma mensagem dinâmica.',
      },
    };

    const result = await this.mailService.sendMail(mailOptions);
    if (result.isLeft()) {
      throw result.value;
    }

    return result.value;
  }
}
