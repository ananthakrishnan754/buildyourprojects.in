import type { MailInput, MailResult, Mailer } from "@/lib/email/mailer";

export type SmtpOptions = {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
  secure?: boolean;
};

export class SmtpMailer implements Mailer {
  readonly id = "smtp";

  constructor(private readonly options: SmtpOptions) {}

  async send(input: MailInput): Promise<MailResult> {
    const nodemailer = await import("nodemailer");

    const transport = nodemailer.createTransport({
      host: this.options.host,
      port: this.options.port,
      secure: this.options.secure ?? this.options.port === 465,
      ...(this.options.user
        ? {
            auth: {
              user: this.options.user,
              pass: this.options.pass ?? "",
            },
          }
        : {}),
    });

    try {
      const info = await transport.sendMail({
        from: input.from ?? this.options.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });

      return { messageId: info.messageId };
    } finally {
      transport.close();
    }
  }
}
