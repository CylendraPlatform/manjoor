# Production environment

Project: MANJOOR. Isolated Supabase ref `ovkhxhuucxisevuvmuoz`. Do not point the app at Dukany.

## Expected Vite flags (public)

These are compile-time `VITE_` values. They are visible in the browser bundle. They are not secrets.

```
VITE_ENABLE_PUBLIC_SITE=true
VITE_ENABLE_LEAD_SUBMISSION=true
VITE_ENABLE_PUBLIC_SALES=false
VITE_ALLOW_INDEXING=false
VITE_ENABLE_WORKSHOP_PRODUCT_PROMO=false
VITE_BUSINESS_WHATSAPP=9647871857930
VITE_SITE_ORIGIN=https://manjoor.netlify.app
```

Plus the isolated project:

- `VITE_SUPABASE_URL` = `https://ovkhxhuucxisevuvmuoz.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = the project's **anon / publishable** key only

Do not put `service_role` in any `VITE_` variable or client file. Do not commit `.env`.

Local `.env` already matches the flags above (gitignored). The public site is a **manual** Netlify upload of `dist` to `https://manjoor.netlify.app/`. Git auto-deploy is intentionally **not** connected. If a host builds from git later, set the same names as **build** variables there.

Pending (not done in this repo): rotate the database password that previously appeared in local scrollback, and confirm the admin login password was changed after the one-time file was removed. See `docs/launch/SECURITY_CHECKLIST.md`. Do not print those values.

## WhatsApp

Temporary sales number: `9647871857930` (`https://wa.me/9647871857930`).

Normalized in `src/lib/whatsapp.ts` from `VITE_BUSINESS_WHATSAPP` (fallback `brand.contact.whatsapp`, currently empty). Empty config hides CTAs. Links never use a visitor phone.

Replace later by changing the env var and rebuilding. The number is temporary.

## Indexing

Keep closed until a canonical domain, legal copy, and launch approval exist. Procedure (do not run now):

1. Replace `SITE_ORIGIN_UNCONFIRMED` in `public/sitemap.xml`.
2. Allow `/` in `public/robots.txt`; disallow `/admin`, `/checkout`, `/cart`.
3. Set `VITE_ALLOW_INDEXING=true` and rebuild.

Currently: `User-agent: *` still `Disallow: /` (search engines stay closed). `facebookexternalhit`, `WhatsApp`, and `Twitterbot` are allowed so link previews can fetch `og:image`. `index.html` and `Seo` keep `noindex, nofollow` unless `VITE_ALLOW_INDEXING` is the string `true`.

## Direct checkout

`VITE_ENABLE_PUBLIC_SALES=false` maps `/checkout`, `/cart`, `/auth`, etc. to the internal-only screen. Do not flip this without legal approval and backend/RLS review.

## Hosting env checklist (when a site exists)

Set the same `VITE_*` values in the host's **build** environment, then rebuild. Changing them after a static deploy has no effect until the next `npm run build`.
