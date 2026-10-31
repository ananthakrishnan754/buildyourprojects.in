# Phase 2 — Design System, Art Direction, Motion Spec

Source of truth: `docs/BRIEF.md` §4 and `docs/research.md` §6–7. This document
defines the storefront's visual system and interaction contract. It does not
contain site code. Patterns are referenced by name (P1–P8), not re-derived.

**Scope:** black-based, mobile-first, high-motion storefront for Indian college
students arriving from Reels/Shorts. Three products (₹149 / ₹299 / ₹499, bundle
₹799) plus the existing custom-projects service.

---

## 1. Art direction — "Black Lab"

**Black Lab** is a near-black workbench where student output is the only bright
thing in the frame: matte black surfaces, one acid-lime signal, and precise
white type, like a lab bench at 2 a.m. before submission. Materials are matte
paper, frosted glass and brushed aluminium; light is a single hard key from the
top-left with deep falloff, never a rainbow gradient. Motion feels mechanical
and confident — short, weighted entrances, one pinned story per page, and
scroll-linked reveals that stop the moment the user stops, with everything
instantly readable when motion is reduced.

Why this direction: P3 (one loud hero on disciplined dark chrome) + P8 (specific
deliverable numbers) match a 2-second video-traffic decision, while near-black
keeps product screenshots and lime CTAs legible on ₹10k Android panels.

---

## 2. Colour tokens

All ratios below are computed from WCAG 2.x relative luminance (sRGB), not
estimated. Body text requires ≥ 4.5:1; large text (≥ 24px regular / ≥ 18.66px
bold) requires ≥ 3:1.

### 2.1 Neutral ramp (6 steps) and surfaces

| Token | Hex | Role |
|---|---|---|
| `--n-0` | `#050506` | Page / true black |
| `--n-1` | `#0D0D10` | Surface (cards, inputs) |
| `--n-2` | `#17171C` | Elevated (sheet, popover, hover) |
| `--n-3` | `#2A2A33` | Stroke / divider |
| `--n-4` | `#8F8F9C` | Muted text, metadata |
| `--n-5` | `#F4F4F7` | Primary text |

Aliases: `--surface-page: var(--n-0)`, `--surface: var(--n-1)`,
`--surface-elevated: var(--n-2)`, `--stroke: var(--n-3)`,
`--stroke-strong: #3D3D4A`, `--text: var(--n-5)`, `--text-muted: var(--n-4)`.

### 2.2 Accents, semantic, focus

| Token | Hex | Use |
|---|---|---|
| `--accent` ("Volt") | `#C8FF3D` | Primary CTA, active state, one highlight per viewport |
| `--accent-ink` | `#050506` | Text on Volt |
| `--accent-2` ("Ember") | `#FF6B4A` | Bundle saving, scarcity, secondary emphasis |
| `--success` | `#4ADE80` | Payment/delivery confirmation |
| `--warn` | `#FBBF24` | Expiring download, low stock of a cohort |
| `--danger` | `#FF6B6B` | Errors, destructive actions |
| `--focus` | `#C8FF3D` | 2px focus ring, 2px offset |

Accent budget: Volt appears once per viewport (CTA or metric, never both).
Ember is limited to price-saving and live-status chips. Never place Volt text on
Ember, or accent text on accent.

### 2.3 Computed contrast pairs (all pass AA)

