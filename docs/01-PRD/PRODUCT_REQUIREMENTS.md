# Product Requirements Document — Bounty Manufacturing OS v1.0

## Goal and users
Make an existing woodturning workshop operationally measurable: track orders, receipts, production, stock, actual cost, customer geography and contractual commissions in one Arabic-first system.
Roles: owner/super-admin; workshop manager; sales partner (read only their allowed referrals/earnings); accountant; stockkeeper; production worker (later).

## Non-goals for first release
Public affiliate portal, AI contact prospecting, outbound marketing, consumer marketplace, public checkout of tobacco-related accessories, mobile native release, payroll/tax accounting suite.

## Required workflows
1. Register product model with SKU, dimensions (cm), willow material, finish, grade, product photos, base cost, wholesale price tiers, unit `piece`, active flag.
2. Add trade customer with company/trader name, known phone, province/district, existing/referred status, approved payment terms and attribution.
3. Create admin order manually with immutable per-item unit price and unit cost snapshots, delivery/collection terms, statuses draft->confirmed->in production->ready->delivered->closed or cancelled/returned.
4. Create manufacturing job from approved demand, record expected pieces, scrap/defects, actual pieces and completion time; attach output to finished goods inventory.
5. Inventory ledger for raw willow (record physical units + optional volume/length), parts and finished goods (pieces); receiving, reserving, consuming, producing, shipment, return, adjustment. Each transaction is atomic and auditable.
6. Enter receipt against invoice/order; calculate open AR balance from valid posted financial entries, not UI totals.
7. Attach partner to referred customer according to written contract; compute commissions on collected eligible payments net of refunded amounts, manual approval and reversals. Do not attribute pre-existing customers automatically.
8. Dashboard: invoiced revenue, collected amount, AR aging, gross/contribution margin, order throughput, stock anomalies, pending commissions and province performance; always allow date filter and drilldown.
9. AI analyst (optional next phase) has read-only governed analytic views; no autonomous accounting writes or external outreach.

## KPIs (definitions)
- Collected revenue: sum posted cleared payments minus posted refunds in reporting interval (separate from booked sales).
- Recognized revenue: fulfilled billable order net of returns/discounts as per agreed business accounting policy.
- Realized contribution = recognized revenue - frozen COGS - attributed shipping/returns - earned sales commission; separately show fixed operating costs to derive net profit.
- Sales by governorate: order destination province at order time; distinguish merchant registered province.
- Repeat-order rate: merchants with >=2 completed orders in trailing 90 days / merchants with >=1 completed order in that period.
- On-time delivery rate: delivered by promised delivery date / delivered orders with promised date.
- Production yield: accepted finished pieces / total produced pieces (accepted + scrap).
- Commission payout: sum approved paid ledger events, not referrals or pending orders.

## UX
- Arabic RTL first; IQD as integers; clear location selectors (governorate, district); admin optimized for phone and desktop.
- Explain pending, paid and refundable states clearly; show who changed an order and when.
- All publicly visible pages for regulated items disabled by feature flag until written legal clearance.

## Security and regulatory gates
- Admin route protections + enforced row/table RLS/permission for each query/RPC.
- No public signup for workshop staff. Sales partner gets only explicit scoped records.
- Legal review on Iraqi tobacco advertising and commerce rules and provider policies before any hookah-related public catalog/referral promotion.
