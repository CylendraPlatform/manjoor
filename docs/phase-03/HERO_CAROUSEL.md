# Homepage hero carousel

Stacked on PR #5 (`feat/manjoor-visual-excellence`).

## Public slides (enabled)

| Slide | Theme | Asset | Kind | Primary CTA |
|---|---|---|---|---|
| A | Craft | `/concepts/hero/craftsmanship.jpg` — conceptual lathe-process illustration | Conceptual | تقييم تصنيع |
| B | Custom | `/concepts/hero/custom-woodwork.jpg` — one lamp base from `lamp-bases.jpg` | Conceptual | دراسة حسب المقاسات |
| C | Décor | `/concepts/hero/decor-concepts.jpg` — conceptual interior-use scene | Conceptual | معرض الأفكار |

Public slide C is decorative concepts, not workshop merchandise. `photo/` and `VITE_ENABLE_WORKSHOP_PRODUCT_PROMO` stay unpublished/off. The hookah-stem mockup headline is design reference only.

## Carousel behaviour

- Full-width, HTML text and buttons, arrows, dots.
- Autoplay 7s, paused on hover/focus/control click.
- `prefers-reduced-motion`: no autoplay, no fade duration.
- Keyboard: Left = next (RTL), Right = previous. Ignored inside form fields.
- First image `fetchpriority=high`. Frames are 1920×900. Hero height is `min(68vh, 34rem)` with a light type panel, not a full walnut wash.

## Homepage below the hero

Typography inquiry paths (no repeated photo grid). Gallery remains `/custom-orders`.

## Image processing

Non-generative: crop, LANCZOS resize, slight contrast/color/sharpen, progressive JPEG. Originals in `public/concepts/*.jpg` and `photo/` were not overwritten.
