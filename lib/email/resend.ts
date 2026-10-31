import type { MailInput, MailResult, Mailer } from "@/lib/email/mailer";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type ResendOptions = {
  apiKey: string;
  from: string;
  fetchImpl?: typeof fetch;
};

export class ResendMailer implements Mailer {
  readonly id = "resend";

  private readonly apiKey: string;
  private readonly from: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ResendOptions) {
    this.apiKey = options.apiKey;
    this.from = options.from;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async send(input: MailInput): Promise<MailResult> {
    const response = await this.fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: input.from ?? this.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      cache: "no-store",
    });

    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok || !body.id) {
      throw new Error(
        `Resend rejected the email (${response.status})${body.message ? `: ${body.message}` : ""}`,
      );
    }

    return { messageId: body.id };
  }
}
