import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('usersQueue')
export class UsersProcessor {
  @Process('user.email.send')
  async sendEmail({ data }: Job): Promise<void> {
    console.log(data);
    console.log('enviando email');
  }
}
