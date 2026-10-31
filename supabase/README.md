# Supabase — orders and fulfilment

Project: **byp-orders** (`bxwllaycolngyzlebqsm`, `ap-south-1`). The schema lives
in `supabase/migrations/` and is the only supported way to create or change
tables. Do not edit the dashboard schema by hand.

## One-time link and push

Prerequisites: Supabase CLI (v2+), access to the project, and the database
password from the owner (also stored in `.env.local` as `SUPABASE_DB_PASSWORD`,
never committed).

```bash
# from the repository root
supabase login                       # if this machine is not already logged in
supabase link --project-ref bxwllaycolngyzlebqsm
supabase db push
```

`supabase link` prompts for the database password. For CI, set
`SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` in the environment instead.

Verify:

```bash
supabase migration list
psql "$SUPABASE_DB_URL" -c "\dt public.*"
```

The seed migration inserts the three launch products. Re-running it is safe
(`on conflict (slug) do update`).

## What the migrations create

| Table | Purpose |
|---|---|
| `products` | Catalog mirror with stable UUIDs and paise prices |
| `orders` | One row per checkout; unique `idempotency_key`, status lifecycle |
| `order_items` | Line items (one per product today, ready for bundles) |
| `payments` | Gateway order/payment records and states |
| `webhook_events` | Raw gateway events; `unique (provider, event_id)` blocks replay |
| `downloads` | Signed-token delivery rows, expiry, attempt cap, revocation |
| `email_log` | Receipt queue/sent/failed ledger, including unconfigured mailer |

Indexes cover order status, created_at, payment status and webhook receipt time.
RLS is enabled on every table with **no policies**: only the service-role key
used by server route handlers can read or write. Never expose
`SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Adding a migration

```bash
supabase migration new add_my_change
# edit supabase/migrations/<timestamp>_add_my_change.sql
supabase db push
```

Migrations must be additive and reversible by a follow-up migration. Never edit
a migration that has been pushed to the shared project.

## Local development (optional)

Docker is available but disk is tight. If you need a local database:

```bash
supabase start
supabase db reset        # applies every migration from scratch
```

Point `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` at the local
stack while it runs.
