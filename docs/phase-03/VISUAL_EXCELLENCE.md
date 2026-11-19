# Visual excellence and conversion — QA

Branch `feat/manjoor-visual-excellence`, stacked on `feat/manjoor-concept-gallery` (PR #4).

## Before / after

Before: homepage hero and several sections were empty walnut gradient blocks labeled as waiting for photos. Gallery cards reused four collection images with the long legal label on every card. WhatsApp showed «قيد التهيئة».

After (same viewports):

| Viewport | Homepage | Custom orders |
|---|---|---|
| 1280×800 | `docs/phase-03/qa/home-desktop-1280x800.png` | `docs/phase-03/qa/custom-orders-desktop-1280x800.png` |
| 360×740 | `docs/phase-03/qa/home-mobile-360x740.png` | `docs/phase-03/qa/custom-orders-mobile-360x740.png` |

## Sections changed

- Homepage hero: conceptual woodturning image + requested Arabic headline and CTAs.
- Homepage concept teaser: three distinct ideas (candlesticks, lamp bases, furniture legs).
- Offering direction cards: crop/collection illustrations instead of empty category slots.
- Empty catalog: short notice + inquiry CTAs; no fake products.
- Workshop: text + three-step process; no fake workshop photography.
- Removed the six-slot «معرض» placeholder grid.
- Custom-order gallery: grouped cards, 4:3 crops, short badge, one disclaimer.
- About: mosaic of concept images, captioned as illustration.
- WhatsApp: hidden when `brand.contact.whatsapp` is empty.
- Mobile: sticky inquiry CTAs on the homepage.

## Images and classification

All from the approved concept ZIP, labeled illustrative — not workshop photos and not inventory:

- Hero: `public/concepts/hero-woodturning.jpg` (same source as candlesticks).
- Card crops: `public/concepts/crops/*.jpg` from collection files 01, 02, 03, 05.
- Full collections remain for the custom-manufacturing direction card.

No genuine workshop photographs were available. Hookah `photo/` files stay unpublished.

## Conversion

- Primary actions: view concepts, request custom manufacturing, wholesale quote, contact.
- Concept CTA still goes to `/custom-orders?concept=…#custom-inquiry` and prefills the form.
- Click ≠ lead. Save still uses `submit_quote_request`.
- Prefill verified for `lamp-bases`.

## QA

- TypeScript 0, ESLint 0, 14 files / 46 tests, production build 0.
- 360px: `scrollWidth` 345, no horizontal overflow. Indexing `noindex,nofollow`. No public WhatsApp control. Direct checkout flag unchanged (`VITE_ENABLE_PUBLIC_SALES=false`).
- `robots` remains closed. Regulated catalog filter unchanged.

## Remaining asset blockers

- No approved workshop photography.
- No public-approved product SKUs.
- WhatsApp number still unset (hidden, not invented).
- Individual concept types still await workshop maker-approval as orderable capacity.
