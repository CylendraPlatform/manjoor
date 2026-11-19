# SEO plan

The app is a Vite SPA. Crawlers that do not run JavaScript will not see per-route titles. `index.html` carries the default Arabic title and description. `Seo` updates title, description, Open Graph, canonical, and robots after hydration.

Indexing is **off**: `public/robots.txt` disallows all crawling, `index.html` sends `noindex`, and `Seo` keeps `noindex` unless `VITE_ALLOW_INDEXING=true`.

`public/sitemap.xml` lists the marketing paths with the placeholder host `SITE_ORIGIN_UNCONFIRMED`. Do not submit it until a real canonical origin exists and robots is opened.

Product JSON-LD is emitted only for an approved product that is actually rendered. Offer price is included only when `price_public` is true. Availability is `PreOrder`, not in-stock.

Intended queries, once indexing is allowed: مشغولات خشبية العراق، تحفيات خشبية كربلاء، تصنيع قطع خشبية حسب الطلب، خراطة خشب العراق، تجهيز منتجات خشبية بالجملة، قطع ديكور خشبية للتجار. Do not target hookah or unrelated retail terms.

Heading order on the homepage is one `h1` then section `h2`s.