| Foreground | Background | Ratio | Requirement | Result |
|---|---|---|---|---|
| `#F4F4F7` text | `#050506` page | **18.56:1** | 4.5 body | Pass AAA |
| `#F4F4F7` text | `#0D0D10` surface | **17.68:1** | 4.5 body | Pass AAA |
| `#F4F4F7` text | `#17171C` elevated | **16.27:1** | 4.5 body | Pass AAA |
| `#8F8F9C` muted | `#050506` page | **6.38:1** | 4.5 body | Pass AA |
| `#8F8F9C` muted | `#0D0D10` surface | **6.08:1** | 4.5 body | Pass AA |
| `#8F8F9C` muted | `#17171C` elevated | **5.59:1** | 4.5 body | Pass AA |
| `#C8FF3D` Volt | `#050506` page | **17.29:1** | 3 large | Pass AAA |
| `#C8FF3D` Volt | `#0D0D10` surface | **16.47:1** | 4.5 body | Pass AAA |
| `#050506` ink | `#C8FF3D` Volt button | **17.29:1** | 4.5 body | Pass AAA |
| `#FF6B4A` Ember | `#050506` page | **7.23:1** | 4.5 body | Pass AAA |
| `#FF6B4A` Ember | `#0D0D10` surface | **6.89:1** | 4.5 body | Pass AA |
| `#050506` ink | `#FF6B4A` Ember button | **7.23:1** | 4.5 body | Pass AAA |
| `#4ADE80` success | `#0D0D10` surface | **11.14:1** | 4.5 body | Pass AAA |
| `#4ADE80` success | `#17171C` elevated | **10.25:1** | 4.5 body | Pass AAA |
| `#FBBF24` warn | `#0D0D10` surface | **11.62:1** | 4.5 body | Pass AAA |
| `#FBBF24` warn | `#17171C` elevated | **10.70:1** | 4.5 body | Pass AAA |
| `#FF6B6B` danger | `#0D0D10` surface | **6.99:1** | 4.5 body | Pass AA |
| `#FF6B6B` danger | `#17171C` elevated | **6.44:1** | 4.5 body | Pass AA |

Non-text stroke `#2A2A33` is decorative only. Disabled text uses
`--n-4` at 60% opacity and is exempt; disabled controls never carry required
information. No text is set below 12px.

### 2.4 Accent choice vs rejected alternatives

**Chosen: Volt `#C8FF3D`.** It is video-legible at thumbnail size, reads as
"output / pass / energy" rather than "AI startup", and supports ink-on-accent at
17.29:1. Ember `#FF6B4A` carries urgency without competing as a second brand
colour.

| Rejected | Hex | Why rejected |
|---|---|---|
| Vercel blue | `#0070F3` | 4.47:1 on the page — fails AA body; also the exact category default that research §8 says not to copy |
| Linear purple | `#5E6AD2` | 4.33:1 on the page — fails AA body; the most-copied "dark AI SaaS" skin, low chroma on OLED |

## 3. Typography

**Display:** Bricolage Grotesque (variable 200–800), used at 700/800.
**Text/UI:** Inter (variable 100–900), used at 400/500/600.
Self-hosted via `next/font/google` at build; no runtime Google request.

| Token | Mobile (px / line-height) | Desktop (px / line-height) | Weight | Tracking |
|---|---|---|---|---|
| `display-1` | 44 / 0.95 | 88 / 0.92 | 800 | −0.045em |
| `display-2` | 34 / 1.00 | 64 / 0.95 | 700 | −0.035em |
| `h1` | 28 / 1.10 | 44 / 1.05 | 700 | −0.030em |
| `h2` | 24 / 1.15 | 32 / 1.15 | 600 | −0.020em |
| `h3` | 20 / 1.25 | 24 / 1.25 | 600 | −0.015em |
| `body-lg` | 18 / 1.55 | 20 / 1.55 | 400 | −0.005em |
| `body` | 16 / 1.60 | 17 / 1.60 | 400 | 0 |
| `body-sm` | 14 / 1.50 | 14 / 1.50 | 400 | +0.005em |
| `label` | 12 / 1.20 | 12 / 1.20 | 600 | +0.080em, uppercase |
| `price` | 28 / 1.00 | 40 / 1.00 | 700 | −0.030em |

- Prices, counters and any live number use Inter with
  `font-variant-numeric: tabular-nums` so digits never shift width.
- Maximum measure: 68ch for prose; product copy 52ch; never full-width body.
- **Display rule:** Bricolage is allowed only for the hero headline, section
  titles, product names on detail pages, and one numeric proof band. It is never
  used for body, buttons, labels, inputs, prices, table data, or text below 28px
  mobile / 40px desktop. One display element per viewport.
