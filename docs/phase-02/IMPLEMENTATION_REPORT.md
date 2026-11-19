# Phase 02 implementation report

Branch: `feat/manjoor-public-sales-platform`, based on the open Phase 01 branch. PR #1 was not changed.

## Built

- Marketing pages and shell behind `VITE_ENABLE_PUBLIC_SITE` (default false).
- Quotation cart separate from the purchase cart.
- Wholesale, custom-order, and quote forms that validate locally and refuse a success state while lead submission is off.
- Catalog loader that drops anything not `public_approved`, plus regulated names.
- Admin lead screen that shows a backend error instead of sample customers when `leads` is missing.
- Unapplied SQL migration for the narrow submit RPC, admin-only RLS, approval flags, rate limit, and duplicate hash.
- `noindex` and a closed `robots.txt`.
- Feature flags documented in `.env.example`.

## Explicitly not done

- No live lead persistence. The migration was not applied.
- No checkout activation.
- No official logo file and no product photography. Slots are listed in `public/brand/README.md`.
- No invented WhatsApp number. The button stays in a “not configured” state.
- No Lighthouse score is claimed.

## How to preview

Set `VITE_ENABLE_PUBLIC_SITE=true` for a local dev server. Leave `VITE_ENABLE_LEAD_SUBMISSION` and `VITE_ENABLE_PUBLIC_SALES` false.
