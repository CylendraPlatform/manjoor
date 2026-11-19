# Phase 01 — Legacy Reference Audit (Dukany / Bounty)

Classification: **A** replace with MANJOOR · **B** historical technical reference (preserve/label) · **C** legacy content (remove/isolate) · **D** DB identifier / migration dependency (do not rename blindly).

## Application branding → replaced with MANJOOR (class A)
| Location | Before | After |
|----------|--------|-------|
| index.html title/description/OG/icons | "متجر متجر دكاني \| All for You", `/dukany-icon-only.png` | MANJOOR title/desc/OG, `/brand/manjoor-icon.png` |
| src/config/store.ts | brand باونتي / Bounty | MANJOOR (via `brand.ts`) |
| src/config/bounty.ts `workingName` | باونتي — إدارة المعمل | منجور — نظام إدارة التصنيع |
| src/components/Header.tsx | `/dukany-logo.png` alt متجر دكاني | `/brand/manjoor-logo-horizontal.png` alt منجور MANJOOR |
| src/components/Footer.tsx | `/dukany-icon-only.png` | `/brand/manjoor-icon.png` |
| src/components/AdminLayout.tsx | باونتي \| إدارة المعمل | منجور \| نظام إدارة التصنيع |
| src/pages/InternalOnly.tsx | باونتي — نظام إدارة المعمل | منجور — نظام إدارة التصنيع |
| src/pages/admin/Login.tsx, src/pages/Auth.tsx | `/dukany-logo.png` | `/brand/manjoor-logo-horizontal.png` |
| src/pages/Index.tsx | hero "متجر دكاني", alt "dukany Product" | "منجور", "MANJOOR Product" |
| src/pages/Offers.tsx, ProductDetail.tsx, admin/OrderDetail.tsx | receipt/WhatsApp "متجر دكاني" | "منجور" |
| src/integrations/supabase/client.ts | "Bounty staging requires…" | MANJOOR config error text |
| .env.example | "…for Bounty" | "…for MANJOOR" |
| capacitor.config.ts appName | "dukany Store" | "MANJOOR" |

## Historical technical references → preserved & labelled (class B)
- `src/config/bounty.ts` filename and `bounty` export — intermediate codename kept as a stable module name; display value is MANJOOR.
- `src/pages/admin/Inventory.tsx` comment "Bounty P0 migration".
- README.md (original Dukany), README_BOUNTY.md, docs/* planning pack, docs/GITHUB_MIGRATION_REPORT.md — origin/history, retained.
- `src/config/brand.ts` doc comment explaining Dukany→Bounty→MANJOOR lineage.

## Database identifiers / migration dependencies → NOT renamed (class D)
- RPC `bounty_adjust_stock` (migration + `src/pages/admin/Inventory.tsx`): kept as internal compatibility name. A rename must be coordinated across client calls, DB function signature, grants, RLS, migrations, generated types, and tests (deferred — see OPEN_RISKS).
- `supabase/migrations/**`: left immutable (no global search-replace). The `$bounty$` dollar-quote tag and filename prefix are historical.
- Native bundle ids `com.dukany.store` / `com.sabaa.store`: renaming requires regenerating native projects (deferred Phase 02).

## Legacy content / example data (class C)
- Seed/demo product migrations ("hyderon", unsplash demo images) left intact (historical migrations, immutable). No isolation needed for Phase 01.

## No fabricated business information
- Contact/phone/social/domain fields remain **empty placeholders** in `src/config/brand.ts` / `store.ts`. Nothing invented.