- Font files: latin + latin-ext subsets (latin-ext is required for ₹ U+20B9 —
  verify the glyph in Phase 6). `font-display: swap`; preload only the two
  above-the-fold faces. No icon font; icons are inline SVG.

---

## 4. Space, shape, depth, layout

### 4.1 Spacing (4px base)

`--space-0: 0` · `--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` ·
`--space-4: 16px` · `--space-5: 20px` · `--space-6: 24px` · `--space-8: 32px` ·
`--space-10: 40px` · `--space-12: 48px` · `--space-16: 64px` ·
`--space-20: 80px` · `--space-24: 96px` · `--space-32: 128px`.

Section padding: 64px mobile, 96px tablet, 128px desktop. Stack rhythm: 8px
inside a control, 16px inside a card, 24–32px between card groups, 64–128px
between sections.

### 4.2 Radius

`--r-xs: 4px` (badges) · `--r-sm: 8px` (inputs) · `--r-md: 12px` (buttons) ·
`--r-lg: 16px` (cards) · `--r-xl: 24px` (media/sheets) · `--r-pill: 999px`.
Product media uses `--r-lg`; do not mix pill and square cards in one grid.

### 4.3 Shadow and elevation

On near-black, borders do the work; shadows are support.

| Token | Value | Use |
|---|---|---|
| `--e0` | none | flat rows, table |
| `--e1` | `inset 0 1px 0 rgba(255,255,255,.05), 0 8px 24px rgba(0,0,0,.45)` | cards |
| `--e2` | `inset 0 1px 0 rgba(255,255,255,.07), 0 16px 48px rgba(0,0,0,.55)` | hover / popover |
| `--e3` | `0 32px 96px rgba(0,0,0,.7)` | modal / sheet |
| `--glow-volt` | `0 0 0 1px rgba(200,255,61,.35), 0 0 32px rgba(200,255,61,.12)` | focus/active only |

### 4.4 Containers and breakpoints

| Name | Width |
|---|---|
| `--container-prose` | 68ch |
| `--container` | 1200px |
| `--container-wide` | 1440px |
| Gutter | 20px mobile, 32px ≥768, 48px ≥1280 |

Breakpoints: `360` (min supported), `480` (2-col product grid), `768` (tablet,
nav switch), `1024` (3-col grid, pinning allowed), `1280` (wide), `1440` (max).
Mobile-first `min-width` queries only.

### 4.5 Z-index

`0` content · `10` raised card · `100` sticky sub-nav / filter bar · `200`
site header · `300` scrim · `400` modal/sheet · `500` toast · `700` skip link ·
`900` dev overlay (never shipped). No ad-hoc values outside this scale.

## 5. Motion system

Stack: **Lenis** (smooth scroll) + **GSAP ScrollTrigger** (pins/scrub) +
**GSAP Flip** (filter/sort). No Framer Motion in the same tree; no canvas or
WebGL on the storefront.

### 5.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 120ms | hover colour, focus ring |
| `--dur-enter` | 240ms | cards, popovers, sheet in |
| `--dur-exit` | 160ms | dismiss, sheet out |
| `--dur-scroll` | 600ms | scroll-triggered reveals |
| `--dur-layout` | 320ms | filter/sort FLIP |
| scrub | progress-linked | pinned/parallax; **no duration** |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | entrances |
| `--ease-in` | `cubic-bezier(.4,0,1,1)` | exits |
| `--ease-inout` | `cubic-bezier(.65,0,.35,1)` | layout moves |
| `--ease-linear` | `linear` | marquee, scrub, spinner |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | pointer return only, max 2 elements |
| stagger | 40–60ms | grids/lists, cap 8 items |

### 5.2 Per-interaction spec

