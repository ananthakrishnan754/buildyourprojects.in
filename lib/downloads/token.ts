import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type DownloadTokenPayload = {
  /** Download row id. */
  d: string;
  /** Order id. */
  o: string;
  /** Expiry, unix seconds. */
  e: number;
};

export type DownloadTokenResult =
  | { valid: true; payload: DownloadTokenPayload }
  | { valid: false; reason: string };

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string): Buffer | null {
  if (!/^[A-Za-z0-9_-]+$/.test(input)) return null;

  try {
    return Buffer.from(input, "base64url");
  } catch {
    return null;
  }
}

function signatureFor(encodedPayload: string, secret: string): string {
  return base64Url(createHmac("sha256", secret).update(encodedPayload, "utf8").digest());
}

export type SignDownloadTokenInput = {
  downloadId: string;
  orderId: string;
  expiresAt: Date;
  secret: string;
};

/**
 * Issues a compact, HMAC-signed download token. The token is a bearer secret:
 * only its SHA-256 hash is stored in the database.
 */
export function signDownloadToken(input: SignDownloadTokenInput): string {
  if (!input.secret) throw new Error("A download token secret is required");
  if (!input.downloadId || !input.orderId) {
    throw new Error("downloadId and orderId are required");
  }

  const expiry = Math.floor(input.expiresAt.getTime() / 1000);

  if (!Number.isFinite(expiry) || expiry <= 0) {
    throw new Error("expiresAt must be a valid future date");
  }

  const payload: DownloadTokenPayload = {
    d: input.downloadId,
    o: input.orderId,
    e: expiry,
  };

  const encodedPayload = base64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signatureFor(encodedPayload, input.secret)}`;
}

export function verifyDownloadToken(
  token: string,
  secret: string,
  now: Date = new Date(),
): DownloadTokenResult {
  if (!secret) return { valid: false, reason: "Download token secret is not configured" };

  const parts = token.split(".");

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, reason: "Malformed download token" };
  }

  const [encodedPayload, providedSignature] = parts as [string, string];
  const expectedSignature = signatureFor(encodedPayload, secret);

  const expected = Buffer.from(expectedSignature, "utf8");
  const provided = Buffer.from(providedSignature, "utf8");

  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return { valid: false, reason: "Invalid download token signature" };
  }

  const decoded = fromBase64Url(encodedPayload);

  if (!decoded) return { valid: false, reason: "Malformed download token payload" };

  let payload: unknown;

  try {
    payload = JSON.parse(decoded.toString("utf8"));
  } catch {
    return { valid: false, reason: "Malformed download token payload" };
  }

  if (!payload || typeof payload !== "object") {
    return { valid: false, reason: "Malformed download token payload" };
  }

  const candidate = payload as Partial<DownloadTokenPayload>;

  if (
    typeof candidate.d !== "string" ||
    typeof candidate.o !== "string" ||
    !Number.isInteger(candidate.e)
  ) {
    return { valid: false, reason: "Malformed download token payload" };
  }

  if ((candidate.e as number) * 1000 <= now.getTime()) {
    return { valid: false, reason: "Download token has expired" };
  }

  return {
    valid: true,
    payload: { d: candidate.d, o: candidate.o, e: candidate.e as number },
  };
}

export function hashDownloadToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
