# Open risks

1. Do not run `supabase db push`. It would apply the old Dukany migration chain. The live schema is `20261119200000_manjoor_public_leads.sql` only.
2. No auth user exists, so `/admin/leads` cannot be opened until an admin account is created and `profiles.role` is set to `admin`.
3. The public catalog is empty on purpose. Hookah photos in `photo/` stay unpublished.
4. No WhatsApp number and no logo file.
5. Anonymous read of `leads` is denied. A broader abuse review was not done.
6. Indexing stays closed. Direct checkout stays off.
7. Three labeled test inquiries are stored (`MJ-261119-09F39C`, `MJ-261119-D3A1B6`, `MJ-261119-04870C`). They are not customers.
