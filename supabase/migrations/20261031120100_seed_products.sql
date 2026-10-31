-- Launch catalog, matching docs/DECISIONS.md §4 and data/products.ts.
-- UUIDs are stable so orders/downloads keep referencing the same rows.

insert into public.products (id, slug, name, price_paise, currency, deliverable_key, active)
values
  ('11111111-1111-4111-8111-111111111111', 'submission-kit', 'Submission Kit', 49900, 'INR', 'submission-kit', true),
  ('22222222-2222-4222-8222-222222222222', 'reportforge', 'ReportForge', 29900, 'INR', 'reportforge', true),
  ('33333333-3333-4333-8333-333333333333', 'viva-vault', 'Viva Vault', 14900, 'INR', 'viva-vault', true)
on conflict (slug) do update
  set name = excluded.name,
      price_paise = excluded.price_paise,
      deliverable_key = excluded.deliverable_key,
      active = excluded.active,
      updated_at = timezone('utc', now());
