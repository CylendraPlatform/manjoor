# Deployment guide

MANJOOR is a **Vite static SPA**. GitHub `main` is the source of truth. The current public site is a **manual** upload of `dist` to `https://manjoor.netlify.app/`.

Do **not** connect Netlify to GitHub unless the owner asks. Do **not** purchase hosting, change DNS, or recreate that site from this guide.

## Build (same for every host)

| Item | Value |
|---|---|
| Node.js | **20** (`.nvmrc`). Minimum **18.18** (`package.json` `engines`) |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist/` (gitignored) |
| Preview locally | `npm run preview` |

`VITE_*` values are **baked in at build time**. Changing them on the host after upload does nothing until you rebuild.

Required **build** environment (names only — copy values from a password manager / `.env`, never from git):

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY   # anon / publishable only — never service_role
VITE_ENABLE_PUBLIC_SITE=true
VITE_ENABLE_LEAD_SUBMISSION=true
VITE_ENABLE_PUBLIC_SALES=false
VITE_ALLOW_INDEXING=false
VITE_ENABLE_WORKSHOP_PRODUCT_PROMO=false
VITE_BUSINESS_WHATSAPP=9647871857930
VITE_SITE_ORIGIN=https://manjoor.netlify.app
```

Details: `docs/launch/PRODUCTION_ENVIRONMENT.md`. Template: `.env.example`.

HTTPS is required for the browser app and for WhatsApp/Open Graph image fetches.

Supabase: isolated project `ovkhxhuucxisevuvmuoz` only. The static host does not run Postgres. Do not run `supabase db push` as part of a website deploy.

## SPA fallback (deep links)

React Router needs every unknown path to return `index.html` **200**, not a 404. Files that exist (`/assets/*`, `/brand/*`, `/hero/*`) must still be served as those files.

| Mechanism | File | Used when |
|---|---|---|
| Netlify | `netlify.toml` + `public/_redirects` (`/* /index.html 200`) | Netlify Git or drag-and-drop of `dist` |
| Apache | `public/.htaccess` (copied into `dist` by Vite) | Hostinger Apache / generic Apache |
| nginx | config snippet below | nginx VPS / some Cloud plans |

nginx (only if the plan actually uses nginx — do not assume Hostinger shared hosting does):

```
location / {
  try_files $uri $uri/ /index.html;
}
```

If a plan has **no** rewrite support, `/` works and `/admin/login` refresh returns 404. Use a host that supports the fallback, or stay on Netlify.

## Cache

- `index.html` and `robots.txt`: short cache or `must-revalidate` so a new upload is seen quickly.
- `/assets/*`: long cache (Vite content hashes).
- Images under `/brand/` and `/hero/`: long cache is fine; change the filename if you replace an image.

## 1. Netlify — manual upload (current method)

1. `npm ci && npm run build` with the production `.env` present locally (gitignored).
2. Upload the contents of `dist/` (includes `_redirects`, `.htaccess`, `brand/`, `hero/`).
3. Do not upload `.env`, `node_modules`, `photo/`, `hero-assets/`, or `supabase/.temp/`.
4. Confirm `https://manjoor.netlify.app/admin/login` still loads after a refresh.
5. Keep the existing site URL. Do not create a second MANJOOR site.

## 2. Netlify — Git (optional, not enabled)

If the owner later wants auto-deploy: connect **the existing** `manjoor.netlify.app` site to `CylendraPlatform/manjoor`, production branch `main`, command `npm run build`, publish `dist`, set the `VITE_*` **build** variables in the Netlify UI. Do not recreate the site.

## 3. Generic static hosting (including Hostinger)

Hostinger plans differ. **Do not assume** Node, nginx, or `.htaccess` on every plan.

**A. Static / Apache (typical shared “public_html”)**

1. Build on a developer machine (`npm ci && npm run build`).
2. Upload `dist/` into the site’s document root.
3. Confirm `.htaccess` arrived and `mod_rewrite` is on. Test `/admin/login` refresh.
4. TLS on the assigned hostname.

**B. Plan that can run Node on the server**

1. Clone `main`, `npm ci`, set build env, `npm run build`.
2. Point the web root at `dist/` (not the repo root).
3. Still need an SPA fallback (`try_files` or `.htaccess`). The Node runtime is only for **building**, not for serving the SPA.

**C. Plan with neither Node nor rewrite**

Build locally and upload `dist/`. Only the homepage is reliable until rewrite is available.

## Do not upload

`.env`, tokens, `service_role`, `node_modules`, `dist` caches from another machine’s failed build, `photo/`, `hero-assets/`, `supabase/.temp/`.

## Stop for approval

- Connecting Git auto-deploy
- Buying a domain or changing DNS
- Opening robots/indexing
- `supabase db push` or schema change
- Recreating `manjoor.netlify.app`
