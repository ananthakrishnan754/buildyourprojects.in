# MASTER BRIEF — Rebuild buildyourprojects.xyz

Owner-supplied specification. This file is the source of truth for every agent.
Do not re-scope it. Ask the board only when blocked on something only the owner
can provide (accounts, API keys, final pricing, brand assets).

## 0. Context

- Existing site: https://www.buildyourprojects.xyz — repo `ananthakrishnan754/buildyourprojects.in`, deployed on Vercel (project `buildyourprojects342-in`, production domain www.buildyourprojects.xyz, auto-deploys from `main`).
- Current stack (verified by inspection): static HTML/CSS/JS, Firebase Firestore, UroPay payment buttons, two serverless functions in `api/` (`create-order.js`, `verify-payment.js`), no build step.
- Current offering: (a) college project-building service, (b) courses (to be removed).
- Owner is a solo creator promoting products with short videos (Reels/Shorts). The site must convert video-driven mobile traffic.
- Primary audience: Indian college students.

## 1. What to do

1. REMOVE the courses section/pages/routes/links completely (also redirects, sitemap, nav, search).
2. KEEP the college-projects service (content, pricing, flow), re-skinned into the new design.
3. ADD a "Products" storefront selling digital products/tools students buy impulsively.
4. REDESIGN the entire site from scratch: new theme, structure, components.
5. Replace/augment Razorpay with an open-source payments setup (see §5).
6. Generate visual/video assets with Gemini via opencli.
7. Verify everything, then push to GitHub so Vercel deploys.

## 2. Orchestration (Paperclip)

Phase gates, in order: **Research → Design → Build → Payments → Assets → QA → Release**.

- Every agent writes a short report to `docs/<phase>.md` (decisions + sources).
- No agent starts work that depends on an unfinished phase.
- Work happens on branch `rebuild/storefront`. Open a PR and merge to `main` only after QA passes.
- Never push directly to `main` before the release phase.

Roles: Scout (research), Iris (design), Forge (frontend), Ledger (payments),
Muse (assets), Checkpoint (QA/release), Atlas (coordinator/CTO).

## 3. Deep research (do this first, cite sources, no guessing)

### A. Products to sell

- Find what is selling to students now: Gumroad, Topmate, Instamojo, Etsy, Notion templates, Telegram/Instagram creator stores, Product Hunt, Reddit (r/IndianStudents, r/JEENEETards, r/Btechtards), YouTube/Instagram Reels about student side-hustles and viral tools.
- Study the "GPT calculator" style product: small, demo-able, impressive in a 15-second video. Similar categories: AI assignment/notes formatters, handwriting-style assignment generators (text to handwritten pages), lab-record/report templates, resume/portfolio builders, PPT generators, viva question banks, project-report generators, citation tools, exam-prep notes packs, semester cheat-sheets, GitHub README and portfolio templates, mini-project starter kits.
- Score each candidate: demand evidence, build effort (hours), INR price point, margin, video-friendliness, legal/policy risk, repeat-purchase potential.
- Output: ranked shortlist of 5–8 products; recommended launch set of 3 (one hero, two supporting); one-line video hook idea for each.
- Policy: position everything as study aids, templates and tools. Do NOT build or sell ghost-writing/cheating services. Check the payment processor's prohibited-business policy before building.

### B. Design inspiration

- Review award-style sites (Awwwards, Godly, Dribbble, Linear, Vercel, Stripe, Framer showcase) and extract patterns for scroll storytelling, sticky sections, card interactions, hero treatments, micro-interactions.

### C. Payments

- See §5.

## 4. Design + frontend spec

