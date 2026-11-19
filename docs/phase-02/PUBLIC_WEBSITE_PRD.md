# Public website PRD

Arabic, RTL, mobile-first brochure plus inquiry tools. Not a checkout.

| Route | Behavior |
|---|---|
| `/` | Marketing homepage |
| `/products` | Approved catalog: search, category chips, sort |
| `/products/:slug` and `/product/:slug` | Approved product detail, quote quantity, WhatsApp context |
| `/wholesale` | Wholesale explanation and lead form |
| `/custom-orders` | Specs, quantity, governorate, local image check (no upload) |
| `/about` | Workshop story without unverified history |
| `/contact` | Contact actions; no invented phone |
| `/request-quote` | Quotation cart review and contact form |
| `/privacy` | Inquiry-data draft, not a returns policy |
| `/admin/leads` | Staff lead list when the table exists |

Unknown paths render an Arabic 404 when the public site flag is on, otherwise the internal-only screen.

Checkout, cart, offers, wishlist, and account pages stay behind the direct-checkout flag.

A successful quote screen appears only after `submit_quote_request` returns a reference. With the lead flag off, the form says the server did not save the request.
