# Real lead capture report

## Client
Local `.env` (not committed) now has:

- `VITE_ENABLE_PUBLIC_SITE=true`
- `VITE_ENABLE_LEAD_SUBMISSION=true`
- `VITE_ENABLE_PUBLIC_SALES=false`
- `VITE_ALLOW_INDEXING=false`

`.env.example` matches that policy with placeholder Supabase keys.

Wholesale, quote, custom-order, and contact forms call `submit_quote_request`. A reference is rendered only from the RPC payload. A missing table or rejected call shows the server error and keeps the typed fields. No reference is invented.

Contact uses source `contact` and `productInterest` `تواصل عام`.

## What was not proven
No row was inserted. The MANJOOR project is not reachable from this login, and `public.products` was already missing in the earlier preview. `/admin/leads` will show that read error instead of sample customers.

The unit test does not call the live RPC when the lead flag is on, so it cannot be cited as a saved-lead test.