- Theme: black-based dark theme. Pick and justify an accent palette (1 primary, 1 secondary, neutrals) with WCAG AA contrast in `docs/design.md`. Define tokens: colors, type scale, spacing, radius, shadows, motion durations/easings.
- Typography: one display font + one text font (Google Fonts or self-hosted).
- Required experience:
  - Smooth scrolling (Lenis or equivalent) + scroll-driven animation (GSAP ScrollTrigger and/or Framer Motion): parallax, pinned sections, text reveals, number counters, testimonial/logo marquee.
  - Dynamic cards: 3D tilt/hover, cursor-following spotlight/glow, animated borders, expanding product cards, filter/sort with animated layout transitions.
  - Hero with a strong value prop and one clear CTA, optimised for short-video traffic (fast, thumb-friendly).
  - Sections: Hero, Products (featured + grid), Projects service (process steps, what's included, pricing/enquiry), How it works, Social proof, FAQ, Footer. Dedicated product pages and checkout.
- Respect `prefers-reduced-motion`. Mobile-first.
- Lighthouse targets: Performance ≥ 85 mobile, Accessibility ≥ 95, SEO ≥ 95. Lazy-load heavy media, use `next/image` or equivalent, compress video, avoid layout shift.
- Keep the existing framework only if sensible; otherwise recommend a change and justify it. Prefer Next.js + Tailwind + TypeScript on Vercel.
- Add SEO (metadata, OpenGraph images, sitemap, robots), privacy-friendly analytics (Vercel Analytics/Plausible), and UTM-aware landing so the owner can attribute orders to videos.

## 5. Payments (open-source first, verified in test mode)

- Primary candidate: Hyperswitch (juspay/hyperswitch, open-source payment switch) over an Indian processor (Razorpay/Cashfree/PayU/PhonePe). Check: self-host vs hosted cloud for a solo creator, UPI support, cost, Vercel compatibility (serverless webhooks), onboarding effort.
- Evaluate other open-source commerce/billing pieces (Medusa, Lago, Kill Bill) ONLY if they simplify things. Be honest if open source adds too much cost/complexity and recommend the simplest reliable path.
- Deliver: decision note in `docs/payments.md` with comparison table, plus a working implementation. Keep Razorpay available behind a config flag until the new gateway is proven.
- Requirements: INR + UPI + cards, server-side order creation, signed webhook verification (never trust the client), idempotent order handling, order records in a database (Supabase/Postgres), automatic digital delivery after confirmed payment (secure expiring link or email access), receipt email, refund note, policy pages (Terms, Privacy, Refund, Contact).
- Security: keys only in environment variables (Vercel env), never committed. Provide `.env.example`. TEST MODE ONLY — never process real money during development. List exactly which keys/accounts the owner must create.

## 6. Assets (Gemini through opencli)

- Use opencli Gemini for hero visuals, product mockups, icons/illustrations, OG images, short looping background/promo videos.
- Keep consistent art direction matching the design system. Save prompts + outputs in `assets/prompts.md`.
- Optimise: WebP/AVIF images, MP4/WebM loops under ~1.5 MB. Alt text. Regenerate or fall back to CSS/SVG art. No copyrighted logos or real people's faces.
- Also produce 3 short video scripts (hook, demo beats, CTA) plus a posting checklist.

## 7. Build the products

- Build the 3 launch products chosen in research so they work end-to-end (not mockups). Each needs a working demo/preview on its product page, a clear deliverable after purchase, and a price.
- If a product needs an AI API: server-side calls only, rate limiting and abuse protection, estimated cost per use so margin is positive.

## 8. Verification (must pass before release)

- Build passes; lint + typecheck clean.
- Run locally and in a Vercel preview; test with Playwright on desktop and mobile viewports: every route, nav links, no 404s, no console errors, animations not janky, no horizontal scroll on mobile.
- Full purchase flow in TEST MODE: add product → pay (UPI/card test) → webhook received → order saved → delivery link/email works → repeat webhook does not double-fulfil → failed/cancelled payment handled.
- Confirm courses are fully gone (routes, links, sitemap, search).
- Confirm projects service enquiry form/flow still works.
- Run Lighthouse; report scores against the targets.
- Security basics: no secrets in repo/history, headers set, input validation, webhook signature check enforced.
- Write `docs/QA-report.md` with evidence (what was tested, results, screenshots).

## 9. Release

- Commit in logical steps with clear messages on `rebuild/storefront`, open a PR with a summary, merge to `main` after QA passes, confirm the Vercel production deployment is green, smoke-test the live URL.
- Final handover: README (setup, env vars, how to add a product, how to switch payment provider), list of manual steps for the owner (domain/DNS, gateway activation, live keys), and a prioritised "next improvements" list.

## 10. Working rules

- Do the deep research, choose the best option, document why. Ask the owner only when blocked on something only they can provide; batch questions in one message.
- Prefer simple and reliable over clever. Do not add unlisted features unless research shows a clear conversion benefit; propose them separately.
- Never go live with payments until the owner confirms.

## Environment facts (verified 2026-10-31)

- Repo clone for agents: `/home/ananthakrishnan/paperclip-workspace/buildyourprojects.in` (branch `rebuild/storefront`).
- `gh` authenticated as `ananthakrishnan754`; `git push` to origin works.
- `vercel` CLI authenticated as `ananthakrishnan754`; production project `buildyourprojects342-in`.
- `supabase` CLI authenticated; existing projects exist but none linked to this repo.
- `opencli gemini` exists (ask/image/status) but the Browser Bridge extension is NOT connected, so generation currently fails until the owner opens Chrome with the extension enabled.
- Node 24.18, pnpm 12.11, Docker 28.2 available. Disk is tight (~7 GB free): avoid large downloads; clean build caches.
- Model policy: every Paperclip agent runs `opencode-go/deepseek-v4.1-flash` only. Do not switch models.
