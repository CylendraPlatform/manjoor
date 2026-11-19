# Phase 03 baseline

Date: 2026-11-19. Branch created from `feat/manjoor-public-sales-platform` at `5e9cccf`: `feat/manjoor-live-leads-activation`.

## Flags before this phase
Committed defaults were public site off, lead submission off, checkout off, indexing off. Local `.env` had no flag lines. The preview that set only `VITE_ENABLE_PUBLIC_SITE` showed the brochure and this catalog error: `Could not find the table 'public.products' in the schema cache`.

## Backend
`supabase/config.toml` and `.env` point at project ref `ovkhxhuucxisevuvmuoz`, documented in `docs/GITHUB_MIGRATION_REPORT.md` as the bounty/MANJOOR project, not Dukany. The Supabase account logged in on this machine lists only `Masar` and `DEV orbitra`. It cannot read `ovkhxhuucxisevuvmuoz` (MCP: permission denied). Those other projects were not modified.

## Assets
`photo/` has 36 JPGs. Every file reviewed (a spread across the folder, including exact duplicate pairs) shows turned wooden hookah stems. Several frames include glass hookah bases or foil boxes. No logo file is in `public/brand/`. WhatsApp is empty in `src/config/brand.ts`.

## Routes
Marketing routes exist and render. Checkout stays on the direct-purchase lock. Quote, wholesale, and custom forms validate. They cannot persist until the lead migration is applied on the MANJOOR project.

## Risks
Publishing `photo/` would put regulated merchandise on the public site. That is not done.
