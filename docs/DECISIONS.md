# Owner decisions (recorded 2026-10-31)

These override anything ambiguous in `BRIEF.md`. Every agent must read this file
before starting a phase.

## 1. Payments — Razorpay, keys arriving later

- Provider: **Razorpay**, TEST MODE ONLY. The owner will supply test keys later.
- Implement behind a `PAYMENTS_PROVIDER` config flag so the provider can be swapped.
- Do NOT block the build on missing keys: code against a documented interface,
  ship `.env.example`, and fail closed with a clear message when keys are absent.
- The owner has NOT approved going live. Never enable live mode.
- Still write `docs/payments.md` with the Hyperswitch comparison required by the
  brief, and record why Razorpay-direct was chosen for v1 (solo seller, Vercel
  serverless webhooks, no extra hosting).
- Hyperswitch self-hosting is explicitly out of scope for v1.

## 2. Database — Supabase (created)

- Project: `byp-orders`, ref `bxwllaycolngyzlebqsm`, region ap-south-1 (Mumbai).
- URL: `https://bxwllaycolngyzlebqsm.supabase.co`
- Credentials live in `.env.local` (gitignored). Never commit them.
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side route handlers; the
  publishable key may be used client-side.
- Tables must be created via SQL migrations committed to the repo.

## 3. Brand — new logo in scope

- Product name stays **BuildYourProjects**; domain stays www.buildyourprojects.xyz.
- A **new logo / wordmark + favicon set** is in scope for the design phase and
  produced as SVG (hand-authored or Gemini-assisted), not a Gemini raster trace.
- Existing logo/art in the repo may be replaced.

## 4. Pricing — approved

| Product | Price (INR) |
|---|---|
| Submission Kit (hero) | ₹499 |
| ReportForge | ₹299 |
| Viva Vault | ₹149 |

Bundles/ladders may be proposed but not shipped without owner approval.

## 5. Assets — Gemini via opencli, with a hard fallback

- `opencli gemini` is the intended generator, but the Browser Bridge extension is
  currently NOT connected on this machine. Muse must:
  1. try `opencli gemini status`, and if connected, generate;
  2. log every prompt in `assets/prompts.md` either way;
  3. fall back to CSS/SVG art when the bridge is unavailable, so the phase can
     never stall. Owner-approved fallback.
- No copyrighted logos, no real people's faces.

## 6. Deploy — reuse the existing Vercel project

- Target: Vercel project `buildyourprojects342-in` (www.buildyourprojects.xyz).
- Branch `rebuild/storefront` gives preview deployments only.
- Merge to `main` (and therefore production) ONLY after QA passes and the owner
  gives an explicit go-ahead.

## 7. Email / delivery

- Receipts and download links go through an abstracted sender: SMTP (existing
  Gmail account) or Resend, whichever key the owner provides. Ship both paths
  behind one interface; fail closed with a logged error if unconfigured.

## 8. Model policy (non-negotiable)

- Every Paperclip agent runs `opencode-go/deepseek-v4.1-flash`. Do not switch
  models, and do not spawn sub-sessions on other models.
