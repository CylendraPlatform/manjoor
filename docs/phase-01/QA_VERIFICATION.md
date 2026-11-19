# Phase 01 — QA Verification

All results below were **actually executed** on branch `feat/manjoor-phase01-stabilization`. Verification types are kept distinct (unit test ≠ static analysis ≠ build ≠ DB/RLS).

## Verification gates (final)
| Command | Result | Notes |
|---------|--------|-------|
| `npx tsc -p tsconfig.app.json --noEmit` | **PASS — 0 errors** | was ~13 |
| `npm run lint` | **PASS — 0 errors, 0 warnings** | was 145 errors / 9 warnings |
| `npm test` (vitest) | **PASS — 14/14** | 1 pre-existing + 13 added |
| `npm run test:p0` | **PASS — 5/5** | env check reworked to be deterministic (see below) |
| `npm run build` (vite) | **PASS** | 3474 modules; `dist/` emitted |
| `npm ci` | **recommended in CI** | build/tests ran against the lockfile-pinned install; a clean `npm ci` should confirm reproducibility in CI |

## P0 smoke-test fix
The former check `original credentials absent from working tree` asserted `.env` does not exist on disk, so a developer's harmless, **gitignored** local `.env` failed it. Replaced with two deterministic checks that detect *actual* exposure without depending on local config:
1. **`no environment file is tracked by git`** — `git ls-files .env .env.local .env.*.local .env.production` must be empty (catches a committed env file).
2. **`environment files are gitignored and the example holds no real secrets`** — `.gitignore` must exclude `.env` / `.env.*.local`, and `.env.example` must contain no real Supabase URL, `sb_` key, or JWT.

## Automated tests (deterministic unit tests)
- `src/lib/format.test.ts` — Iraqi dinar formatting.
- `src/lib/json.test.ts` — Supabase `Json` narrowing incl. coupon access pattern.
- `src/lib/utils.test.ts` — `getErrorMessage` across Error / string / PostgREST / unknown.
- `src/test/example.test.ts` — pre-existing.

## Gate summary
- **Gate A (Code Quality):** TypeScript 0 ✅; ESLint 0/0 ✅; build ✅. `npm ci` reproducibility to confirm in CI.
- **Gate B (Brand):** MANJOOR identity applied ✅; Arabic-first RTL preserved ✅; no fabricated business info ✅; **official logo artwork absent** (documented, integration ready) ⚠️.
- **Gate C (Security):** no credentials committed ✅; public sales disabled ✅; Dukany DB untouched ✅; Supabase isolation preserved ✅. DB-side RLS/RPC behavior **unverified** (no isolated DB) ⚠️.
- **Gate D (Regression):** existing + new tests pass ✅; P0 gating/atomic-RPC/migration-lock smoke checks pass ✅; no changes to order totals, inventory, payments, or role logic. Latent type gaps masked by `any` were fixed without behavior change.
- **Gate E (Documentation):** all Phase-01 reports present and current ✅.

## Not performed (explicitly)
- UI/browser (Playwright) RTL regression testing — not run in this environment.
- Database integration & RLS/privilege-boundary tests — require the isolated MANJOOR DB (Phase 02). No test mocks Supabase to imply RLS correctness.
