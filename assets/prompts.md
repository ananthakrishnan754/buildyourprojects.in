# Asset prompts log

Every generated asset records its exact prompt, tool, date and output path so it
can be reproduced. Rule: no copyrighted logos, no real people's faces.

## Brand mark — Concept 3 (CHOSEN)

- Tool: `opencli chatgpt image` (ChatGPT web, 2026-10-31)
- Output: `~/.paperclip/assets/byp-logo/concept-3-B-chevron.png`
- Prompt:
  > Ultra-minimal flat vector logo mark for BuildYourProjects, an engineering
  > college-projects brand. Concept: a bold abstract letterform built from two
  > thick vertical bars and a forward chevron that together read as a 'B' and as
  > a play/forward arrow at once. Uniform heavy stroke weight, square terminals,
  > clever negative space, single acid-lime #C8FF3D on near-black #050506, no
  > second colour. Perfectly centered, generous padding, designed as a favicon
  > that survives 16px. No text, no words, no 3D, no gradients, no shadows, no
  > mockup, no photorealism.
- Shipped as: `public/brand/logo-mark.svg` (hand-authored geometry).

## Brand mark — Concept 2 (secondary / motion)

- Tool: `opencli chatgpt image` (ChatGPT web, 2026-10-31)
- Output: `~/.paperclip/assets/byp-logo/concept-2-tiles.png`
- Prompt:
  > Ultra-minimal flat vector logo mark for BuildYourProjects, a student
  > engineering-projects brand. Concept: three solid geometric tiles stepping
  > diagonally upward to form an arrow of progress; the top tile is ember-orange
  > #FF6B4A, the other two are acid-lime #C8FF3D, all on near-black #050506.
  > Solid shapes only, no outlines, no internal detail, generous negative space,
  > perfectly centered square, must stay crisp and readable at 16px. No text, no
  > letters, no 3D, no perspective, no gradients, no shadows, no mockup.
- Shipped as: `public/brand/alternates/mark-tiles.svg`.

## Brand mark — Concept 1 (rejected)

- Output: `~/.paperclip/assets/byp-logo/` — blueprint sheet + chevron fold.
  Rejected: too much internal detail, dies at 16 px.

## Hero / product imagery

- Not yet generated. Owned by the asset phase; prompts must be appended here
  before any file lands in `public/`.

## Phase 5 — hero and product mockups (2026-11-01)

Generated with the OpenCLI browser bridge (Gemini + ChatGPT web). Originals in
`assets/generated/` (gitignored); shipped WebP/AVIF in `public/media/`.

| Asset | Tool | Output | Size |
|---|---|---|---|
| `hero-workbench` | `opencli chatgpt image` | `assets/generated/hero-workbench.png` | 1672×941 → 1600×900 WebP 44 KB |
| `product-submission-kit` | `opencli chatgpt image` | `assets/generated/product-submission-kit.png` | 1122×1402 → 1100×1375 WebP 72 KB |
| `product-reportforge` | `opencli chatgpt image` | `assets/generated/product-reportforge.png` | 1122×1402 → 1100×1375 WebP 56 KB |
| `product-viva-vault` | `opencli chatgpt image` | `assets/generated/product-viva-vault.png` | 1122×1402 → 1100×1375 WebP 72 KB |

Prompt — hero:
> Ultra-dark abstract 3D render, 16:9 wide, for a student engineering-projects
> brand: a matte black workbench seen at a low angle, a rolled technical
> blueprint sheet, a floating slab of smoked glass, and thin acid-lime #C8FF3D
> light strips tracing a circuit path, one small ember-orange #FF6B4A glow.
> Near-black #050506 background, cinematic rim light, shallow depth of field,
> large empty area on the right for headline text, no text, no logos, no people,
> no watermark, no UI.

Prompt — Submission Kit mockup:
> Dark product mockup, vertical 4:5: a matte black desk with an open laptop
> showing an abstract code editor, a printed IEEE-style technical report with a
> robot schematic, and a small stack of slide cards, thin acid-lime #C8FF3D
> accent light along the page edges, ember-orange #FF6B4A detail on a pen.
> Near-black #050506 background, soft top light, shallow depth of field, no
> readable text, no logos, no people, no watermark, no UI chrome.

Prompt — ReportForge mockup:
> Dark product mockup, vertical 4:5: a floating smoked-glass panel showing an
> abstract document being reformatted into neat columns and a small slide grid,
> acid-lime #C8FF3D selection highlights, one ember-orange #FF6B4A cursor line.
> Matte black desk, near-black #050506 background, calm directional light, no
> readable text, no logos, no people, no watermark.

Prompt — Viva Vault mockup:
> Dark product mockup, vertical 4:5: a fanned deck of matte black flash cards
> with faint acid-lime #C8FF3D index tab edges and one ember-orange #FF6B4A tab,
> lying on a dark grid surface with a subtle lime glow underneath. Near-black
> #050506 background, top light, no readable text, no logos, no people, no
> watermark.

### Background removal

Attempted via OpenCLI + a website (Photoroom's free remover): the file input was
found and the upload succeeded through the browser bridge, but the free flow did
not expose a downloadable cutout without an account, so no cutout shipped. None
of the shipped assets need one — they are used full-bleed behind CSS masks. Record
the account/tool here if cutouts are added later.
