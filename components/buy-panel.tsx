"use client";

import { useEffect, useRef, useState } from "react";

type PaymentConfig = {
  enabled: boolean;
  payments: { provider: string | null; testMode: boolean; reason: string };
};

type CheckoutSession = {
  orderNumber: string;
  provider: string;
  providerOrderId: string;
  amountPaise: number;
  currency: "INR";
  keyId?: string;
  product: { slug: string; name: string };
  prefill: { email: string; name?: string };
  idempotent: boolean;
};

let razorpayLoader: Promise<void> | null = null;

function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No browser"));
  if (window.Razorpay) return Promise.resolve();
  if (razorpayLoader) return razorpayLoader;

  razorpayLoader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayLoader = null;
      script.remove();
      reject(new Error("Could not load the payment form. Check your connection."));
    };
    document.body.appendChild(script);
  });

  return razorpayLoader;
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string };
    };
    return body.error?.message ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export type BuyPanelProps = {
  product: { slug: string; name: string; price: number };
  compact?: boolean;
};

export function BuyPanel({ product, compact = false }: BuyPanelProps) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/payments/config", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: PaymentConfig | null) => {
        if (body) setConfig(body);
      })
      .catch(() => {
        if (!controller.signal.aborted) setConfig(null);
      });

    return () => controller.abort();
  }, []);

  const enabled = config?.enabled === true;

  if (compact) {
    return (
      <button
        type="button"
        disabled={!enabled}
        className="btn btn-primary shrink-0"
        onClick={() => {
          document
            .getElementById("buy-panel")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      >
        {enabled ? "Buy now" : "Coming soon"}
      </button>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address so we can send your receipt and download link.");
      return;
    }

    setSubmitting(true);

    if (!idempotencyKey.current) {
      idempotencyKey.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `byp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": idempotencyKey.current,
        },
        body: JSON.stringify({
          productSlug: product.slug,
          email: email.trim(),
          name: name.trim() || undefined,
          pricePaise: product.price * 100,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const session = (await response.json()) as CheckoutSession;

      if (session.provider === "stub") {
        const stubResponse = await fetch("/api/dev/stub-pay", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            orderNumber: session.orderNumber,
            providerOrderId: session.providerOrderId,
            amountPaise: session.amountPaise,
          }),
        });

        if (!stubResponse.ok) {
          throw new Error(await readError(stubResponse));
        }

        const outcome = (await stubResponse.json()) as { emailStatus?: string };
        setSuccess(
          outcome.emailStatus === "sent"
            ? `Test payment recorded. The receipt and download link were sent to ${email.trim()}.`
            : `Test payment recorded. Your download link was created, but the receipt email is ${outcome.emailStatus ?? "queued"} — check the database or configure a mailer.`,
        );
        idempotencyKey.current = null;
        return;
      }

      if (!session.keyId) {
        throw new Error("The payment provider did not return a public key.");
      }

      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error("The payment form did not load. Try again.");
      }

      const checkout = new window.Razorpay({
        key: session.keyId,
        amount: session.amountPaise,
        currency: session.currency,
        name: "BuildYourProjects",
        description: session.product.name,
        order_id: session.providerOrderId,
        prefill: session.prefill,
        notes: { orderNumber: session.orderNumber },
        theme: { color: "#141414" },
        handler: () => {
          setSuccess(
            `Payment received. A receipt and your download link are on the way to ${email.trim()} — check spam if it does not arrive in a few minutes.`,
          );
          setSubmitting(false);
          idempotencyKey.current = null;
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      checkout.on("payment.failed", () => {
        setError("The payment did not go through. No money was taken; try another method.");
        setSubmitting(false);
      });

      checkout.open();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div id="buy-panel" className="rounded-lg border border-stroke bg-surface p-5">
      {!enabled ? (
        <>
          <button type="button" disabled className="btn btn-primary w-full">
            Buy now — coming soon
          </button>
          <p className="mt-3 type-body-sm text-muted">
            Checkout is not live yet. Payments and digital delivery are being
            tested against Razorpay test mode before the button is enabled.
          </p>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between gap-3">
            <p className="type-label text-muted">Secure checkout</p>
            <span className="chip">
              {config?.payments.testMode ? "Test mode" : "Live"}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            <div>
              <label htmlFor="buy-email" className="type-label text-muted">
                Email for the receipt and download link
              </label>
              <input
                id="buy-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field mt-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@college.edu"
                required
              />
            </div>
            <div>
              <label htmlFor="buy-name" className="type-label text-muted">
                Name <span className="font-normal">(optional)</span>
              </label>
              <input
                id="buy-name"
                name="name"
                autoComplete="name"
                className="field mt-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary mt-4 w-full"
          >
            {submitting
              ? "Opening checkout…"
              : `Buy now — ₹${product.price.toLocaleString("en-IN")}`}
          </button>

          {error ? (
            <p className="mt-3 type-body-sm" role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="mt-3 type-body-sm text-muted" role="status">
              {success}
            </p>
          ) : null}

          <p className="mt-3 type-body-sm text-muted">
            By paying you agree to the{" "}
            <a href="/terms" className="font-semibold text-accent hover:underline">
              terms
            </a>{" "}
            and{" "}
            <a href="/refund" className="font-semibold text-accent hover:underline">
              refund policy
            </a>
            . Test mode takes no real money.
          </p>
        </form>
      )}
    </div>
  );
}
