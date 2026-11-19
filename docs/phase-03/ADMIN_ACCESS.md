# Admin access

Authorization uses `public.profiles.role`. It does not use `user_metadata`.

- `handle_new_user` inserts every new account as `customer`.
- `authenticated` has no UPDATE privilege on `profiles`, so a signed-in user cannot change their own role.
- `anon` cannot select, insert, update, or delete `leads` (REST returned 401 for each).
- A normal `authenticated` session sees zero lead rows and an update changes zero rows.
- Only `profiles.role = 'admin'` can select and update leads. Delete is not granted.

The project owner account `vbloz.info@gmail.com` was confirmed and set to `admin` with a database update, not by a client request. The temporary password is only in the gitignored file `supabase/.temp/admin-one-time.txt`. Change it in Supabase Authentication, then delete that file.

A second signup, `vbloz.info+manjoor-customer-test@gmail.com`, stayed `customer`, saw no leads, and was deleted after the test.

## Screen check
Signed in at `/admin/login`, opened `/admin/leads`, saw the three labeled test inquiries, saw the phone on the selected row, and changed `MJ-261119-D3A1B6` from `new` to `contacted`. The database row matches.
