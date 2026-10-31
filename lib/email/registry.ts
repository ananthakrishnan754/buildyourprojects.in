import { getFromAddress } from "@/lib/config";
import type { Mailer } from "@/lib/email/mailer";
import { ResendMailer } from "@/lib/email/resend";
import { SmtpMailer } from "@/lib/email/smtp";

function read(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

export type MailerSelection = {
  mailer: Mailer | null;
  reason: string;
  missing: string[];
};

/**
 * Picks the first fully configured transport. Resend wins over SMTP so a
 * halfway migration never sends from the wrong account by accident.
 */
export function selectMailer(
  env: NodeJS.ProcessEnv = process.env,
): MailerSelection {
  const from = getFromAddress(env);
  const resendKey = read(env, "RESEND_API_KEY");
  const smtpHost = read(env, "SMTP_HOST");
  const smtpPort = Number(read(env, "SMTP_PORT") ?? "587");
  const smtpUser = read(env, "SMTP_USER");
  const smtpPass = read(env, "SMTP_PASS");

  if (!from) {
    return {
      mailer: null,
      reason: "MAIL_FROM is not set",
      missing: ["MAIL_FROM"],
    };
  }

  if (resendKey) {
    return {
      mailer: new ResendMailer({ apiKey: resendKey, from }),
      reason: "Resend",
      missing: [],
    };
  }

  const smtpMissing: string[] = [];
  if (!smtpHost) smtpMissing.push("SMTP_HOST");
  if (!smtpUser) smtpMissing.push("SMTP_USER");
  if (!smtpPass) smtpMissing.push("SMTP_PASS");

  if (smtpHost && smtpUser && smtpPass) {
    if (!Number.isInteger(smtpPort) || smtpPort <= 0 || smtpPort > 65535) {
      return {
        mailer: null,
        reason: "SMTP_PORT is invalid",
        missing: ["SMTP_PORT"],
      };
    }

    return {
      mailer: new SmtpMailer({
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        pass: smtpPass,
        from,
      }),
      reason: "SMTP",
      missing: [],
    };
  }

  return {
    mailer: null,
    reason: `No mailer configured (missing ${smtpMissing.join(", ")})`,
    missing: ["RESEND_API_KEY", ...smtpMissing],
  };
}

export function getMailer(): Mailer | null {
  return selectMailer().mailer;
}
