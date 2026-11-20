# Launch readiness report

**Status: CONDITIONALLY READY — BLOCKERS DOCUMENTED**

The combined sales site on `feat/manjoor-whatsapp-sales` (`709e17e`) can capture labeled wholesale/custom/contact inquiries on project `ovkhxhuucxisevuvmuoz` and can open WhatsApp `9647871857930`. It is **not** publicly hosted. `main` is still the initial import. Indexing stays closed.

## 1. GitHub PRs

PRs **#1–#7 are all OPEN**. Linear stack. Tip contains all 33 commits vs `main` (`0` unique commits on `main`). Fast-forward `main` to `709e17e` is the safe consolidation. **Not merged** — waiting for approval (`GIT_INTEGRATION_AUDIT.md`).

## 2. Combined-code quality (this session)

```
npm ci          OK (after stopping leftover Vite/esbuild file locks)
tsc --noEmit    0 errors  (tsconfig.app.json)
eslint          0 errors
vitest          57 passed / 16 files
vite build      OK  dist/assets/index-wb1B_pvV.js
```

`npm ci` reported 44 dependency audit findings (informational).

## 3. Supabase

Correct project `ovkhxhuucxisevuvmuoz`. Active migration only `20261119200000_manjoor_public_leads.sql`. Historical Dukany SQL remains in `supabase/migration-history/`. `supabase db push` was not run. Frontend RPC names `p_source`, `p_payload`, `p_attribution` match the deployed function (live 200 responses). Tables expected: `profiles`, `categories`, `products`, `leads`, `lead_items`. Dashboard SQL MCP: permission denied this session.

## 4. Credentials

- DB password rotation: **unverified**. Procedure in `SECURITY_CHECKLIST.md`. Not rotated from here.
- Admin one-time file: **removed**. Admin password change: **unverified**.
- No service_role in frontend.

## 5. Hosting

Existing config: **Netlify SPA** (`netlify.toml`). No linked Netlify site, **zero** Hostinger websites, no Render MANJOOR service. **Working website URL: none.** Local only.

## 6. Production env

Local flags match the required operational set. Hosting env cannot be set until a site exists.

## 7. Customer journeys

See `CUSTOMER_JOURNEY_QA.md`. RPC persistence and WhatsApp links verified. Admin lead UI not re-authenticated. Checkout locked.

## 8. Remaining blockers (approval required)

1. Fast-forward merge of `feat/manjoor-whatsapp-sales` into `main` (do not auto-merge).
2. Authorized hosting account + deploy of `dist` with production `VITE_*`.
3. Canonical domain (optional after a default HTTPS hostname).
4. Confirm DB password and admin password rotation.
5. Sign in as admin and confirm `/admin/leads` against the new `MJ-261120-*` tests.
6. Keep indexing off until legal/domain approval.
7. Optional: React 18 `fetchPriority` console warning on the hero.

## Success vs launch

A visitor **on a deployed HTTPS origin** can inquire. That origin does not exist yet. A passing local production build is not a launch.
