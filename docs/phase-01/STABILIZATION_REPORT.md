# Phase 01 — Stabilization Report

**Branch:** `feat/manjoor-phase01-stabilization`

## TypeScript — ZERO errors (Gate A: PASS)
Before: ~13 errors. After: **0** (`tsc -p tsconfig.app.json --noEmit`).

| Area | Fix |
|------|-----|
| `Cart.tsx` / `TrackOrder.tsx` (RPC `Json`) | `src/lib/json.ts` helpers narrow results into explicit shapes; no `any`. |
| `CapacitorAppWrapper.tsx` | Listener handles typed `PluginListenerHandle`; cleanup calls `.remove()`. |
| `AgentOrders.tsx` (TS2589) | Embedded-relation select read via default-schema client handle; rows validated to `AgentOrderRow`. |

## ESLint — ZERO errors, ZERO warnings (Gate A: PASS)
Before: 145 errors + 9 warnings (154). After: **0 errors + 0 warnings**.

Resolution by category:
- `no-explicit-any` (141 → 0): rewired to accurate Supabase types. Introduced `src/integrations/supabase/overrides.ts` (schema contract for columns present in migrations but missing from the stale generated `types.ts`), `src/integrations/supabase/db.ts` (a default-schema client handle for tables/columns not yet in the generated types — e.g. `loyalty_settings`, `orders.agent_id/admin_notes`, `categories.parent_id`), `src/lib/json.ts` (RPC `Json` narrowing) and `getErrorMessage` (unknown-error narrowing). Explicit row interfaces and type guards elsewhere. Surfaced and fixed two latent type gaps the `any` had masked: the stale `coupons` type (`value`/`min_order_amount`) and an order-items `Json` column.
- `no-require-imports` (1 → 0): tailwind `require()` → ESM import.
- `no-empty-object-type` (2 → 0): empty interfaces → type aliases (`textarea`, `command`).
- parse/binary (1 → 0): re-encoded generated `types.ts` UTF-16 → UTF-8.
- `react-hooks/exhaustive-deps` (1 → 0): `Profile.tsx` effect deps + `useCallback`.
- `react-refresh/only-export-components` (8 → 0): extracted `buttonVariants`/`toggleVariants` to sibling `*-variants` modules (repointed `alert-dialog`, `calendar`, `pagination`, `toggle-group`); dropped unused non-component exports (`badgeVariants`, `navigationMenuTriggerStyle`, `useFormField`, `useSidebar`, sonner `toast`), and moved `triggerCartAnimation` to `src/lib/cart-animation.ts`.

`eslint.config.js` was **not** modified or weakened (it is policy-protected); every fix is in source. No rule was globally disabled; no blanket ignores were added.

## Build & dependencies (Gate A: PASS)
- `npm run build` (vite): **PASS**, 3474 modules, `dist/` emitted. No framework upgrades; both lockfiles retained.

## Files added (stabilization)
`src/lib/json.ts`, `src/lib/cart-animation.ts`, `src/integrations/supabase/overrides.ts`, `src/integrations/supabase/db.ts`, `getErrorMessage` in `src/lib/utils.ts`, and `src/components/ui/{button,toggle}-variants.ts`.
