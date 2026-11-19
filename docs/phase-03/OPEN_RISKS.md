# Open risks

1. Do not run `supabase db push` to replay old work, and do not move `supabase/migration-history/` back into `supabase/migrations`. The live history contains only `20261119200000`.
2. Rotate the database password that was typed into the terminal. Steps are in `MIGRATION_BASELINE.md`. Do not paste the old or new password into git.
3. Change the temporary admin password in `supabase/.temp/admin-one-time.txt`, then delete the file.
4. The public catalog is empty on purpose. Hookah photos in `photo/` stay unpublished.
5. No WhatsApp number and no logo file.
6. Indexing stays closed. Direct checkout stays off.
7. Older admin screens (orders, inventory, coupons) still expect tables that were not created. That is outside lead capture.
8. Anonymous clients cannot read or change leads. A broader abuse review, beyond the rate limit and the permission tests below, was not done.
9. Test inquiries still stored: `MJ-261119-09F39C` (contacted), `MJ-261119-D3A1B6` (contacted), `MJ-261119-04870C` (new). They are not customers.
