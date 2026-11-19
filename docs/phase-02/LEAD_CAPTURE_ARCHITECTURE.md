# Lead capture architecture

Client contract: `src/lib/leads.ts`. Server contract: `supabase/migrations/20261119120000_manjoor_p2_lead_capture.sql`.

**This migration has not been applied.** Do not run it on the Dukany database. Apply it only to an isolated MANJOOR project after review.

## Tables

`leads` and `lead_items`. Anonymous roles have no table privileges. RLS allows admin `SELECT`/`UPDATE` on leads and admin `SELECT` on items. Inserts go through `submit_quote_request` (`SECURITY DEFINER`).

The function checks source, Iraqi phone (`+964` or `07…`), note length, payload size, quote line count, product UUID, `public_approved`, active flag, and regulated names. It rate-limits five submissions per phone per hour and rejects the same phone+payload hash for 24 hours. It returns `{ reference }` only after insert.

`products.public_approved` and `products.price_public` default to false, so legacy rows stay off the public catalog and unpriced.

## Client

`VITE_ENABLE_LEAD_SUBMISSION` must be `true` or the client throws `LeadSubmissionDisabledError` before any RPC call. A one-minute in-memory key blocks duplicate clicks. Reference images are type/size checked and are not uploaded.

Staff UI: `fetchStaffLeads` / `updateStaffLead`. Phone numbers are rendered only in the admin page.
