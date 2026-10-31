# Private deliverables

Drop the paid download files here before deploying. They are **not** committed.

Layout (the download route resolves exactly these names):

```
private/downloads/submission-kit/submission-kit.zip
private/downloads/reportforge/reportforge.zip
private/downloads/viva-vault/viva-vault.zip
```

A `.pdf` is also accepted if the product is a single document:

```
private/downloads/viva-vault/viva-vault.pdf
```

Rules:

- The folder name must match `products.deliverable_key` (`submission-kit`,
  `reportforge`, `viva-vault`).
- The file name must match the folder name.
- Prefer `.zip` for multi-file packs. Keep each file well under Vercel's
  response limits.
- Files are served only through `GET /api/downloads/[token]` after a signed
  token, a paid order, expiry and attempt checks pass.
- Never put customer data, keys or receipts in this folder.
- The route returns `503 deliverable_not_published` when a file is missing. It
  does not fake a download or consume an attempt.

Vercel tracing is configured in `next.config.ts` so these files are included in
the serverless bundle. Adding or replacing a deliverable requires a redeploy.
A later phase can move this to Supabase Storage signed URLs without changing
the public download URL.
