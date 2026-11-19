# MANJOOR development rules

**MANJOOR (منجور)** is the active product — an Iraqi woodcraft manufacturing & commerce OS (Karbala). It is built on the **Dukany** code foundation; **Bounty** was an intermediate adaptation codename. The app is currently **internal-stage** software.

## Read first
- `README.md`, then `docs/phase-01/` (BASELINE_AUDIT, STABILIZATION_REPORT, REBRANDING_REPORT, QA_VERIFICATION, OPEN_RISKS), `docs/README.md`, `docs/P0_IMPLEMENTATION_REPORT.md`, `docs/GITHUB_MIGRATION_REPORT.md`.
- Inspect the actual source before trusting historical docs; record and reconcile discrepancies without silently changing business behavior.

## Non-negotiables
1. **MANJOOR is the current identity.** Do not present Dukany/Bounty as the active brand. Preserve historical references where they explain origin/migrations.
2. **Public commerce stays restricted.** Public storefront, checkout, order submission, referral/affiliate promotion and outbound/AI sales are disabled by default. Do not re-enable by flipping only a frontend flag — legal approval **and** backend/RLS controls are required.
3. **Never touch the original Dukany project or database.** Use a new, isolated MANJOOR Supabase project only. Do not apply legacy migrations to any live DB; test on a disposable instance.
4. **Production database changes require explicit approval.** No destructive Supabase operations.
5. **Never commit secrets.** `.env*` is gitignored; `VITE_` vars are public (publishable/anon key only) — no `service_role` in client code.
6. **Quality gates.** Keep TypeScript at zero errors. Do not use `any`, `@ts-ignore`, or unsafe assertions to silence errors; do not weaken `eslint.config.js`. Use `src/lib/json.ts`, `src/lib/utils.ts#getErrorMessage`, and `src/integrations/supabase/overrides.ts` instead of `any`.
7. **Brand assets are supplied, not generated.** Never invent/redraw a MANJOOR logo or fabricate contact/business info. Put official artwork in `public/brand/`.
8. **Transactions** for coupled operations (e.g. stock change + movement via `bounty_adjust_stock`). Report exact build/lint/test results and unverified concerns.

## Future development
Follow the documentation and QA gates (Gate A–E in `docs/phase-01/QA_VERIFICATION.md`). Do not merge to `main` without review.
