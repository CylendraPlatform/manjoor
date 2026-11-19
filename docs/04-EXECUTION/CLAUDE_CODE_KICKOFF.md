# Copyable task for Claude Code / Cursor — P0 ONLY

You are working on Bounty Manufacturing OS. This is an adaptation of the user-supplied Dukany project; the existing Dukany and Muzn projects **must remain unchanged**.

1. Read `README.md`, `00-GOVERNANCE/DECISIONS_AND_ASSUMPTIONS.md`, `01-PRD/PRODUCT_REQUIREMENTS.md`, `02-ARCHITECTURE/ADAPTATION_MATRIX.md`, `02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md`, `03-DATABASE/SCHEMA_PLAN.md`, `04-EXECUTION/ROADMAP_AND_TASKS.md`, and `05-QA/ACCEPTANCE_AND_SECURITY.md`. Then read any project-local `AGENTS.md`, `CLAUDE.md`, `.cursor` rules before writing code.
2. Work ONLY on a new independent repository and isolated staging Supabase. Never modify or attach to original live project. Never print secrets; identify exposed credentials only by file path and risk class; request owner-led rotation.
3. Inventory actual source modules and inspect migrations. Compare with documented adaptation decisions; log discrepancies.
4. Run clean installation/build/lint/test baseline. Report commands and exact passes/failures. Do not claim tests passed if not run.
5. Inspect admin RLS/RPC privileges, repeated `place_order` definitions, stock update/log non-atomicity. Create a prioritized repair proposal; do not execute destructive migrations.
6. Disable all public sales, promotional referrals, AI outbound contact and regulated-products advertising in the new staging copy with a safe default-off configuration and test. This is an internal tool until legal sign-off.
7. Produce `P0_IMPLEMENTATION_REPORT.md` with: repo/branch, files modified, environment isolation evidence, actual check outputs, blockers, vulnerabilities (redacted), decisions requested, and G0 pass/fail.
8. Stop after P0. Do not build P1–P4 before G0 is approved.

Acceptance: zero source-project changes, no real credentials included in new repo, documented test outcomes and migration analysis, secure default-off public surfaces.
