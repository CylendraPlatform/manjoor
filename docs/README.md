# Bounty Manufacturing OS — Project Control Pack v1.0
Date: 2026-11-16
Status: Planning baseline, not production certification.

## Decision
- Fork/copy **Dukany** into an independent repository and independent Supabase project. Do not edit the source project or import its live data.
- Treat **Muzn** solely as a reference for operational workflows, **not** as code/SQL to merge automatically.
- Temporary code name: `bounty-manufacturing-os`. Confirm legal/commercial brand name before public identity work.
- Phase 1 internal-only operations: users, products, manually-entered orders, cash collection, customer accounts, basic inventory, and internal commission ledger.
- Do **not** launch public hookah-related advertisements, open affiliates, outbound AI sales or automated promotional messaging before jurisdiction-specific legal review and platform-policy approval.

## Documents
- `00-GOVERNANCE/DECISIONS_AND_ASSUMPTIONS.md`
- `01-PRD/PRODUCT_REQUIREMENTS.md`
- `02-ARCHITECTURE/ADAPTATION_MATRIX.md`
- `02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md`
- `03-DATABASE/SCHEMA_PLAN.md`
- `04-EXECUTION/ROADMAP_AND_TASKS.md`
- `04-EXECUTION/CLAUDE_CODE_KICKOFF.md`
- `05-QA/ACCEPTANCE_AND_SECURITY.md`
- `06-OPERATIONS/BASELINE_DATA_TEMPLATE.csv`

## Sources reviewed
Dukany user-supplied archive (`dukany.zip`), source paths cited in adaptation matrix. Muzn connected private GitHub repository `cylendralabs-blip/muzn`, `main` tree snapshot SHA `2686579cb09be4bfda8c2a40115c0b1de9c7a8f1`.
Static inspection only. No live DB, deployment test, end-to-end test, or external compliance assurance was performed.
