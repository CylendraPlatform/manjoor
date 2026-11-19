# Supabase activation report

## Result
Connected. Project name **MANJOOR**, ref `ovkhxhuucxisevuvmuoz`, environment production. It is not Dukany. Cursor's Supabase plugin still returns permission denied. The linked CLI session can query this project.

Remote migration history was empty and `public` had no application tables. The historical Dukany/Bounty migration chain was not applied.

## Applied
`supabase/migrations/20261119200000_manjoor_public_leads.sql` via `supabase db query` (additive). Created:

- `profiles`, `categories`, `products`, `leads`, `lead_items`
- `submit_quote_request(p_source, p_payload, p_attribution)`
- `handle_new_user` trigger (new accounts start as `customer`)

No products, prices, or customers were inserted. `auth.users` count is 0.

## Do not run
`supabase db push` would try to apply the old Dukany migration files onto this database. Do not run it.
