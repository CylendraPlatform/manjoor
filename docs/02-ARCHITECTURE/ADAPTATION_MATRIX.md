# Dukany reuse / refactor / build matrix (source-backed)

| Feature | Evidence: Dukany path | Decision | Implementation note |
|---|---|---|---|
| Public product pages | `src/pages/Products.tsx`, `ProductDetail.tsx` | KEEP DISABLED initially | Regulated product public release needs legal gate |
| Checkout | `src/pages/Checkout.tsx` using `supabase.rpc('place_order')` | KEEP CODE, DISABLE PUBLIC | Safe internal ordering only, do not reuse public checkout without compliance |
| Admin orders | `src/pages/admin/Orders.tsx`, `OrderDetail.tsx` | REFACTOR | Add wholesale quantity, billing status, cost snapshots, referral attribution |
| Inventory | `src/pages/admin/Inventory.tsx` | REBUILD ATOMIC WRITES | Current code updates `products.stock` and separately inserts `stock_movements` |
| Sales analytics | `src/pages/admin/Dashboard.tsx` | EXTEND | Add revenue vs collections; province profitability; show scope, denom, net margin |
| Customer admin | `src/pages/admin/Users.tsx` | EXTEND | Existing users != trade customers; separate legal business entities |
| Delivery | `src/pages/admin/Delivery.tsx`, `Agents.tsx` | REUSE SELECTIVELY | Courier != commission-earning referral partner |
| Coupons / loyalty / offers | `src/pages/admin/Coupons.tsx`, `Loyalty.tsx`, `src/pages/Offers.tsx` | DISABLE | Not core to internal workshop MVP |
| Native mobile | `android/`, `capacitor.config.ts` | DEFER | Reuse only after web back-office stability |
| Region selector | `src/pages/Checkout.tsx`; `supabase/migrations/20260220100000_add_location_and_regions.sql` | REUSE & VALIDATE | Need Iraq province/district normalized data |
| Stock movements | `supabase/migrations/20260216113500_inventory_management.sql` | ADAPT | Model raw materials + WIP + finished stock; no dual non-atomic writes |
| `place_order` RPC | `supabase/migrations/20260221125000_fix_place_order_overloading.sql`, earlier definitions | AUDIT & REPLACE IN STAGING | Multiple historical definitions/migrations; verify final installed signature |
| B2B trader registry | No dedicated verified trade customer feature found in static route inspection | BUILD | Contract price groups and commercial accounts |
| Commission ledger | No dedicated partner commission ledger found in inspected admin routes | BUILD | Earned on cleared receipts with reversals |
| Manufacturing BOM / job cards | No purpose-built workshop manufacturing screens found | BUILD | Raw wood, production job, wastage, accepted units |
| AI analyst | No operational AI analyst module identified | LATER | Read-only materialized views and human-approved insights |

## Muzn reference, not migration
Muzn `src/routes/admin.batches.tsx`, `admin.payments.tsx`, `admin.leads.tsx`, `admin.reports.tsx`, `admin.waste.tsx`, and Supabase operational RPCs demonstrate useful patterns. Its FEFO kilogram-perishable inventory and mushroom data types must **not** be transplanted into woodturning. `admin.tsx` checks for any staff role to enter layout; verify back-end per-action enforcement independently.
