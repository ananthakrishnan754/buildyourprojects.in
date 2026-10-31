# Brand mark — B / forward chevron

**Concept (one sentence):** a vertical stem of two bars fused to a forward
chevron, so the mark reads simultaneously as a bold **B** (BuildYourProjects)
and a **play/forward** arrow — the "watch a reel, build a project" loop.

Source: ChatGPT (via `opencli chatgpt image`), Concept 3 of 3, chosen by the
owner 2026-10-31. Draft raster: `~/.paperclip/assets/byp-logo/concept-3-B-chevron.png`.
The shipped asset is hand-authored SVG geometry, not a bitmap trace.

## Files

| File | Use |
|---|---|
| `public/brand/logo-mark.svg` | Primary mark, Volt on transparent (dark surfaces) |
| `public/brand/logo-mark-inverted.svg` | Mark on a baked `#050506` plate |
| `public/brand/logo-mono.svg` | Single colour via `currentColor` (light + dark) |
| `public/brand/logo-wordmark.svg` | Horizontal lockup, mark + wordmark |
| `public/brand/alternates/mark-tiles.svg` | Concept 2 tiles — motion thumbnails / loading states only |
| `app/icon.svg` | Favicon, small-size optimised (thicker bars, wider gap) |
| `app/apple-icon.png` | 512×512 iOS icon |
| `public/brand/og-template.svg` | 1200×630 social card frame |

## Clear space and minimum size

- Clear space: **0.25 × mark height** on every side. Nothing crosses it.
- Minimum sizes: **16 px** digital, **8 mm** print for the mark alone.
- Wordmark lockup: minimum **96 px** wide digital; below that use the mark alone.

## Colour

- Primary: Volt `#C8FF3D` on `#050506`.
- Mono: `currentColor` — never recolour outside the design tokens.
- Do not put the Volt mark on a mid-tone (contrast collapses). Use the mono
  variant on light surfaces.

## Do

- Keep the stem bars and the chevron on the same optical baseline.
- Scale the SVG; never scale the raster draft.
- Pair the mark with Inter/Bricolage Grotesque type only.

## Don't

- No outlines, strokes, bevels or drop shadows.
- No rotation, skew or perspective.
- No gradients or two-colour recolouring of the chevron.
- Do not close the gap between the stem bars and the chevron: that gap is what
  keeps the "B" legible at 16 px.
- Do not use the tiles alternate as the primary logo; it is a secondary motion
  asset.

## Regenerating

Both concepts were produced with the prompts logged in `assets/prompts.md`.
Regenerate with `opencli chatgpt image "<prompt>"` while the browser bridge is
connected.
