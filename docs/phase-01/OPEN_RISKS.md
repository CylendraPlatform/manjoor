# Phase 01 — Open Risks & Deferred Items

## Code quality — RESOLVED
- ESLint: **0 errors, 0 warnings** (was 145/9). TypeScript: **0 errors**. Production build passes; 14/14 unit tests and 5/5 P0 smoke tests pass. `eslint.config.js` was not weakened.

## Security — UNVERIFIED (no isolated DB) — still open
1. Public-sales gating is **client-side only**. The P0 migration (`20261116000100_bounty_p0_stock_and_lockdown.sql`) revokes EXECUTE on `place_order`/`create_order`/`create_public_order_with_items` and defines atomic `bounty_adjust_stock` (SECURITY INVOKER, explicit admin check, row lock) — **but it has not been applied or tested against any database in this phase**. RLS/RPC privilege boundaries must be validated from anon/customer/agent/admin sessions on the isolated MANJOOR DB before any public exposure.
2. Audit other public order entry points beyond the three revoked RPCs on the DB.

## Deferred (safe, scoped)
3. Regenerate `src/integrations/supabase/types.ts` via `supabase gen types typescript` against the isolated MANJOOR DB. This will retire `overrides.ts` and the `db` default-schema handle (interim contracts built from migration DDL) and confirm the stale `coupons` columns (`value`/`min_order_amount`). Must never point at Dukany.
4. Native bundle-id rename `com.dukany.store` / `com.sabaa.store` → `com.manjoor.*` (requires `cap sync` native regeneration; Android `MainActivity` package move; iOS bundle id).
5. `bounty_adjust_stock` RPC rename to a neutral MANJOOR name — only as a coordinated change across client, DB signature, grants, RLS, migrations, generated types, and tests. Kept as compatibility name.
6. Official MANJOOR logo/icon artwork to be dropped into `public/brand/` (see its README). Until then, logo slots show a broken image.
7. Confirm `npm ci` clean-install reproducibility in CI.
8. Bundle size: single JS chunk ~1.26 MB (gzip ~357 kB) — code-splitting is a future optimization (not a Phase-01 goal).

## Pre-existing (not introduced here)
9. Seed/demo data and historical migrations retained verbatim (immutable history).

## Operational readiness note
Code-quality gates are closed, but **full operational readiness is NOT claimed**: database/RLS behavior is unverified (no isolated DB) and official brand artwork is missing. These are the remaining Phase-01 → Phase-02 dependencies.
