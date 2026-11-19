# Bounty Manufacturing OS — isolated adaptation of Dukany

This folder is a *modified source-code copy* plus the complete previous planning documentation in `docs/`. Working brand: **باونتي — إدارة المعمل**. Final legal/business name remains unconfirmed.

## Read first
1. `docs/P0_IMPLEMENTATION_REPORT.md` — actual edits, test outcomes and open blockers.
2. `AGENTS.md`, `CLAUDE.md` — non-negotiable implementation rules.
3. `docs/README.md`, `docs/01-PRD/PRODUCT_REQUIREMENTS.md`, `docs/04-EXECUTION/ROADMAP_AND_TASKS.md` — business scope and phased plan.

## Local setup after completing dependency installation
1. Create *new* Bounty staging Supabase project. **Do not use original Dukany credentials or DB**.
2. Copy `.env.example` to `.env.local`; fill in ONLY the new project's URL and public anon/publishable key. Keep `VITE_ENABLE_PUBLIC_SALES=false`.
3. Audit and run legacy migrations only on a disposable instance, then review the Bounty P0 migration; do not apply any migrations to original database.
4. Run `npm ci`, `npm run test:p0`, `npm test`, `npm run lint`, `npm run build`, then `npm run dev`.
5. Verify RLS and public order RPC closures independently of the frontend.

## Scope/limitations
The public storefront is masked in this working copy by default. This is an **internal staging interface**, not a legally reviewed sales site. New manufacturing, B2B account, commission and financial workflow modules are not implemented yet. Refer to the implementation report; do not assume they are live.
