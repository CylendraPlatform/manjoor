# MANJOOR brand assets

Drop the **approved, official** MANJOOR artwork here. The application already
references these exact paths (see `src/config/brand.ts`, `index.html`,
`src/components/Header.tsx`, `src/components/Footer.tsx`, auth/login screens).

> ⚠️ Do **not** generate, redraw, approximate, or repurpose a Dukany/Bounty icon
> as MANJOOR. These files must be the official source artwork supplied by the
> brand owner. Until they are added, the app's logo slots will render a broken
> image (no fabricated logo is shipped).

## Required files

| File | Purpose | Notes |
|------|---------|-------|
| `manjoor-logo-horizontal.png` | Header + footer + login/auth wordmark | Horizontal composition: woodturned emblem, thin vertical divider, then the wordmark. Transparent background. |
| `manjoor-icon.png` | Favicon, apple-touch-icon, square app icon | Square, ≥ 1024×1024, transparent background. |

## Canonical identity (for reference — see `src/config/brand.ts`)

- Arabic wordmark: **منجور**
- English wordmark: **MANJOOR**
- Arabic slogan: **فنّ الخشب العراقي**
- Origin: كربلاء، العراق (Karbala, Iraq)
- Palette: Walnut `#5B3A27` · Warm Sand `#DCC6A3` · Brass Gold `#B88946` · Charcoal `#2E2B28`

## Photography slots (supplied later, never generated)

| File | Purpose | Suggested size |
|------|---------|----------------|
| `hero-workshop.jpg` | Homepage hero | 1600×1200 |
| `gallery-turning.jpg` | Woodturning | 1200×900 |
| `gallery-finishing.jpg` | Finishing | 1200×900 |
| `gallery-finished.jpg` | Finished piece | 1200×900 |

Until these exist, the site shows labeled placeholders and must not present them as workshop output.

## After adding the files

- Native app icons regenerate from the square icon via `npm run cap:icons`
  (see `RUNBOOK.md`).
- Preserve image proportions and transparency; a PNG is not a vector — do not
  rename it to `.svg`.
