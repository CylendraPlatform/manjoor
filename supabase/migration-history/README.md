# Historical SQL — do not replay

These files are the old Dukany/Bounty migration chain plus two unapplied MANJOOR drafts. They are kept for reference.

They are not in `supabase/migrations`, so `supabase db push` does not run them.

Do not move them back into `supabase/migrations`. The live MANJOOR database already has its own baseline and must not be rebuilt from this folder.
