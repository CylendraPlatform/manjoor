# Launch blockers (public site)

- Direct checkout (`VITE_ENABLE_PUBLIC_SALES`) stays false.
- Search indexing (`VITE_ALLOW_INDEXING`) stays false.
- WhatsApp uses the temporary env number `VITE_BUSINESS_WHATSAPP` (`9647871857930`). Replace later without scattering the digits in components.
- Quote-request RPC still requires DB `public_approved` products; bakarat inquiries therefore use the existing wholesale lead form (`/wholesale?model=`), not `quote_request` line items.
- DB catalog still filters tobacco/hookah **legacy Dukany rows**. Public bakarat are the static workshop catalog only.
- Official SKU names, prices, and stock are unconfirmed.
- Workshop address and phone not approved for the footer.
- Admin credential / DB password rotation remain ops tasks.
