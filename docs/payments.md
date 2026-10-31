# Phase 4 — Payments, Orders and Fulfilment

**Status:** implemented against the Razorpay **test mode** API; blocked on owner
keys. No live payment can be taken by this code.

Sources of truth: `docs/BRIEF.md` §5, `docs/DECISIONS.md` §1, §2 and §7.

---

## 1. Decision (short version)

Use **Razorpay direct, behind a `PAYMENTS_PROVIDER` flag**, for v1.

- Razorpay is the processor the owner already has an account with. Adding a
  payment switch in front of it adds an account, a second integration and a
  second failure surface without adding a payment method students need.
- The storefront sells three low-priced digital products (₹149 / ₹299 / ₹499) to
  Indian students. The required rails are INR, UPI and cards. Razorpay covers
  all three out of the box.
- The site is a Next.js app on Vercel. Razorpay's hosted checkout plus one
  serverless webhook is the smallest reliable integration; no long-running
  service, no container, no extra host.
- Hyperswitch self-hosting is explicitly out of scope (`DECISIONS.md` §1) and
  would cost more per month in hosting/ops than the entire expected v1 payment
  fee.
- The provider interface (`lib/payments/provider.ts`) keeps Cashfree or
  Hyperswitch a later swap, not a rewrite.

**Never enable live mode in this phase.** The Razorpay adapter refuses keys that
look live (`rzp_live_…`). The stub provider is refused when
`NODE_ENV=production`.

---

## 2. Comparison

Scores are 1–5 (5 = best) for a **solo seller in India selling digital study
aids**, not for a marketplace or a company with a payments team. Pricing is list
pricing observed in 2026 and must be re-checked at signup; UPI merchant pricing
and platform fees change.

| Option | INR + UPI + cards | Solo-seller onboarding | Hosting cost | Vercel serverless webhook fit | Operational burden | Total |
|---|---|---|---|---|---|---|
| **Razorpay direct** | **5** — UPI, cards, netbanking, wallets in one checkout | **4** — one KYC, test keys immediately | **5** — no extra host; fee per transaction only | **5** — one HTTPS endpoint, HMAC header, retries | **4** — dashboard, webhook logs, refunds UI | **23** |
| Hyperswitch Cloud | 4 — depends on which connectors are enabled; UPI/cards supported | 2 — switch account **plus** processor account/KYC, connector config | 3 — cloud plan on top of processing fees | 4 — HTTPS webhook works, but payloads are routed through the switch | 2 — two dashboards, routing rules, connector drift | 15 |
| Hyperswitch self-host | 4 — same connectors, but you operate them | 1 — infra + processor onboarding + upgrades | 1 — always-on containers/DB; does not fit Vercel functions | 3 — Vercel can receive the webhook, but the switch needs its own host | 1 — patching, uptime, PCI scope, backups | 10 |
| Cashfree | 4 — UPI, cards, netbanking; strong INR coverage | 3 — new KYC and a second account | 5 — no extra host | 4 — webhook + signature, docs less consistent | 3 — another dashboard/relationship | 19 |

### Why each score matters here

- **INR + UPI + cards.** All three processors can do it. This dimension does not
  differentiate much; the differentiator is how much extra machinery sits in
  front of the money.
- **Solo-seller onboarding.** Razorpay wins because the owner already has the
  account. Hyperswitch cloud/self-host requires the switch **and** the
  underlying processor, which doubles KYC and support.
- **Hosting cost.** Razorpay and Cashfree add ₹0 fixed hosting. Hyperswitch
  self-host needs an always-on service, which is exactly what a Vercel-only
  storefront does not have.
- **Vercel serverless webhook fit.** A webhook is an HTTP POST. Razorpay and
  Cashfree sign the raw body with an HMAC header and retry failures, which maps
  cleanly onto a route handler. Hyperswitch works, but it introduces a second
  hop and a second set of event IDs.
- **Operational burden.** One dashboard, one reconciliation source and one
  refund flow is the correct amount of operations for three SKUs.

### Cost sketch (not a forecast)

