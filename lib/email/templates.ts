export type ReceiptEmailInput = {
  productName: string;
  orderNumber: string;
  amountPaise: number;
  downloadUrl: string;
  expiresAt: Date;
  supportEmail: string;
};

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const SUPPORTED_FALLBACK = "buildyourprojects754@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatInr(amountPaise: number): string {
  return `₹${(amountPaise / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * Receipt + delivery email. It is a receipt, not a GST tax invoice.
 */
export function receiptEmail(input: ReceiptEmailInput): EmailContent {
  const product = escapeHtml(input.productName);
  const order = escapeHtml(input.orderNumber);
  const url = escapeHtml(input.downloadUrl);
  const expires = formatDate(input.expiresAt);
  const support = escapeHtml(input.supportEmail || SUPPORTED_FALLBACK);

  const subject = `Your ${input.productName} download — ${input.orderNumber}`;

  const text = [
    `Thanks for buying ${input.productName}.`,
    "",
    `Order: ${input.orderNumber}`,
    `Amount: ${formatInr(input.amountPaise)}`,
    "",
    "Download your files:",
    input.downloadUrl,
    "",
    `This link expires on ${expires} and has a limited number of downloads.`,
    "Keep this email; the link is personal and should not be shared.",
    "",
    `Questions or a problem with the files? Reply to ${input.supportEmail || SUPPORTED_FALLBACK}.`,
    "",
    "BuildYourProjects",
    "This is a purchase receipt, not a GST tax invoice.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#f4f4f2;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#141414;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e2de;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b66;">BuildYourProjects</p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;">Your download is ready</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a4a46;">
                  Thanks for buying <strong>${product}</strong>. Your payment is confirmed.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e2de;border-bottom:1px solid #e2e2de;margin:0 0 24px;">
                  <tr>
                    <td style="padding:12px 0;font-size:14px;color:#6b6b66;">Order</td>
                    <td align="right" style="padding:12px 0;font-size:14px;font-weight:600;">${order}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;font-size:14px;color:#6b6b66;">Amount</td>
                    <td align="right" style="padding:12px 0;font-size:14px;font-weight:600;">${formatInr(input.amountPaise)}</td>
                  </tr>
                </table>
                <p style="margin:0 0 16px;">
                  <a href="${url}" style="display:inline-block;background:#141414;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-size:15px;font-weight:600;">
                    Download ${product}
                  </a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#6b6b66;">
                  This link expires on ${escapeHtml(expires)} and has a limited number of downloads.
                  Keep this email; the link is personal and should not be shared.
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#6b6b66;">
                  If the button does not work, copy this address into your browser:<br />
                  <span style="word-break:break-all;color:#141414;">${url}</span>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b6b66;">
                  Questions or a problem with the files? Reply to
                  <a href="mailto:${support}" style="color:#141414;">${support}</a>.
                </p>
                <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a8a84;">
                  BuildYourProjects · This is a purchase receipt, not a GST tax invoice.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
