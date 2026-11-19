# Bounty Manufacturing OS — P0 implementation report
Date: 2026-11-16 | Basis: user-uploaded `dukany.zip` | Status: **PARTIAL — G0 NOT PASSED**

## Actual changes performed
- Created independent working copy: `Bounty_Manufacturing_OS`, leaving the uploaded source archive unchanged.
- Integrated the prior 10-file `Bounty_Project_Control_Pack` into `docs/Bounty_Project_Control_Pack` equivalent **folder contents at `docs/`** (includes governance, PRD, architecture, database plan, execution, QA and operations).
- Set project name and working internal-facing Bounty identity; removed Dukany phone/social links from `src/config/store.ts`.
- Added `AGENTS.md`, `CLAUDE.md` for implementation instructions.
- Removed the original `.env` from the copy, added `.env.example` with placeholders only. Client now rejects missing/unconfigured Supabase environment values. Original DB has NOT been accessed or altered.
- Removed unused legacy one-off CJS scripts that could issue writes/queries to the previous store's database (source archive retained).
- Wrapped all public routes including checkout and courier portal in a default-disabled internal-only gate; `/admin/login` and protected admin routes remain accessible. This is client-side UX gating; it is **not** adequate by itself to disable remote DB write APIs.
- Changed manual admin inventory adjustment to use `bounty_adjust_stock` RPC instead of separate stock update and movement insert.
- Created `supabase/migrations/20261116000100_bounty_p0_stock_and_lockdown.sql` (NOT APPLIED): revokes PUBLIC/anon/authenticated invocation of recognized public order RPCs and implements atomic stock adjustment via a DB transaction, row lock, staff role check and RLS (`SECURITY INVOKER`). Existing legacy RPCs/policies and all migrations must be reviewed before deploying to a new DB.
- Added `scripts/p0-smoke.mjs`, a dependency-free static smoke test and package script `npm run test:p0`.

## Verification performed
| Command | Actual outcome |
| --- | --- |
| `node --test scripts/p0-smoke.mjs` | **PASS** 4/4 lightweight structural smoke tests |
| `npm ci --offline --ignore-scripts` | **BLOCKED** — npm cache incomplete (`zustand` package missing) |
| `npm ci --ignore-scripts` | **BLOCKED/TIMED OUT** — dependencies could not be installed in tool execution window |
| `tsc --noEmit -p tsconfig.app.json` | **NOT PASSED** — missing `vitest/globals` definitions because dependencies incomplete |
| `npm test -- --run` | **NOT RUN successfully** — `vitest` binary missing |
| `npm run build` | **NOT VERIFIED** — dependencies not installed |
| SQL migration against Bounty staging | **NOT APPLIED/NOT TESTED** — no isolated Supabase instance connected |
| Real admin session, order lifecycle, RLS, performance, native app | **NOT TESTED** |

**Important:** Static smoke tests check source-level safeguards only. They do not demonstrate deployed security, correct database migrations, or a working web build.

## G0 blockers / material risks
1. Provision a *new* Supabase project, review the full legacy Dukany migrations and any collisions, apply reviewed migrations, then test RLS and exposed RPCs from anonymous/authenticated sessions. Never point this copy at the original Dukany DB.
2. Confirm the new `bounty_adjust_stock` RPC is installed before using inventory adjustment; otherwise the UI will display an error, not silently update stock.
3. Audit other publicly exposed order mechanisms besides `place_order` and `create_order`. Revoking recognized RPCs is not a comprehensive substitute for RLS checks. Never enable `VITE_ENABLE_PUBLIC_SALES` before separate backend shutdown/approval checks.
4. Review all legacy admin roles, access checks, multiple order placement RPC definitions, reported stock non-atomicity elsewhere, cash collection and coupon flows.
5. Install dependencies, run full `npm test`, `npm run lint`, `npm run build` and E2E/RLS tests; remediate any failures.
6. Android/iOS package IDs, launch images, and original Dukany marketing text may still exist; the new deliverable is **not** ready for external publication or app distribution.
7. Document explicit product/legal approvals before enabling regulated product listings, campaigns, affiliate promotions, messaging outreach or public checkout.
8. Review cost/margin input definition and financial ledger model before implementing commissions. Original user-provided 40–50% is a reported margin, not validated by accounting records.
9. Determine whether source `.env` credentials require rotation; no values were carried to the output copy. Do not publish the original source archive with its `.env`.

## Next approved execution sequence (not yet completed)
- G0.1: New isolated Supabase + review baseline migration order/RLS
- G0.2: Install dependencies and verify clean build/lint/test
- G0.3: Test backend public order lockdown and atomic inventory adjustment
- G0.4: Accept staging gate, then implement P1 B2B customers, product variants and manual orders
- G1: Cost accounting, production orders, receivables, commissions and provincial profitability, after measured baseline

## Scope note
This is a direct modification of a **copy** of the submitted code with embedded documentation, not a production-ready Bounty platform or deployment. Original `dukany.zip` and original Muzn GitHub repo were not modified.
