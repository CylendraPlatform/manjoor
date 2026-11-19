# Database plan — additive schema, no production DDL executed

## Core tables (proposed)
- `trade_customers`: id, name, phone, registered_governorate_id, district_id, trade_terms, active, created_at.
- `products`: retain Dukany key; add model_code, wood_species, length_cm, finish, grade, piece_unit and active; separate product `price_tiers` if needed.
- `materials`: id, type, unit, supplier, unit_cost; `material_lots`: received/available quantities with provenance.
- `bill_of_materials`: model_id, material_id, standard_quantity, standard_cost; explicit effective_at/version.
- `manufacturing_jobs`: order_id nullable, product_id, planned_qty, produced_qty, rejected_qty, planned_start, completed_at, operator, status.
- `inventory_ledger`: id, item_kind (material / finished), item_id, quantity_delta, unit, movement_kind, reference_type, reference_id, operator, time, idempotency_key unique.
- `trade_orders` + `trade_order_lines`: customer, destination, status, price_snapshot, unit_cost_snapshot, item quantities.
- `receipts`: order_id, amount_iqd, status, collected_at, external_ref, idempotency_key; `refunds` separate.
- `referral_partners`: id, identity, agreement_date, active; `customer_attributions`: partner_id, customer_id, assigned_at, eligible_from, eligible_until, rate_basis, percentage, uniqueness/overlap policy.
- `commission_ledger`: id, partner_id, receipt_id, order_id, amount_iqd, state, reason, correction_of, created_at; `commission_payouts` and allocation table.
- `audit_events`: actor, action, object_type, object_id, before/after hash or safe diff, time.

## Atomic invariants
1. Confirm/reserve order must be transactional; cannot oversell finished stock.
2. Material consumption + job completion + finished goods receipt must commit or rollback together.
3. Receipt is idempotent, cannot exceed amount owed unless explicitly booked as credit.
4. Commission event emitted once per eligible cleared receipt, with matching reversal for later refund; no payout of pending/held events.
5. Existing customer with no explicit attribution must never earn referral commission.
6. Supplier cost change must not rewrite previous order cost snapshots.
7. Every material change carries user, date and reason.

## Migration process
- Inspect actual current migrations/schema, generate schema diff in isolated staging; create forward-only dated migrations; dry-run repeatable idempotence tests.
- Never execute the supplied `recovered_schema.sql`, `recovered_security.sql`, `recovered_storage.sql` in production without inspecting semantics and duplication against migrations.
- Do not copy production auth users, private keys, data or paid history by default.