At ~100 orders/month and an average order value of ₹300 (₹30,000 GMV):

| Option | Fixed monthly | Variable (approx.) | Notes |
|---|---|---|---|
| Razorpay direct | ₹0 | ~2% + GST on cards; UPI merchant fees vary by method and volume | Cheapest total for this volume |
| Hyperswitch Cloud | cloud plan + processing | processor fee + switch fee | Fixed plan can exceed the fee at this volume |
| Hyperswitch self-host | VM/DB/monitoring | processor fee | Ops time is the real cost |
| Cashfree | ₹0 | ~1.95% + GST (list) | Comparable; no reason to add a second account now |

The exact fee depends on the payment method and negotiated rate. Reconcile
against the Razorpay dashboard, not this table.

---

## 3. Architecture

```
Browser                Next.js (Vercel)                 Razorpay
  │                         │                              │
  │ POST /api/checkout      │                              │
  ├────────────────────────►│ validate product + price      │
  │                         ├─ create order row (idempotent key)
  │                         ├─ POST /v1/orders ───────────►│
  │ ◄───────────────────────┤ {orderId, keyId, amount}      │
  │ open Razorpay Checkout  │                              │
  ├─────────────────────────┼─────────────────────────────►│
  │                         │  POST /api/webhooks/razorpay │
  │                         │◄─────────────────────────────┤ raw body + HMAC
  │                         ├─ verify HMAC (constant time)
  │                         ├─ claim webhook_events(provider,event_id)
  │                         ├─ transition order pending → paid (guarded)
  │                         ├─ create download row + signed token
  │                         ├─ send receipt (Resend or SMTP)
  │                         └─ log email_log (sent / failed / queued)
  │ check email            │
```

### Files

| Path | Purpose |
|---|---|
| `lib/payments/provider.ts` | Provider contract: `createOrder`, `verifyWebhook`, `refund` |
| `lib/payments/razorpay.ts` | Razorpay REST adapter, HMAC SHA-256 raw-body verification, paise amounts, live-key guard |
| `lib/payments/stub.ts` | Local-only provider that never charges; signed synthetic webhooks |
| `lib/payments/registry.ts` | Picks provider from `PAYMENTS_PROVIDER`; returns `null` when incomplete |
| `lib/payments/checkout.ts` | Server-side product/price validation, order creation, idempotency |
| `lib/payments/webhook.ts` | Signature check → event claim → order transition → fulfilment |
| `lib/payments/store.ts` | Storage interface + Supabase implementation |
| `lib/payments/fulfilment.ts` | Download row, signed token, receipt log/send |
| `lib/downloads/token.ts` | HMAC-signed, expiring download tokens |
| `lib/email/` | One mailer interface, Resend and SMTP implementations |
| `supabase/migrations/` | Committed schema + product seed |
| `app/api/checkout/route.ts` | Checkout endpoint |
| `app/api/webhooks/[provider]/route.ts` | Raw-body webhook endpoint |
| `app/api/downloads/[token]/route.ts` | Rate-limited, signed, expiring delivery |

### Money and identity rules

- All amounts are integer **paise** in the database and at the gateway. Display
  prices are INR in `data/products.ts`; checkout multiplies by 100.
- The client never supplies the price. A supplied price that disagrees with the
  server product is rejected with `400 price_mismatch`.
- Checkout is idempotent on `Idempotency-Key` (or a server-generated UUID).
  Repeating the request returns the stored order/gateway order, not a second
  order.
- Webhooks are the source of truth for payment state. The browser callback is a
  UI hint, never a fulfilment trigger.
- `webhook_events` has `unique (provider, event_id)`. A replayed event is
  claimed once; fulfilment additionally requires a guarded
  `pending → paid` transition, so even two different event IDs for the same
  payment cannot double-deliver.
- The webhook compares the gateway amount with the stored order amount before
  fulfilment. A mismatch is logged as failed and not fulfilled.

---

## 4. Owner actions — exact accounts and keys

Create or provide these, then set them in Vercel (Preview + Production) and in
`.env.local` for local testing. Never commit values.

