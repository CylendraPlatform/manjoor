# Homepage hero carousel

Stacked on PR #5 (`feat/manjoor-visual-excellence`).

## Public slides (enabled)

| Slide | Theme | Asset | Kind | Primary CTA |
|---|---|---|---|---|
| A | Craftsmanship | `/concepts/hero/craftsmanship.jpg` from `candlesticks.jpg` | Conceptual illustration | `/custom-orders` |
| B | Custom woodwork | `/concepts/hero/custom-woodwork.jpg` from `vases-ornaments.jpg` | Conceptual illustration | `/request-quote` |

Slide C (`workshop-products`) is coded but **disabled**. `VITE_ENABLE_WORKSHOP_PRODUCT_PROMO` defaults false and the slide has no image path. `photo/` remains unpublished.

The attached UI mockup (hookah-stem headline «بكار أراكيل خشبي») is design reference only. That copy is not on the live site.

## Carousel behaviour

- Full-width, HTML text and buttons, arrows, dots.
- Autoplay 7s, paused on hover/focus/control click.
- `prefers-reduced-motion`: no autoplay, no fade duration.
- Keyboard: Left = next (RTL), Right = previous. Ignored inside form fields.
- First image `fetchPriority=high`, fixed 1920×980 to limit CLS.

## Homepage imagery (no four-photo repetition)

Hero uses candlesticks + vases. Spotlights use furniture-components, a typographic vessels card, and lamp-bases. The ten-concept gallery stays on `/custom-orders`.

## Image processing

Non-generative: crop, LANCZOS resize, slight contrast/color/sharpen, progressive JPEG. Originals in `public/concepts/*.jpg` and `photo/` were not overwritten.
