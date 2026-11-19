# QA and security report

## Automated

Unit coverage added for catalog visibility (unapproved and regulated rows hidden), quote-cart behavior (existing), lead schema and the disabled-submission error (existing), WhatsApp URL null without a number (existing), lead status transitions, route classification, duplicate-submit guard, and reference-image type/size.

These tests do not hit Supabase. They are not evidence that `submit_quote_request` works on a database.

## Security posture

- Public lead tables are not granted to `anon` in the unapplied migration. That is a design claim until the SQL is applied and tested on an isolated project.
- The client does not select from `leads` on public pages.
- Regulated product names are filtered in the catalog mapper and rejected again in the RPC.
- Direct checkout routes still render the internal-only screen unless `VITE_ENABLE_PUBLIC_SALES=true`.
- No new phone number, logo artwork, or product photo was added.

## Not verified here

RLS from an anon key, rate-limit behavior under load, upload storage, Lighthouse on a production host, and a device lab.
