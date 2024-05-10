import { Either } from '@common/utils/either';

export interface MailServiceInterface<P, T> {
  sendMail(payload: P): Promise<Either<Error, T>>;
}

export interface SendMailPayload {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
