# Customer journeys

| Journey | What the build does | What it does not prove |
|---|---|---|
| A. Home → catalog → product → quote | Routes and quote cart exist. Catalog is empty until a product is `public_approved`. | A live saved quote |
| B. Wholesale form | Client validation runs. Submit reports “not saved” while `VITE_ENABLE_LEAD_SUBMISSION` is false. | A stored lead |
| C. Product WhatsApp | Link is built only when `brand.contact.whatsapp` is set. Otherwise the control says the number is not configured. A click is `whatsapp_click`, not a lead. | That a message was delivered |
| D. Admin new → contacted → qualified | Status machine is enforced in `canTransition`. The screen lists real rows only. | Data, until the migration is applied on an isolated project |
| E. Invalid form | Zod messages for name, Iraqi phone, governorate, quantity, and empty quote lines | — |
| F. Missing backend | Unavailable catalog and lead errors stay as errors. No success reference is shown. | — |