### Razorpay (test mode)

1. **Razorpay account** — https://dashboard.razorpay.com. Complete business/KYC
   when going live; test mode works before that.
2. Keep the dashboard in **Test Mode**.
3. **API keys** — Account & Settings → API Keys → Generate Test Key.
   - `RAZORPAY_KEY_ID` = `rzp_test_…`
   - `RAZORPAY_KEY_SECRET` = the secret shown once
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` = same key ID (the checkout script needs it)
4. **Webhook secret** — Account & Settings → Webhooks → Add New Webhook.
   - URL: `https://www.buildyourprojects.xyz/api/webhooks/razorpay`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
   - `RAZORPAY_WEBHOOK_SECRET` = the secret you set there
   - Add a second webhook for the Vercel preview domain when testing previews.
5. `PAYMENTS_PROVIDER=razorpay`
6. Do **not** generate live keys. The adapter refuses `rzp_live_…` key IDs.

### Supabase (project already created)

Already recorded in `DECISIONS.md` §2. The owner must confirm these are in
Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://bxwllaycolngyzlebqsm.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose)
- `SUPABASE_DB_PASSWORD` (CLI/migration use only)

Run the migrations once with the steps in `supabase/README.md`.

### Delivery token

- `DOWNLOAD_TOKEN_SECRET` — generate with
  `openssl rand -base64 48` and store only in Vercel. Changing it invalidates
  every outstanding download link; that is the emergency revocation switch.
- Optional: `DOWNLOAD_TTL_HOURS` (default `72`), `DOWNLOAD_MAX_ATTEMPTS`
  (default `5`).

### Email (pick one)

**Resend (recommended):**
1. Create https://resend.com account.
2. Verify the sending domain (or use the test sender for test-mode only).
3. `RESEND_API_KEY`, `MAIL_FROM` (e.g. `BuildYourProjects <orders@buildyourprojects.xyz>`).

**SMTP (existing Gmail):**
- `SMTP_HOST` (e.g. `smtp.gmail.com`), `SMTP_PORT` (`587`), `SMTP_USER`,
  `SMTP_PASS` (Gmail App Password, not the account password), `MAIL_FROM`.
- Gmail has daily sending limits; Resend is the better long-term choice.

If neither is configured, fulfilment still creates the download row and writes
an `email_log` row with status `queued` and error `mailer_not_configured`. The
owner can resend from the database. It is never marked as sent.

### Full environment list

| Variable | Required when | Purpose |
|---|---|---|
| `PAYMENTS_PROVIDER` | always | `razorpay` (or `stub` outside production) |
| `RAZORPAY_KEY_ID` | razorpay | Test key ID, must start `rzp_test_` |
| `RAZORPAY_KEY_SECRET` | razorpay | API secret |
| `RAZORPAY_WEBHOOK_SECRET` | razorpay | HMAC secret for webhook raw body |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | razorpay | Public key for checkout script |
| `NEXT_PUBLIC_SUPABASE_URL` | always | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | always | Server-only DB access |
| `DOWNLOAD_TOKEN_SECRET` | fulfilment | Signs expiring download tokens |
| `DOWNLOAD_TTL_HOURS` | optional | Token/row expiry, default 72 |
| `DOWNLOAD_MAX_ATTEMPTS` | optional | Download cap, default 5 |
| `RESEND_API_KEY` | email | Resend transport |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | email | SMTP transport |
| `MAIL_FROM` | email | From header |
| `NEXT_PUBLIC_SITE_URL` | always | Canonical URLs in emails |

---

## 5. Fail-closed behaviour

