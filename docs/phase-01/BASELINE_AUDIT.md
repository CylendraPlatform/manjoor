# Phase 01 — Baseline Audit

**Date:** 2026-11-19
**Branch:** `feat/manjoor-phase01-stabilization` (from `main` @ `b701a8568d79508a4545092c97559d93f5ae1908`)
**Recorded before any stabilization/rebranding edits.**

## Git state
- Working tree clean at branch creation. Remote `origin` = `https://github.com/CylendraPlatform/manjoor.git`.
- `main` @ `b701a85` (256 tracked files) is the published baseline.

## Framework & dependency versions (from package.json / lockfiles)
| Area | Version |
|------|---------|
| React / React DOM | ^18.3.1 |
| Vite | ^5.4.19 |
| TypeScript | ^5.8.3 |
| @supabase/supabase-js | ^2.95.3 |
| Capacitor core/CLI | core ^8.1.0 / cli ^7.5.0 |
| Tailwind CSS | ^3.4.17 |
| Zustand | ^5.0.11 |
| Vitest | ^3.2.4 |

Package manager: npm (`package-lock.json`) present; `bun.lockb` also committed. No framework upgrades performed in Phase 01.

## Route architecture (src/App.tsx)
- **Public routes** (`/`, `/products`, `/cart`, `/offers`, `/product/:slug`, `/checkout`, `/thank-you`, `/privacy`, `/support`, `/auth`, `/profile`, `/category/:slug`, `/track-order`, `/wishlist`) are wrapped by `publicPage()`, which renders `<InternalOnly/>` unless `publicSalesEnabled` (`VITE_ENABLE_PUBLIC_SALES === "true"`, default **false**).
- **Admin routes** (`/admin`, `/admin/login`, `/admin/orders`, `/admin/orders/:id`, `/admin/products`, `/admin/products/new`, …) via `AdminLayout`.
- **Agent route** (`/agent-orders`) for delivery agents.
- Router: `BrowserRouter` on web, `HashRouter` in the Capacitor native shell.

## Supabase integration
- `src/integrations/supabase/client.ts` reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`; throws if missing/placeholder. No service-role key in client.
- `src/integrations/supabase/types.ts`: generated types, shipped as **UTF-16** (ESLint could not parse it).
- ~45 migrations under `supabase/migrations/`, incl. P0 lockdown `20261116000100_bounty_p0_stock_and_lockdown.sql` (revokes public order RPC EXECUTE; atomic `bounty_adjust_stock`). **None applied/verified against a live DB in this phase.**
- Edge functions: `create-agent-user` (uses `SUPABASE_SERVICE_ROLE_KEY` from `Deno.env`, server-side), `notify-order`.

## Tests & scripts (baseline)
- `npm test` (vitest): 1 test (`src/test/example.test.ts`) — pass.
- `npm run test:p0` (node smoke): 4 structural checks.
- `npm run lint`, `npm run build`, `npm run dev`, Capacitor scripts.

## Baseline verification results
| Check | Result |
|-------|--------|
| `tsc -p tsconfig.app.json --noEmit` | **~13 errors** (Cart/TrackOrder `Json` access, Capacitor listener type, AgentOrders TS2589) |
| `npm run lint` | **154 problems** — 145 errors (141 `no-explicit-any`, 2 `no-empty-object-type`, 1 `no-require-imports`, 1 parse/binary), 9 warnings (8 `react-refresh`, 1 `react-hooks/exhaustive-deps`) |
| `npm run build` (vite) | **PASS** (3474 modules) |
| `npm test` (vitest) | **PASS** (1/1) |
| `npm run test:p0` | 3/4 (the "`.env` absent" check fails because a local gitignored `.env` exists) |

## Security concerns (baseline)
- Public commerce gating is **client-side only**; DB-side RPC revocation/RLS unverified (no isolated DB).
- Stale generated types force `(x as any)` access to real columns across admin pages.
- Local `.env` present (gitignored, never committed).

## Remaining Dukany/Bounty naming & assets (baseline)
- Brand strings/logos in index.html, Header, Footer, Auth, admin Login, AdminLayout, InternalOnly, Index, Offers, ProductDetail, OrderDetail, config/store.ts, config/bounty.ts.
- Logo asset files referenced (`/dukany-logo.png`, `/dukany-icon-only.png`) **do not exist** in `public/`.
- Native identifiers: `com.dukany.store` (capacitor), `com.sabaa.store` (Android MainActivity).
- Private Dukany PDFs folder `مستندات متجر دكاني/` is gitignored (not published).

## Known functional limitations (baseline)
- Manufacturing, commissions, B2B, AI features not implemented (out of Phase 01 scope).
- Inventory adjustment depends on `bounty_adjust_stock` RPC being installed on the target DB.
