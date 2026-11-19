# Execution backlog and gates

## P0 — Safe starting point
- P0-01: create independent private repository and isolated Supabase staging; prove original untouched.
- P0-02: secret scan Dukany ZIP, gitignore `.env`; rotate exposed live credentials via owner. Never echo secret contents to logs/report.
- P0-03: install dependencies in clean environment; run `npm run build`, `npm run lint`, `npm run test`; record actual results, not assumed.
- P0-04: review all RLS/RPC and permissions for admin routes; test unauthorized/malicious client requests.
- P0-05: map historical `place_order` overloads and final RPC; verify migration chain in clean staging.
- P0-06: disable public storefront/checkout/coupon/loyalty outbound marketing behind safe feature flags.
Gate G0: safe working clone, baseline test report, zero secret exposure in new repo.

## P1 — Commercial back office
- P1-01: trade customers, province/district, segmented types; distinguish existing/referred customers.
- P1-02: product models including piece unit/length/wood/finish and prices; no unnecessary mushroom/food fields.
- P1-03: admin wholesale order creation + state machine + pricing snapshots and versioned price tiers.
- P1-04: receipt posting + outstanding balances, partial payments and reversals.
Gate G1: end-to-end order->invoice->partial receipt->full receipt reconciliation.

## P2 — Workshop and inventory
- P2-01: raw willow inventory and stock ledger.
- P2-02: manufacturing job card, material consumption, accepted/rejected output.
- P2-03: atomic inventory database RPCs, reject negative stock, event audit.
- P2-04: per-SKU cost and contribution margin by period.
Gate G2: all inventory balances reconcile from ledger; failed RPC leaves no partial state.

## P3 — Internal commissions and management reporting
- P3-01: partner agreements, customer attribution and valid-from/until.
- P3-02: cleared-receipt commission accrual and reversal, hold/approve/payout with audit.
- P3-03: reporting by governorate, buyer, SKU, sales vs collections, net contribution.
- P3-04: scoped partner read-only earnings view only after signed authorization.
Gate G3: refund/repeated-payment/duplicate-event scenarios reconcile exactly.

## P4 — AI operations (optional, after clean data)
- P4-01: read-only QA-validated monthly metrics view; factual Arabic insights with source trace.
- P4-02: production demand/capacity planning, stock alerts with explicit confidence.
- P4-03: optional compliance-approved business relationship assistance; no auto-sending.
Gate G4: metrics equal SQL baseline; no unapproved external communications.

## Resourcing/cost estimate
Cannot estimate credible fixed timeline or budget until P0 inspection, environment readiness and monthly operations baseline. Do not fabricate duration or source completion claims.
