# Legacy code

This folder holds the old static-site serverless functions. It is deliberately
outside `app/` and outside any `api/` path, so Next.js and Vercel do not expose
it at `/api`.

- `legacy/api/create-order.js` — decommissioned UroPay order stub.
- `legacy/api/verify-payment.js` — old UroPay webhook handler.

**Phase 4 owns their replacement.** Payments move to Razorpay behind a
`PAYMENTS_PROVIDER` flag, with signed webhook verification, idempotent order
handling, Supabase order records and automatic delivery. Do not restore these
files to the live `/api` namespace.

The old static HTML, `script.js`, `styles.css` and `images/` remain at the repo
root for reference during the rebuild. `courses.html` has been deleted and the
course URLs redirect to `/products`.