| Interaction | Trigger | Duration | Easing | Stagger | GPU-safe properties | Reduced-motion fallback |
|---|---|---|---|---|---|---|
| Smooth scroll (Lenis) | wheel / touch / keys | ~1.15s settle (lerp .1) | native | — | wrapper `transform` only | Destroy Lenis; native scroll; no transform wrapper |
| Scroll reveal | IntersectionObserver at 15%, once | 600ms | ease-out | 50ms, max 8 | `opacity`, `translate3d(0,24px,0)` | Content starts visible; no translate, no transition |
| Pinned story (P1) | ScrollTrigger pin, scrub | progress-linked | linear | — | Only `opacity` / `transform` inside the pinned visual | No pin, no scrub; visual and all three beats stacked statically |
| Counters (P8) | IO at 40%, once | 900ms | ease-out | 60ms between counters | `textContent` on fixed-width `tabular-nums` span | Final value rendered immediately |
| Marquee | CSS keyframes, in view | 32s loop | linear | — | `translate3d(-50%,0,0)` on duplicated track | Static wrapped row; duplicate track `aria-hidden` |
| 3D tilt | `pointermove`, fine pointer only | 200ms follow / 240ms return | ease-out | — | `rotateX/Y ≤ 6deg`, `translateZ(0)` | No tilt; hover uses border/glow only |
| Cursor spotlight (P6) | `pointermove` throttled to rAF | 120ms opacity | linear | — | CSS vars `--mx/--my` on an `opacity` gradient layer | Fixed gradient, no pointer follow |
| Animated border | hover / focus-visible | 6s loop | linear | — | `rotate` on a conic-gradient pseudo-element | Static 1px Volt stroke |
| Filter/sort layout | filter or sort change | 320ms in / 200ms out | ease-inout | 30ms | FLIP `transform` + `opacity` | Instant swap + `aria-live` "12 products" |
| Video card loop (P7) | in view ≥ 50% | 6–8s loop | linear | — | `play()/pause()` only; no CSS transform | Poster only; no autoplay on data-saver/reduced motion |
| Sheet / modal | open / close | 240ms / 160ms | out / in | — | `translate3d`, `opacity`, scrim opacity | Appears/disappears instantly; focus still trapped |

### 5.3 Rules

- During scroll, animate **only `transform` and `opacity`**. Never animate
  `height`, `top`, `filter`, `box-shadow` or `background-position` on large
  surfaces while scrolling. `will-change` is added on interaction start and
  removed on end; never on every card at load.
- Start content visible in HTML; JS adds the hidden state. A JS failure must
  never hide the offer or the CTA.
- One pinned section per page on mobile, maximum two on desktop. Pinning + video
  + blur on the same viewport is banned (₹10k Android jank).
- `prefers-reduced-motion: reduce`: no Lenis, no pin/scrub, no autoplay, no
  marquee, no tilt, no parallax, no counter tween. Keep all content visible and
  all actions available.
- Respect `prefers-reduced-data`/Save-Data: poster instead of video, no
  preloading below the fold.
- One scroll listener owner (Lenis/ScrollTrigger). No component-level
  `window.addEventListener('scroll')`.

---

## 6. Section-by-section layout

Global: mobile-first, 20px gutters, 64px section padding, one Volt primary CTA
per section maximum. Product facts stay deliverable claims: "60-page report",
"12-slide deck", "25 viva answers", "300+ questions" — never invented customer
counts.

### 6.1 Hero
- **Purpose:** in 2 seconds, say what is sold, to whom, at what price; route to
  the hero product or the bundle.
- **Mobile:** headline (display-1, 3 lines max), one-sentence subhead, Volt CTA
  "Get the Submission Kit — ₹499", muted "or browse all products" link; product
  stack visual below the fold edge as a teaser; no video above the first paint.
- **Desktop:** 7/5 split — copy left, animated glass-card stack right (P3), proof
  band (P8) immediately under the fold.
- **Primary CTA:** "Get the Submission Kit — ₹499".
- **Motion:** P5 kinetic word-swap in the headline ("submit / format / defend",
  2.4s, 200ms mask), P3 one hero spotlight; static poster under reduced motion.

