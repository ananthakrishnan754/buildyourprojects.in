-- Phase 4: atomic download-attempt claim.
-- The route resolves the file first, then calls this function once. The
-- function is the only place a download count is incremented, so the attempt
-- cap and expiry cannot be raced by concurrent requests.

create unique index if not exists downloads_order_id_unique
  on public.downloads (order_id);

create or replace function public.claim_download(p_token_hash text)
returns setof public.downloads
language sql
security definer
set search_path = public
as $$
  update public.downloads d
     set download_count = d.download_count + 1,
         last_downloaded_at = timezone('utc', now())
   where d.token_hash = p_token_hash
     and d.revoked = false
     and d.expires_at > timezone('utc', now())
     and d.download_count < d.max_downloads
  returning d.*;
$$;

revoke all on function public.claim_download(text) from public, anon, authenticated;
grant execute on function public.claim_download(text) to service_role;
