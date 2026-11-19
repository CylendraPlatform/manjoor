# QA and security release gates

## Mandatory tests
- Full build/lint/test; TS checks; RLS/permissions; order/pricing integrity; receipt reconciliation; commission reversals; stock atomicity; all right-to-left admin layouts on mobile and desktop.
- API/RPC checks with anonymous user, customer, unrelated partner, warehouse role, accountant, admin; privilege boundaries must be enforced in DB, not UI only.
- Simulate concurrent order reservation and concurrent production material withdrawal; no negative available stock.
- Simulate crash after stock update intent; audit ledger/actual stock must reconcile.
- Payment duplicate callback / repeated submit with same idempotency key posts only once.
- Partial refund must reverse proportional commission exactly once. Payout cannot exceed approved earned balance.
- A merchant referred after its previous historical orders earns no backdated commission.
- Province reporting compares destination province vs merchant home province explicitly; missing province in "Unknown" category, never silently discarded.
- Profit calculations use immutable unit cost snapshots, distinguish gross margin/contribution/net and show commission separately.

## Known audit observations
- Dukany `src/pages/admin/Inventory.tsx` updates `products.stock` then separately inserts `stock_movements`: not atomic.
- Dukany public checkout `src/pages/Checkout.tsx` invokes `place_order`; multiple historical migrations redefine RPC; final signature must be verified on isolated database.
- Dukany archive contains `.env`; new repo must not ship it, and credentials must be audited/rotated if real.
- Muzn private repository also contains `.env`; independently audit/rotate if real. No values exposed here.
- No dynamic app execution, DB integration testing or penetration testing completed in the planning phase.

## Legal release checklist
- Obtain Iraqi counsel's written opinion on hookah-component trade, advertising, public site presentation and affiliate/referral activities.
- Verify platform rules individually for social media, search, messaging, payments, hosting.
- Collect consent for customer data, use minimal PII, maintain deletion/retention policy.
- Legal gate applies independently of technical readiness. No AI outreach or promotional automation prior to sign-off.