### 6.2 Products — featured + grid with filter/sort
- **Purpose:** make the three-product ladder and bundle obvious; let a student
  filter by need and price without leaving the page.
- **Mobile:** one featured card (Submission Kit, 4:5 media, price pill), then a
  horizontally scrollable filter chip row (All / Submit / Format / Viva / Bundle)
  and a 1-column grid; sort as a bottom sheet; sticky filter bar at z-100.
- **Desktop:** 3-up featured row with the ₹799 bundle as a wide 2-column tile
  (P4), then a filter/sort toolbar and a 3-column grid; hover reveals a 2–3s
  muted demo loop (P7).
- **Primary CTA:** "Add to cart" on each card; the bundle card uses "Get all
  three — ₹799".
- **Motion:** P7 media loops, P6 spotlight reveal for price/after-state, P2
  depth on the featured stack, Flip for filter/sort. Only one mobile loop plays.

### 6.3 Product detail — demo/preview + buy
- **Purpose:** prove the deliverable, remove doubt, take payment.
- **Mobile:** sticky bottom buy bar (price + "Buy now"), media/demo first, then
  what-you-get checklist, sample pages, FAQ, refund note; buy bar respects
  `safe-area-inset-bottom`.
- **Desktop:** 6/6 — sticky gallery left, buy column right (price, anchor,
  bundle upsell, delivery note, CTA); long-form proof below.
- **Primary CTA:** "Buy now — ₹499" (or "Get the bundle — ₹799" when upsell is
  cheaper per product).
- **Motion:** P1 pinned three-beat demo (code → report → viva) on desktop; on
  mobile the same beats become a swipeable tab set with no pin. P6 on the
  sample gallery only.

### 6.4 Projects service — process, inclusions, pricing/enquiry
- **Purpose:** keep the existing custom-project revenue and position the kits as
  the low-price entry point, not a replacement.
- **Mobile:** short promise, 4 process steps as a vertical timeline, inclusions
  as a checklist, price band "₹15,200–₹18,000" with "Talk on WhatsApp" and
  enquiry form; no long comparison table.
- **Desktop:** 5/7 — sticky process rail left, inclusions + pricing card right;
  a "starter vs custom" comparison row underneath.
- **Primary CTA:** "Enquire about a custom project" (WhatsApp or form).
- **Motion:** P2 sticky card stack for the four process steps; P8 deliverables
  band. No pin on mobile.

### 6.5 How it works
- **Purpose:** explain purchase → delivery → use in three steps; reduce support
  messages.
- **Mobile:** three numbered cards, each with one line and an icon; delivery
  promise ("instant download + email link") repeated under the third.
- **Desktop:** horizontal 3-step rail with a thin connecting line; one sentence
  per step, no paragraphs.
- **Primary CTA:** "See what's inside" (scrolls to product detail proof).
- **Motion:** scroll reveal with 50ms stagger; the connecting line draws with
  `scaleX` only. Reduced: all steps shown.

### 6.6 Social proof
- **Purpose:** replace a logo wall with specific, checkable deliverable numbers
  until real testimonials exist (P8).
- **Mobile:** one full-width proof band of 3 numbers (60-page report,
  12-slide deck, 25 viva answers), then 2 short quotes only when genuine and
  attributed; no star ratings without a source.
- **Desktop:** 3-up number band, then a 2-column quote row; one sentence
  context line above.
- **Primary CTA:** "Get the kit — ₹499" (repeat the hero CTA; no new offer).
- **Motion:** counters once at 40% visibility; no marquee of fake logos.

### 6.7 FAQ
- **Purpose:** answer price, delivery, refund, policy and "is this cheating?"
  before checkout.
- **Mobile:** single-column accordion, 44px rows, one open at a time; top three
  questions open by default.
- **Desktop:** two-column accordion (payment/delivery left, policy/use right),
  68ch max per answer.
