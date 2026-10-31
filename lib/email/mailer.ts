export type MailAddress = string;

export type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
};

export type MailResult = {
  messageId?: string;
};

export interface Mailer {
  readonly id: string;
  send(input: MailInput): Promise<MailResult>;
}
