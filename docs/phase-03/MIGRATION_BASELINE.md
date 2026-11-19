# Migration baseline

Date: 2026-11-19. Project: MANJOOR `ovkhxhuucxisevuvmuoz`.

## Live history
`supabase migration list --remote` shows one applied version:

`20261119200000` — `supabase/migrations/20261119200000_manjoor_public_leads.sql`

That row was recorded with `supabase migration repair --status applied`. The SQL itself had already been applied. `supabase db push` was not run.

## Historical files
58 older SQL files live in `supabase/migration-history/`. They are outside the CLI migration directory. A future `db push` from this checkout only sees `20261119200000`, which is already marked applied, so it has nothing new to replay.

Do not copy the archive back into `supabase/migrations`. Do not run `supabase db push` against this project to "catch up" the old chain. Do not reset the database.

## Credential rotation
A database password was typed into a local terminal command. `supabase link` ignored `--password`, but the value is still in that terminal scrollback. Rotate it without pasting it into chat or git:

1. Supabase Dashboard → Project Settings → Database → Reset database password.
2. Store the new password in a password manager only.
3. Re-link the CLI if a later command asks for it. Do not put the password in a committed file or in `.env` used by the browser.
4. Delete any local note that contains the old password.
