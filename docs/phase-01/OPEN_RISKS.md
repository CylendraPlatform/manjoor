# Phase 01 — Open Risks & Deferred Items

## BLOCKERS / must-resolve before "ready"
1. **ESLint not zero (Gate A).** 127 `@typescript-eslint/no-explicit-any` across 23 files + 8 `react-refresh/only-export-components` warnings remain.
   - Root cause for most `any`: the generated `src/integrations/supabase/types.ts` is **stale** (missing columns added by later migrations). The correct fix is to regenerate it via `supabase gen types typescript` against the **isolated MANJOOR database** — which is not available in this environment and must never point at Dukany. `src/integrations/supabase/overrides.ts` already captures the missing contract from the migration DDL; remaining files should be rewired to the override types + `getErrorMessage`/`json.ts` helpers (mechanical).
   - Highest-count files: `Category.tsx` (20), `admin/OrderDetail.tsx` (16), `Index.tsx` (15), `admin/Loyalty.tsx` (12), `admin/ProductForm.tsx` (11), `Checkout.tsx` (7), `admin/Agents.tsx` (7), `admin/Dashboard.tsx` (7), `admin/Coupons.tsx` (6), `Auth.tsx` (5).
   - `react-refresh` warnings are in vendored shadcn `ui/*` (variant/hook co-exports) + `FlyingCartAnimation`; `eslint.config.js` is protected and was not weakened, so the sanctioned fix is extracting variant constants to sibling modules.

## Security — unverified (no isolated DB)
2. Public-sales gating is **client-side only**. The P0 migration (`20261116000100_bounty_p0_stock_and_lockdown.sql`) revokes EXECUTE on `place_order`/`create_order`/`create_public_order_with_items` and defines atomic `bounty_adjust_stock` (SECURITY INVOKER, explicit admin check, row lock) — **but it has not been applied or tested against any database in this phase**. RLS/RPC privilege boundaries must be validated from anon/customer/agent/admin sessions on the isolated DB before any public exposure.
3. Other public order entry points beyond the three revoked RPCs must be audited on the DB.

## Deferred (safe, scoped)
4. Native bundle-id rename `com.dukany.store` / `com.sabaa.store` → `com.manjoor.*` (requires `cap sync` native regeneration; Android `MainActivity` package move; iOS bundle id).
5. `bounty_adjust_stock` RPC rename to a neutral MANJOOR name — only as a coordinated change across client, DB signature, grants, RLS, migrations, generated types, and tests. Kept as compatibility name for now.
6. Official MANJOOR logo/icon artwork to be dropped into `public/brand/` (see its README). Until then, logo slots show a broken image.
7. `npm ci` clean-install reproducibility to be confirmed in CI.
8. Bundle size: single JS chunk ~1.26 MB (gzip ~357 kB) — code-splitting is a future optimization (not a Phase-01 goal).

## Pre-existing (not introduced here)
9. Seed/demo data and historical migrations retained verbatim (immutable history).
