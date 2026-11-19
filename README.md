# منجور | MANJOOR — فنّ الخشب العراقي

**MANJOOR Manufacturing OS** — an internal-stage platform for Iraqi woodcraft manufacturing and commerce, based in **Karbala, Iraq**.

> **Project lineage:** MANJOOR is the **active product**. It is built on the **Dukany** e‑commerce code foundation; **"Bounty"** was an intermediate adaptation codename. See `README_BOUNTY.md` and `docs/` for the original planning pack and history (retained as reference).

> **Status:** The public brochure can be switched on with `VITE_ENABLE_PUBLIC_SITE`. Lead forms are wired (`VITE_ENABLE_LEAD_SUBMISSION`) but do not persist until the MANJOOR Supabase project `ovkhxhuucxisevuvmuoz` is reachable and the lead migration is applied. Direct checkout stays off. Hookah photographs in `photo/` are not published. See `docs/phase-03/`.

## Commercial priority
The near-term goal is qualified wholesale inquiries, not a deeper ERP. See `docs/phase-02/`. Do not publish legacy or hookah/tobacco products, invent contact details, or treat a WhatsApp click as a saved lead.

## Tech stack
- **Frontend:** React 18 + Vite 5 + TypeScript 5
- **UI:** Tailwind CSS + shadcn/ui · Arabic‑first, RTL · Tajawal typeface
- **State:** Zustand · **Data:** TanStack Query
- **Backend:** Supabase (isolated MANJOOR project — never the original Dukany DB)
- **Mobile:** Capacitor (Android/iOS shells)

## Getting started
1. Create a **new, isolated** Supabase project for MANJOOR. **Never** use Dukany credentials or database.
2. `cp .env.example .env.local` and set the new project's `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Keep `VITE_ENABLE_PUBLIC_SALES=false`.
3. `npm ci`
4. `npm run test:p0 && npm test && npm run lint && npm run build`
5. `npm run dev`

Admin panel: `/admin/login` (requires an admin‑role account). Public commerce routes render an internal‑only screen while `VITE_ENABLE_PUBLIC_SALES` is false.

## Brand
Canonical identity lives in `src/config/brand.ts`. Official logo artwork goes in `public/brand/` (see its README) — it is supplied by the brand owner, never generated. Palette: Walnut `#5B3A27` · Warm Sand `#DCC6A3` · Brass Gold `#B88946` · Charcoal `#2E2B28`.

## Documentation
- `docs/phase-02/` — sales-first website, leads, SEO, launch gates.
- `docs/phase-01/` — Phase 01 baseline, legacy audit, stabilization, rebranding, QA, open risks.
- `docs/` — original product/architecture/database/QA planning pack.
- `docs/GITHUB_MIGRATION_REPORT.md` — initial publication record.
- `AGENTS.md`, `CLAUDE.md` — rules for AI/developer contributors.

## Guardrails
Do not: point this app at the Dukany database, apply migrations to a live DB without review, re‑enable public sales without approval, commit secrets, or invent brand/contact information. Production database changes require explicit approval.
