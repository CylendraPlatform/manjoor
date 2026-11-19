# Target architecture

```
[Internal admin (React/Vite, Arabic RTL)]
          |
[Supabase Auth] ---- [roles / scoped claims]
          |
[RPC transactional service layer / RLS]
          |
[Postgres operational schema]
    | orders + order_items
    | customers + referrals
    | payments + refunds + invoices
    | stock_movements + stock_balances
    | materials + BOM + manufacturing_jobs
    | commissions + payouts
    | audit_events
          |
[Read-only analytics views] --> [Admin dashboard] --> [Future AI analyst]
```

## Implementation principles
- Preserve Dukany source; create new clean repository, and new Supabase project not sharing production IDs.
- TypeScript UI calls vetted RPCs for all multi-row mutations; no client-side direct stock counter updates.
- Database keeps every financial posting and stock change auditable with immutable/event-style ledger; edits produce adjustments/reversals.
- Money stored as `bigint` IQD (no fractional dinar), quantities as numeric where appropriate (raw wood) or integers (pieces).
- Role-level access enforced server-side in RLS or SECURITY DEFINER with strict authorization, `search_path`, input validation and test coverage.
- Dashboard calculations from database views/functions for consistency, pagination and time windows.
- AI access through restricted read-only views; no access to secret tables/PII by default, no scraping or unapproved external contact automation.
- Feature flag protects public storefront, promotional referrals, external AI outreach until compliance gate.

## Release boundaries
- Internal alpha: manual order + workshop ledger, no external public buying.
- Controlled beta: trusted internal operators + supervised current trade accounts.
- Public release: independent sign-off on legal, privacy, consumer protection, platform and security requirements.