| Missing input | Result |
|---|---|
| `PAYMENTS_PROVIDER` empty/unknown | Buy buttons disabled with “payments coming soon”; `/api/checkout` returns `503 payments_not_configured` |
| Razorpay key/secret/webhook secret incomplete | Same as above; the product page does not render an email form |
| Live-looking Razorpay key | Provider disabled; error logged; no checkout |
| `SUPABASE_*` missing | `/api/checkout` and webhook return `503 storage_not_configured`; no fake order |
| `DOWNLOAD_TOKEN_SECRET` missing | Payment is recorded but fulfilment fails closed: order stays paid, webhook marked failed, owner must configure the secret and replay. No unsigned link is ever issued |
| Mailer missing | Download row + token still created; `email_log` status `queued`, error `mailer_not_configured`; response is not “sent” |
| Deliverable file missing | Download route returns `503 deliverable_not_published`; no download count is consumed |

---

## 6. Test-mode runbook (once keys arrive)

1. Set test keys locally, run `pnpm dev`.
2. Visit a product page; the buy panel should appear.
3. Pay with Razorpay test UPI (`success@razorpay`) or test card
   (`4111 1111 1111 1111`, any future expiry, any CVV).
4. Confirm `orders.status = paid`, one `payments` row, one `downloads` row and
   an `email_log` row.
5. Replay the webhook from the Razorpay dashboard; confirm no second download
   row and no second email (`webhook_events` count unchanged).
6. Open the emailed link; confirm it expires and stops after the attempt cap.
7. Send a tampered webhook with `curl`; confirm `401` and no state change.
8. Refund in the Razorpay dashboard; mark the order/refund in the database
   manually (no automatic refund webhook in v1).

---

## 7. Deliberate non-goals for v1

- No automatic refunds from the site; refunds are issued in the Razorpay
  dashboard and recorded by the owner.
- No subscriptions, coupons, carts or bundles (bundles need owner approval).
- No Hyperswitch integration; the provider interface is the extension point.
- No invoice/GST engine. A receipt email is not a tax invoice.
- No download files committed to the repo; the owner drops them in
  `private/downloads/<slug>/` (or a future Supabase Storage migration).

---

## 8. Sources

- Razorpay Orders API — https://razorpay.com/docs/api/orders/
- Razorpay webhook signature verification — https://razorpay.com/docs/webhooks/validate-test/
- Razorpay refunds — https://razorpay.com/docs/api/refunds/
- Razorpay pricing — https://razorpay.com/pricing/
- Hyperswitch (open-source switch) — https://github.com/juspay/hyperswitch
- Hyperswitch docs — https://docs.hyperswitch.io/
- Cashfree pricing — https://www.cashfree.com/pg/pricing/
- Supabase CLI / migrations — https://supabase.com/docs/guides/cli
- Resend API — https://resend.com/docs/api-reference/emails/send-email
- Nodemailer SMTP — https://nodemailer.com/smtp/

## Standard Checkout handshake — `/api/verify-payment`

The browser path that confirms a captured payment without waiting for a webhook.

- `POST /api/verify-payment`
- Body: `{ "razorpay_order_id", "razorpay_payment_id", "razorpay_signature" }`
  (aliases `order_id` / `payment_id` / `signature` accepted for server callers)
- Verification: `HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)`,
  compared with `timingSafeEqual`. A mismatch returns **400** and the order is
  never marked paid.
- On success: records the payment, transitions the order to `paid` at most once,
  then issues the download token and queues the receipt.
- Replays return `{ "status": "already_confirmed" }` and never double-fulfil.
- Rate limited per IP (20/min). Missing fields return 400.

The webhook endpoint `/api/webhooks/razorpay` remains the durable path; the
handshake exists so a payment is honoured even before a webhook secret is set.

### Verified in test mode (2026-10-31)

| Step | Result |
|---|---|
| Order create → Razorpay API | `order_TudOhJU3OyuKEF` created for ₹499 |
| Card `4100 2800 0000 1007` via mock bank | payment captured |
| `POST /api/verify-payment` | `{ ok: true, status: "confirmed" }` |
| Order row | `paid`, customer email recorded |
| Download row | created, id matches the signed token, 72h expiry, 5 attempts |
| Replay of the same handshake | `already_confirmed`, no second download |
| Tampered signature | 400, order untouched |
| Missing field | 400 |
| Download URL | 503 `deliverable_not_published` — the file itself ships in the
  product-build phase; the attempt is not consumed |
