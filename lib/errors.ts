export type AppErrorCode =
  | "bad_request"
  | "invalid_email"
  | "unknown_product"
  | "price_mismatch"
  | "payments_not_configured"
  | "storage_not_configured"
  | "delivery_not_configured"
  | "deliverable_not_published"
  | "invalid_signature"
  | "not_found"
  | "rate_limited"
  | "download_expired"
  | "download_exhausted"
  | "gateway_error"
  | "internal_error";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: AppErrorCode,
    status: number,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class PaymentConfigError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("payments_not_configured", 503, message, details);
    this.name = "PaymentConfigError";
  }
}

export class StorageConfigError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("storage_not_configured", 503, message, details);
    this.name = "StorageConfigError";
  }
}

export class SignatureError extends AppError {
  constructor(message = "Webhook signature verification failed") {
    super("invalid_signature", 401, message);
    this.name = "SignatureError";
  }
}