- **Primary CTA:** "Still unsure? WhatsApp us" (secondary); primary remains the
  product CTA above.
- **Motion:** height auto-animation is banned on large panels; use a CSS grid
  `grid-template-rows: 0fr/1fr` transition or an instant reveal with opacity.
  Reduced: instant.

### 6.8 Footer
- **Purpose:** trust, policy pages, contact, and the last conversion path.
- **Mobile:** stacked — logo + one-line promise, product links, policy links,
  contact, payment badges; sticky buy bar never overlaps footer links.
- **Desktop:** 4 columns (Products / Service / Company / Contact), logo block
  left, legal row bottom with GST/refund/terms links.
- **Primary CTA:** "Get the Submission Kit — ₹499" (one text link, not a second
  loud button).
- **Motion:** none beyond a 1px stroke reveal; footer is a rest area.

## 7. Component inventory and states

All interactive targets ≥ 44×44px. Focus-visible is always a 2px `--focus` ring
with 2px offset; never remove outline without a replacement.

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Button (primary) | Volt bg, ink text, r-md | Volt at 92%, `translateY(-1px)` | 2px Volt ring, offset 2 | `scale(.98)` | 40% opacity, no pointer | Spinner + "Processing…", width locked | Not a button state; surface error via toast/field |
| Button (secondary) | transparent, 1px stroke | `--n-2` bg, `--stroke-strong` | Volt ring | `scale(.98)` | 40% opacity | Spinner + label | — |
| Card (product) | `--surface`, `--stroke`, r-lg | `translateY(-4px)`, `--e2`, spotlight | `:focus-within` ring | `scale(.99)` | Sold-out overlay, no pointer | Skeleton media + text bars | "Unavailable" badge + retry link |
| Input | `--surface`, 1px stroke | `--stroke-strong` | Volt ring | — | 40% opacity, no pointer | — | Danger stroke, message, `aria-invalid="true"` |
| Select | Input shell + chevron | `--stroke-strong` | Volt ring | Open: `--n-2` | 40% opacity | — | Danger stroke + message |
| Tabs | muted text | `--n-5` text | Volt ring | Volt text + 2px underline | 40% opacity | Skeleton label | — |
| Modal / sheet | `--n-2`, `--e3`, scrim 70% | — | Focus trapped; first control focused | — | — | Skeleton body, close still works | Inline error + retry; sheet stays open |
| Toast | `--n-2` + stroke | Pause auto-dismiss timer | Action link focusable | — | — | — | Danger icon, message, retry action |
| Skeleton | `--n-2` block, r-sm | — | — | — | — | 1.2s opacity pulse (not a gradient sweep) | Replaced by error card with retry |
| Badge | `--n-2`, `--n-4` text, pill | — | If link: Volt ring | — | 40% opacity | "…" | Danger variant + icon (not colour alone) |
| Price block | Inter 700 tabular, anchor struck in muted | — | If link: Volt ring | — | "Sold out" replaces CTA | Skeleton price bar | "Price unavailable" + enquiry link |

Additional component rules: toasts use `role="status"`/`aria-live="polite"`;
modals use `role="dialog"` + `aria-modal`, return focus on close, and lock body
scroll; tabs implement arrow-key navigation; form errors are linked with
`aria-describedby`; skeleton blocks reserve final dimensions to prevent CLS.

## 8. Asset art-direction brief (for the asset phase)

### 8.1 House constraints (apply to every asset)

Palette: base `#050506`, surfaces `#0D0D10`/`#17171C`, text `#F4F4F7`, Volt
`#C8FF3D` on ≤ 10% of frame, Ember `#FF6B4A` on ≤ 2%. Lighting: one soft key from
top-left at ~45°, cool white rim at ~15%, deep falloff to black, no coloured
gels, no bloom above 20%. Material: matte black paper, frosted glass, brushed
aluminium, fine film grain. Forbid: legible text, logos, brand marks, real faces,
hands, UI chrome that implies a different product, neon rainbow gradients.
Output: sRGB, 16:9 for hero/OG, 4:5 for product cards, 9:16 for loop keyframes.

