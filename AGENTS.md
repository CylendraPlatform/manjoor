# Bounty development rules
- Read `docs/README.md`, `docs/04-EXECUTION/CLAUDE_CODE_KICKOFF.md`, and `docs/05-QA/ACCEPTANCE_AND_SECURITY.md` before edits.
- Work on this isolated copy, never on Dukany original or Muzn.
- Public storefront, checkout, referral promotion and outbound AI sales are disabled for P0. Do not enable by changing only frontend flags; check legal and backend controls.
- Never commit `.env` or secrets; use a fresh Supabase staging project only.
- Do not apply old Dukany migrations to an existing production database. Review them and test on disposable staging.
- Use database transactions for coupled operations like stock change + stock movement.
- Report exact build/lint/test results and unverified concerns.
