# Deployment guide

## What already exists

- Vite SPA. Build: `npm run build`. Publish directory: `dist`.
- `netlify.toml`: build command `npm run build`, publish `dist`, SPA fallback `/*` → `/index.html` status 200.
- `App.tsx` uses `BrowserRouter` on web so Netlify redirects are required for `/admin/login` and other deep links.

## What does **not** exist

| Provider | Finding |
|---|---|
| Netlify | Config file only. No linked site in this workspace. |
| Hostinger | `hosting_websites_list` returned **zero** websites. Creating a site or buying a domain needs separate approval. |
| Render | Workspace exists for other Cylendra products. **No MANJOOR service.** Other listed services are unrelated and several are billing-suspended. Do not reuse them. |
| Domain / DNS | None authorized. Do not invent a hostname. Do not change nameservers. |

There is **no production URL**.

## When a host is approved

Prefer Netlify (already described) or Hostinger static/Node deploy of `dist`. Requirements:

1. Fast-forward `main` only after the integration plan in `GIT_INTEGRATION_AUDIT.md` is approved.
2. Set production `VITE_*` from `PRODUCTION_ENVIRONMENT.md` as **build** variables.
3. Build `npm ci && npm run build`.
4. Publish `dist` with SPA fallback.
5. HTTPS on the host's default hostname first (Netlify `*.netlify.app` or Hostinger assigned name). Custom domain later.
6. Confirm hashed assets under `dist/assets/` (content-hashed filenames from Vite).
7. Confirm `/admin/login` works on refresh.
8. Do not upload `.env`, `photo/`, `hero-assets/`, or `supabase/.temp/`.
9. Keep indexing closed.

## Stop for approval

- Creating a paid hosting plan, domain, or DNS record
- Binding a customer-facing hostname
- Merging to `main`
- Opening robots/indexing
- `supabase db push` or any schema change

## Local preview of the production bundle

```bash
npm ci
npm run build
npm run preview
```

That is not a public launch.
