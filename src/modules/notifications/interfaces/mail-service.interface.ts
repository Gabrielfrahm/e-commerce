export interface MailServiceInterface<P, T> {
  sendMail(payload: P): Promise<T>;
}

export interface SendMailPayload {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
