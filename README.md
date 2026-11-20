# منجور | MANJOOR — فنّ الخشب العراقي

**MANJOOR Manufacturing OS** — an internal-stage platform for Iraqi woodcraft manufacturing and commerce, based in **Karbala, Iraq**.

> **Project lineage:** MANJOOR is the **active product**. It is built on the **Dukany** e‑commerce code foundation; **"Bounty"** was an intermediate adaptation codename. See `README_BOUNTY.md` and `docs/` for the original planning pack and history (retained as reference).

> **Status:** Lead forms persist on the MANJOOR Supabase project `ovkhxhuucxisevuvmuoz`. The public catalog stays empty until non-regulated products are approved. Direct checkout stays off. Hookah photographs in `photo/` are not published. See `docs/phase-03/`.

## Commercial priority
The near-term goal is qualified wholesale inquiries, not a deeper ERP. See `docs/phase-02/`. Do not publish legacy or hookah/tobacco products, invent contact details, or treat a WhatsApp click as a saved lead.

## Tech stack
- **Frontend:** React 18 + Vite 5 + TypeScript 5
- **UI:** Tailwind CSS + shadcn/ui · Arabic‑first, RTL · Tajawal typeface
- **State:** Zustand · **Data:** TanStack Query
- **Backend:** Supabase (isolated MANJOOR project — never the original Dukany DB)
- **Mobile:** Capacitor (Android/iOS shells)

## Getting started

Requires **Node.js 20** (see `.nvmrc`; minimum 18.18).

1. Clone `https://github.com/CylendraPlatform/manjoor` and use branch `main`.
2. Copy `.env.example` to `.env` (gitignored). For the live MANJOOR project set `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` from the isolated project `ovkhxhuucxisevuvmuoz` — **never** Dukany. Keep `VITE_ENABLE_PUBLIC_SALES=false` and `VITE_ALLOW_INDEXING=false`.
3. `npm ci`
4. `npm run test:p0 && npm test && npm run lint && npx tsc -p tsconfig.app.json --noEmit`
5. `npm run dev` — http://localhost:8080/
6. Production bundle: `npm run build` then `npm run preview`. Publish `dist/` per `docs/launch/DEPLOYMENT_GUIDE.md` (manual Netlify upload today; Hostinger/Apache or nginx later). Do not connect Git auto-deploy unless asked.

Admin panel: `/admin/login` (requires an admin‑role account). Public commerce routes render an internal‑only screen while `VITE_ENABLE_PUBLIC_SALES` is false. Live site (manual `dist` upload): `https://manjoor.netlify.app/`.

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
