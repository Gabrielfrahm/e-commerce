import {
  MailServiceInterface,
  SendMailPayload,
} from '../interfaces/mail-service.interface';

import { createTransport } from 'nodemailer';

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
  });

  async sendMail(payload: SendMailPayload): Promise<void> {
    console.log('chegou aqui', process.env.MAIL_FROM);
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        ...payload,
      });
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
