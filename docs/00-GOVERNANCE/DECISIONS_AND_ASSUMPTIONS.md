# Decisions, facts, hypotheses and boundaries

## Confirmed by business stakeholder
- Existing operation in Karbala, Iraq; established artisan specializing in wood turning for bakar/shisha components.
- Wood type: willow (صفصاف).
- Most typical quoted wholesale price: IQD 5,000/unit; high-end variants up to IQD 25,000/unit.
- Maker-reported margin: 40–50% of selling price **after wage and other business costs**. Must validate whether this includes every cost and whether premium variants differ.
- Approximate workforce: 5–7, expandable. Production throughput unknown.
- Existing customers in Karbala and Najaf.
- Commercial arrangement: partner sources customers, earns commission on referred customers. Rate/attribution duration/returns unresolved.
- Social page uses 'باونتي للأراكيل'; 'باونتي رول' appears on/around products. Formal brand ownership/name unverified.

## Working decisions
- Build on Dukany, isolated from original product and infrastructure; Muzn operational features may inform requirements.
- Internal-only MVP, sales ledger and manufacturing back office; public-sales/marketing functions remain disabled pending legal review.
- Arabic/RTL first, IQD integer monetary amounts. Province and district are normalized identifiers, never inferred from free text alone.
- Sales funnel is based initially on *existing, permitted and consented* commercial relationships; no mass harvesting/contact scraping.

## Unresolved questions (do not invent values)
- Per-product BOM/cost composition; monthly output; existing customer counts; revenue by month; target delivery coverage; freight rates; credit terms; invoice tax requirements; exact commission formula; precise legal categorization of business/product.
- Legal feasibility of any online sale/advertising of hookah components in target regions; obtain local counsel before opening restricted features.

## Money and commission policy
- Collected cash != invoiced revenue != booked order.
- Use order-level immutable pricing/cost snapshots, separate payments/refunds, and commission events calculated only on eligible settled collections.
- Example: if realized order margin 45%, an additional sales commission of 10% of gross collected revenue consumes 22.22% of pre-commission profit. Hypothetical only.
- Commissions have `pending`, `earned`, `held`, `reversed`, `paid`; enforce unique event per payment/partner/order association and audited reversals.

## No-go conditions
- Never put secrets in Git. Rotate any exposed secret after audit.
- Never point staging or copied project at original Dukany production Supabase.
- Never treat documentation or source-file existence as proof of working implementation.
