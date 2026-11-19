# SEO and indexing status

Indexing stays closed.

- `VITE_ALLOW_INDEXING=false`
- `public/robots.txt` is `Disallow: /`
- `index.html` sends `noindex, nofollow`
- `Seo` repeats `noindex` unless the env flag is the string `true`
- `public/sitemap.xml` still uses the placeholder host `SITE_ORIGIN_UNCONFIRMED`

## How to open indexing later
Only after a canonical domain exists, the catalog shows approved non-regulated products, and lead saving has been verified:

1. Replace `SITE_ORIGIN_UNCONFIRMED` in `public/sitemap.xml` with the real origin.
2. Change `public/robots.txt` to allow `/` and disallow `/admin`, `/checkout`, and `/cart`.
3. Set `VITE_ALLOW_INDEXING=true` and rebuild.

Do not do those steps while the product photos are hookah components and the database is unreachable.
