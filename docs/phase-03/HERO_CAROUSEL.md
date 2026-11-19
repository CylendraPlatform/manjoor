# Homepage hero carousel

Stacked on PR #5 (`feat/manjoor-visual-excellence`).

## Public slides (enabled)

| Slide | Theme | Asset | Kind | Primary CTA |
|---|---|---|---|---|
| A | Production | `/workshop/hero/production.jpg` from `photo/manjoor (3).jpg` in a studio frame | Workshop photo | استعرض الإنتاج |
| B | Craft | `/workshop/hero/craft.jpg` | Conceptual lathe | اقرأ عن الورشة |
| C | Custom | `/workshop/hero/custom.jpg` | Conceptual interior | استعرض الأفكار |

Slide A is the commercial lead. Originals stay in gitignored `photo/`; published frames are processed copies under `public/workshop/`.

## Carousel behaviour

- Full-width, HTML text and buttons, arrows, dots.
- Autoplay 7s, paused on hover/focus/control click.
- `prefers-reduced-motion`: no autoplay, no fade duration.
- Keyboard: Left = next (RTL), Right = previous. Ignored inside form fields.
- First image `fetchpriority=high`. Frames are 1920×900. Hero height is `min(68vh, 34rem)` with a light type panel, not a full walnut wash.

## Homepage below the hero

Bakarat product cards first. Custom-order concept gallery is secondary at `/custom-orders`.

## Image processing

Non-generative: crop, LANCZOS resize, slight contrast/color/sharpen, progressive JPEG. Originals in `public/concepts/*.jpg` and `photo/` were not overwritten.
