# Supabase activation report

## Result
Not activated from this environment.

| Check | Result |
|---|---|
| Intended project | `ovkhxhuucxisevuvmuoz` (MANJOOR/bounty ref already in config) |
| Dukany | Not used |
| CLI `projects list` | `Masar` (`jndslkiehkegmexsuryq`), `DEV orbitra` (`twgthlmhypjaocsvqvwr`, inactive) |
| MCP `get_project` on the MANJOOR ref | Permission denied |
| Migrations applied | None |

No SQL was sent to Masar or Orbitra.

## What is ready in git
`supabase/migrations/20261119120000_manjoor_p2_lead_capture.sql` creates `leads` and `lead_items`, adds `products.public_approved` and `products.price_public` (default false), and defines `submit_quote_request`. This phase adds `contact` to the allowed sources. The function is `SECURITY DEFINER`, revokes public table access, rate-limits by phone, and rejects duplicate payload hashes. Admin RLS is select/update for `profiles.role = 'admin'`.

That SQL still assumes `public.products` and `public.profiles` already exist. A full schema apply means the earlier migrations on an empty MANJOOR database, which this session could not run.

## Security not verified
RLS was not executed against a database. Anonymous insert safety, rate limits, and admin-only reads are design claims until someone with access to `ovkhxhuucxisevuvmuoz` applies the migrations and retests with the anon key.
