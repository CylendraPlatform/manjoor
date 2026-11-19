# QA and verification

## Commands (2026-11-19)
`npm ci` succeeded after the local Vite process released `esbuild.exe` (exit 0, 934 packages). `npx tsc -p tsconfig.app.json --noEmit` exit 0. `npm run lint` exit 0. `npm test` 13 files, 43 tests passed. `npm run build` exit 0.

## Runtime (public site and lead submission on, checkout off)
- Homepage at `/` rendered Arabic copy. Placeholder workshop art is labeled as waiting for an approved photo.
- `/products` showed the schema-cache error for `public.products`. No demo products.
- Empty `/request-quote` showed: add at least one product, name required, invalid Iraqi phone, choose a governorate. No reference.
- A filled `/contact` submit returned: `Could not find the function public.submit_quote_request(...) in the schema cache`. Name and message stayed filled. No `MJQ`/`MJL` reference.
- `/checkout` heading: الشراء المباشر غير مفعّل.
- `/admin/leads` redirected to `/admin/login`. No staff session exists here, so the list was not opened. There is also no saved row to show.
- At 360px, homepage and catalog `scrollWidth` equaled `clientWidth` (345).

## Not claimed
RLS tests, anon-key abuse tests, and a successful insert.

## Runtime
Earlier preview (public site on, lead flag off at that time):

- Homepage rendered in Arabic.
- Catalog showed the missing-`products` error, not demo rows.
- Empty wholesale form showed validation text.
- 360px width did not scroll sideways.
- `/checkout` said direct purchase is off.

This phase does not have a saved lead to show on `/admin/leads`.

## Not claimed
RLS tests, anon-key abuse tests, and a successful insert.
