-- Phase 4: payments, orders and fulfilment schema.
-- All money is stored as integer paise. No floating point anywhere.

create extension if not exists pgcrypto;

-- Shared updated_at trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Catalog mirror. data/products.ts remains the checkout source of truth; this
-- table gives orders a stable foreign key and the owner a DB-visible catalog.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_paise integer not null check (price_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  deliverable_key text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  idempotency_key text not null unique,
  product_id uuid not null references public.products(id),
  product_slug text not null,
  customer_email text not null check (customer_email = lower(customer_email)),
  customer_name text,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_email_idx on public.orders (customer_email);
create unique index if not exists orders_provider_order_id_key
  on public.orders (provider, provider_order_id)
  where provider_order_id is not null;

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_slug text not null,
  name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount_paise integer not null check (unit_amount_paise > 0),
  total_paise integer not null check (total_paise > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_created_at_idx on public.order_items (created_at desc);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_order_id text not null,
  provider_payment_id text,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'created'
    check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
  method text,
  raw_event_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_created_at_idx on public.payments (created_at desc);
create unique index if not exists payments_provider_payment_id_key
  on public.payments (provider, provider_payment_id)
  where provider_payment_id is not null;

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- Raw webhook ledger. The unique constraint is the replay guard: one row per
-- gateway event, regardless of how many times the gateway retries delivery.
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  signature_valid boolean not null default false,
  payload jsonb not null,
  status text not null default 'received'
    check (status in ('received', 'processing', 'processed', 'ignored', 'failed')),
  attempts integer not null default 1 check (attempts > 0),
  error text,
  received_at timestamptz not null default timezone('utc', now()),
  processed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, event_id)
);

create index if not exists webhook_events_status_idx on public.webhook_events (status);
create index if not exists webhook_events_received_at_idx
  on public.webhook_events (received_at desc);

create trigger webhook_events_set_updated_at
before update on public.webhook_events
for each row execute function public.set_updated_at();

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_slug text not null,
  deliverable_key text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  max_downloads integer not null default 5 check (max_downloads > 0),
  download_count integer not null default 0 check (download_count >= 0),
  last_downloaded_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists downloads_order_id_idx on public.downloads (order_id);
-- One deliverable row per product per order. This is the second guard against
-- double fulfilment even if two distinct gateway events race.
create unique index if not exists downloads_order_product_key
  on public.downloads (order_id, product_slug);
create index if not exists downloads_expires_at_idx on public.downloads (expires_at);
create index if not exists downloads_active_idx
  on public.downloads (revoked, expires_at)
  where revoked = false;

create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  to_email text not null,
  template text not null,
  subject text not null,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed', 'skipped')),
  provider text,
  message_id text,
  error text,
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  sent_at timestamptz
);

create index if not exists email_log_order_id_idx on public.email_log (order_id);
create index if not exists email_log_status_idx on public.email_log (status);
create index if not exists email_log_created_at_idx on public.email_log (created_at desc);

-- All access is server-side through the service role. RLS is enabled with no
-- policies so anon/authenticated keys cannot read orders, tokens or emails.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;
alter table public.downloads enable row level security;
alter table public.email_log enable row level security;
