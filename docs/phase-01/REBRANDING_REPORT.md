# Phase 01 — Rebranding Report (MANJOOR)

## Canonical identity (src/config/brand.ts — single source of truth)
منجور / **MANJOOR** · slogan **فنّ الخشب العراقي** · Karbala, Iraq · Woodcraft, Décor & Manufacturing · internal app "MANJOOR Manufacturing OS". Trademark clearance **pending** — approved for internal development only, not public launch.

## Applied
- **Metadata:** `index.html` (title, description, Open Graph, favicon/apple-touch icon), `package.json` name → `manjoor-manufacturing-os`, `capacitor.config.ts` appName `MANJOOR`.
- **Central config:** `src/config/brand.ts`; `store.ts` and `bounty.ts` now derive from it.
- **Design tokens (centralized):** MANJOOR palette added in `src/index.css` and mapped in `tailwind.config.ts` as `manjoor.{walnut,sand,brass,charcoal}` — Walnut `#5B3A27`, Warm Sand `#DCC6A3`, Brass Gold `#B88946`, Charcoal `#2E2B28`. Replaced the unused legacy `dukany` color namespace. No app-wide redesign; semantic tokens preserved; no metallic gradients on body text.
- **Typography:** Tajawal (تجوال) was already imported and applied (`font-tajawal`); retained. No new font dependency. Logo lettering not retyped.
- **Arabic/RTL:** `index.html` keeps `lang="ar" dir="rtl"`; `html { direction: rtl }` preserved. No RTL regressions introduced by branding changes.
- **UI strings/logos:** Header, Footer, admin Login, Auth, AdminLayout, InternalOnly, Index hero, Offers, ProductDetail, OrderDetail receipts/WhatsApp messages.

## Package name
`package.json` `name` set to **`manjoor-manufacturing-os`**; `package-lock.json` name fields updated in sync (2 occurrences). Production build re-verified after the rename.

## Brand assets — OFFICIAL ARTWORK ABSENT (documented, not fabricated)
- No MANJOOR logo/icon file was provided to this task and none exists in the repo. **No logo was generated, redrawn, or substituted** (and no Dukany/Bounty icon was repurposed).
- Created `public/brand/` + `README.md` specifying the exact required files (`manjoor-logo-horizontal.png`, `manjoor-icon.png`) and specs (transparent PNG, ≥1024² icon). All logo slots and `index.html` reference these ready paths; they render a broken image until the official files are supplied (the referenced legacy files were already missing, so this is not a new regression).

## Not done (by rule)
- Native bundle id rename (`com.dukany.store`/`com.sabaa.store` → `com.manjoor.*`) deferred — requires native project regeneration via `cap sync`.
- No fabricated contact info, domains, business registration, or social profiles.
