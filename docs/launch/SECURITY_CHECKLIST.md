# Security checklist

Date: 2026-11-20. Live REST checks used the anon/publishable key against `ovkhxhuucxisevuvmuoz` only. SQL dashboard MCP had no permission in this session.

## Verified this session

| Control | Evidence |
|---|---|
| Anon cannot `GET /rest/v1/leads` | HTTP 401, `42501` permission denied |
| Anon cannot `GET /rest/v1/lead_items` | HTTP 401 |
| Invalid contact rejected | RPC HTTP 400 `invalid contact` |
| Duplicate payload rejected | RPC HTTP 400 `duplicate submission` |
| Valid labeled wholesale/custom/contact persist | RPC HTTP 200 with `reference` (`MJ-261120-*`) |
| Public `products` select | HTTP 200 `[]` (no approved catalog rows) |
| Frontend lead writes go through `submit_quote_request` | `src/lib/leads.ts` |
| No `service_role` in client source | grep: only Deno env in `supabase/functions/create-agent-user` |
| `.env` gitignored | `.gitignore` |
| `admin-one-time.txt` absent | glob under repo: 0 files |
| Historical SQL not in active migrations | 58 files in `supabase/migration-history/`; one active file `20261119200000_manjoor_public_leads.sql` |
| `supabase db push` not run | this task |

## Verified in schema SQL (not re-queried via dashboard)

From `supabase/migrations/20261119200000_manjoor_public_leads.sql`:

- RLS enabled on `profiles`, `categories`, `products`, `leads`, `lead_items`
- `REVOKE ALL` on leads/items from `anon`; execute on `submit_quote_request` granted to `anon`
- Admin lead SELECT/UPDATE via `profiles.role = 'admin'`
- `handle_new_user` inserts `customer` only
- `profiles`: `GRANT SELECT` to `authenticated` only (no UPDATE grant in this file)
- Rate limit: 5 leads / hour / phone; duplicate hash 24 hours
- Quote line items require `public_approved` and reject regulated name patterns

## Unverified this session

| Item | Why |
|---|---|
| Database password rotation | Cannot confirm Dashboard rotation. A password was previously typed into terminal scrollback (`docs/phase-03/MIGRATION_BASELINE.md`). **Do not print it.** Rotate in Dashboard → Database → Reset database password, store in a password manager, re-link CLI if asked. Authorization required before anyone resets it from here. |
| Admin password change | One-time file is gone. Whether the dashboard user password was changed is **not** confirmed. Change it in Supabase Authentication; do not store it in git. |
| Admin `/admin/leads` UI | Login form exists; this session did not authenticate. |
| Ordinary user cannot update leads | Prior report in `docs/phase-03/ADMIN_ACCESS.md`; not re-run. |
| Profile self-elevation on the live DB | SQL file does not GRANT UPDATE on `profiles`. `src/pages/admin/Users.tsx` still *attempts* client `profiles.update({ role })` for signed-in admins. Live deny/allow not retested. |
| npm audit 44 issues after `npm ci` | Dependency surface; not exploited here. |

## Required password rotation procedure (do not execute without approval)

1. Supabase Dashboard → Project Settings → Database → Reset database password.
2. Save the new value only in an approved password manager.
3. Re-run `supabase link` locally if the CLI asks. Never commit the password.
4. Clear or close any terminal that still shows the old value.

Administrator login: Authentication → Users → the owner account → Reset password. Then confirm `public.profiles.role = 'admin'` for that user id (SQL as a privileged operator, not from the SPA).
