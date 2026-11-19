# Design system and components

Palette (existing tokens): Walnut `#5B3A27`, Warm Sand `#DCC6A3`, Brass `#B88946`, Charcoal `#2E2B28`. Typeface: Tajawal. Direction: RTL.

| Piece | Role |
|---|---|
| `MarketingShell` | Header, quote-count CTA, footer, floating WhatsApp |
| `BrandMark` | Official logo file, or the approved wordmark as text if the file is missing |
| `PlaceholderVisual` | Labeled gradient slot. Not a product photo |
| `Reveal` | Scroll fade; static when `prefers-reduced-motion` |
| `ContactFields` | Shared inquiry fields |
| `QuoteButton` | Adds a line to the quotation cart, not the purchase cart |
| `Lightbox` | Opens a real image URL |

Motion is a short CSS entrance (`.enter-soft`) plus the reveal helper. No extra animation library.

Missing launch assets are listed in `public/brand/README.md`.