### 8.2 Hero image — "The Stack"

Concept: three frosted-glass panes stacked in space like a submission pack, lit
so the lime edge is the only colour; the stack reads as code → report → viva.

> Ultra-realistic editorial still life in a pitch-black studio: three frosted glass panes floating in a loose diagonal stack, each pane containing faint abstract line-work suggesting code, a document, and flash cards, no legible text. Matte black paper and brushed aluminium base, one thin acid-lime (#C8FF3D) edge glowing on the middle pane, soft key light from top-left at 45 degrees, cool white rim light at 15 percent, deep falloff to pure black (#050506), subtle film grain, premium product photography, 16:9, no people, no logos, no text.

### 8.3 Product mockup 1 — Submission Kit

Concept: one complete submission pack laid out like a lab bench: runnable
project on a black laptop, printed report, fanned deck, viva cards.

> Overhead three-quarter product photograph on a matte black desk: a black laptop showing abstract code blocks, a thick printed report with unreadable grey text lines, a fanned 12-slide deck, and a small stack of black flash cards, arranged as one tidy kit. One acid-lime (#C8FF3D) paper tab and one thin lime rule as the only colour, soft top-left key light, cool rim light, deep black (#050506) background, fine grain, realistic paper and aluminium textures, 4:5, no hands, no faces, no logos, no legible text.

### 8.4 Product mockup 2 — ReportForge

Concept: loose pages aligning into a perfect bound report and matching deck —
the "formatting" transformation made physical.

> Macro still life on pure black: a scatter of loose white paper sheets mid-air, aligning into one crisp bound report on the right and a neat slide deck on the left, thin acid-lime (#C8FF3D) alignment guides and a single lime corner fold, soft top-left studio key, cool rim light, deep falloff, matte black surface, fine film grain, precise and calm, 4:5, no text, no logos, no hands.

### 8.5 Product mockup 3 — Viva Vault

Concept: a fanned deck of black question cards, one card lifted with a lime
edge, suggesting a question being pulled the night before viva.

> Dramatic close-up of a fanned deck of matte black flash cards on a black surface, one card lifted slightly and catching a thin acid-lime (#C8FF3D) edge light, abstract embossed glyphs instead of readable text, soft top-left key light, cool white rim, deep black (#050506) background, shallow depth of field, fine grain, premium and slightly tense mood, 4:5, no hands, no faces, no logos, no legible text.

### 8.6 OG image template (1200×630)

Concept: background art on the right third, a clean 55% left safe area for type
set in code (not baked into the image). Volt rule and Ember dot as brand marks.

> Wide 1200x630 social card background, pure black (#050506), the three frosted glass panes from the hero stacked small in the right third, one acid-lime (#C8FF3D) horizontal rule at 8 percent height, one tiny ember (#FF6B4A) dot at the rule's end, soft top-left key light, deep falloff, fine grain, large empty matte-black area on the left 55 percent for overlaid text, 16:9, no text, no logos, no people.

### 8.7 Loop video 1 — hero orbit

Concept: 6-second slow orbit around the glass stack; lime edge sweeps once.
Prompt generates the keyframe; camera move is added in the edit/animation step.

> Cinematic keyframe for a 6-second seamless loop: three frosted glass panes floating in a slow orbit against pure black (#050506), a single acid-lime (#C8FF3D) edge light sweeping across the middle pane, soft top-left key, cool rim, deep falloff, subtle floating dust, no text, no logos, no people, 9:16, ultra-realistic, consistent with a premium dark lab aesthetic.

### 8.8 Loop video 2 — product transformation

Concept: 6-second macro loop of loose pages sliding into a bound report, then
resetting; the demo *is* the ad (P7).

> Cinematic keyframe for a 6-second seamless macro loop on pure black: loose white paper sheets sliding across a matte black surface and snapping into one aligned bound report, thin acid-lime (#C8FF3D) alignment lines fading in and out, soft top-left studio key, cool rim light, deep falloff, fine grain, precise mechanical motion, 9:16, no hands, no faces, no text, no logos.

**Asset QA:** check palette share (Volt ≤ 10%, Ember ≤ 2%), no legible text, no
brands/faces, consistent key direction, and export AVIF/WebP + MP4/WebM under the
budgets in §9. Save prompts and outputs in `assets/prompts.md` in Phase 5.

## 9. Performance and accessibility budgets

### 9.1 JavaScript

| Budget | Limit |
|---|---|
| Lenis | ≤ 5 KB gzip |
| GSAP core + ScrollTrigger | ≤ 45 KB gzip |
| GSAP Flip (product grid only, lazy) | ≤ 8 KB gzip |
| **Motion total** | **≤ 58 KB gzip** |
| First-load JS, whole storefront | ≤ 180 KB gzip |
| Per-route JS | ≤ 130 KB gzip |
| Forbidden | Three.js, WebGL, second scroll library, icon-font runtime |

Load Flip only when the product grid mounts; import ScrollTrigger per route, not
globally. No animation library on checkout.

### 9.2 Images, fonts, video

| Asset | Budget |
|---|---|
| Hero AVIF/WebP | ≤ 160 KB mobile / ≤ 300 KB desktop; `srcset` 480/960/1440/1920 |
| Product mockups | ≤ 110 KB each at 4:5, AVIF first, WebP fallback |
| OG image | 1200×630, ≤ 180 KB |
| Video posters | ≤ 50 KB each |
| Home image weight | ≤ 250 KB above fold, ≤ 900 KB total mobile |
| Fonts | 2 families, ≤ 90 KB woff2 total; latin + latin-ext; 2 preloads; `swap` |
| Video loops | ≤ 1.5 MB each, 6–8s, 720p mobile / 1080p desktop, MP4 H.264 + WebM VP9, `preload="none"`, poster, one playing at a time |

Targets: Lighthouse mobile Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95;
LCP < 2.5s, CLS < 0.1, INP < 200ms. No layout shift from fonts, media, counters,
filter bars, or the sticky buy bar.

### 9.3 Phase 6 verification checklist

- [ ] Every text/background pair in §2.3 re-measured from the built CSS; AA pass.
- [ ] No text below 12px; body measure ≤ 68ch; line-height ≥ 1.5 for body.
- [ ] All interactive targets ≥ 44×44px; visible focus ring on every control.
- [ ] Full keyboard path: nav → filters → cards → buy → sheet → close → footer.
- [ ] `prefers-reduced-motion`: no Lenis, pin, scrub, marquee, tilt, autoplay;
      all content and CTAs present.
- [ ] `prefers-reduced-data`/Save-Data: posters only, no video preload.
- [ ] Images have width/height (or aspect-ratio), alt text, and correct `srcset`.
- [ ] Fonts self-hosted, subset, preloaded (2 max), no FOUT-driven CLS.
- [ ] One video playing at a time on mobile; all loops muted/`playsinline`.
- [ ] Contrast not used as the only error/success signal; icons + text present.
- [ ] Toasts `aria-live="polite"`; modal focus trap + restore; tabs arrow keys.
- [ ] No horizontal scroll at 360px; sticky buy bar clears `safe-area-inset`.
- [ ] Motion JS within §9.1; Lighthouse mobile meets §9.2 targets.
- [ ] No console errors; no layout shift from counters/filter/sort/toast.
- [ ] Policy copy reviewed: tools/templates, not ghost-writing; refund and
      delivery promises visible before checkout.

---

**Handoff to Phase 3 (build):** implement tokens as CSS custom properties +
Tailwind theme extension, self-host the two fonts, and ship sections in this
order: Hero → Products → Product detail → How it works → Projects service →
Social proof → FAQ → Footer. Do not add a second accent, a second scroll library,
or a section not specified here without a separate proposal.
