# Phase 01 — Stabilization Report

**Branch:** `feat/manjoor-phase01-stabilization`

## TypeScript — ZERO errors (Gate A: PASS)
Before: ~13 errors. After: **0** (`tsc -p tsconfig.app.json --noEmit`).

| Area | Fix |
|------|-----|
| `src/pages/Cart.tsx` (validate_coupon `Json`) | New `src/lib/json.ts` helpers (`asJsonRecord/asString/asNumber/asBoolean`) narrow the RPC result into the `Coupon` shape; no `any`. |
| `src/pages/TrackOrder.tsx` (get_order_status `Json`) | Same helpers + explicit `TrackedOrder` interface; `orderData` state typed. |
| `src/components/CapacitorAppWrapper.tsx` | Typed listener handles as `PluginListenerHandle` from `@capacitor/core`; cleanup calls `.remove()`. |
| `src/pages/AgentOrders.tsx` (TS2589 deep instantiation) | Embedded-relation select read via a default-schema client handle to sidestep recursive generated types; rows validated to `AgentOrderRow`. |

Root cause for most *lint* `any` also addressed at the contract level: `src/integrations/supabase/overrides.ts` declares the columns present in migrations but missing from the stale generated `types.ts` (regenerating requires the isolated DB — Phase 02).

## ESLint — partial (Gate A: NOT fully met)
Before: 145 errors + 9 warnings (154). After: **127 errors + 8 warnings**.

Fixed:
- `no-require-imports` (1): tailwind `require()` → ESM import.
- `no-empty-object-type` (2): `textarea.tsx`, `command.tsx` empty interfaces → type aliases.
- parse/binary (1): re-encoded generated `types.ts` UTF-16 → UTF-8.
- `react-hooks/exhaustive-deps` (1): `Profile.tsx` effect deps + `useCallback`.
- `no-explicit-any` (14 so far): `AgentOrders` (2), `Header` (7), `Profile` (5).

**Residual: 127 `@typescript-eslint/no-explicit-any` across 23 files + 8 `react-refresh/only-export-components` warnings** (shadcn `ui/*` variant exports + `FlyingCartAnimation`). See OPEN_RISKS for the remediation plan. No rule was globally disabled; `eslint.config.js` was intentionally **not** weakened (protected by policy).

## Build & dependencies (Gate A: PASS)
- `npm run build` (vite): **PASS**, 3474 modules, ~10 s, `dist/` emitted.
- No framework upgrades. Both lockfiles retained. No React/Vite/Supabase restructuring.

## Files added (stabilization)
- `src/lib/json.ts`, `src/lib/utils.ts` (`getErrorMessage`), `src/integrations/supabase/overrides.ts`.
