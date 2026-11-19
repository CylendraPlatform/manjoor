# Launch readiness

Do not turn the site on for the public until every item below is true.

| Gate | Now |
|---|---|
| Isolated MANJOOR Supabase project, not Dukany | Required before applying the lead migration |
| Migration applied and anon cannot `select` leads | Not done |
| `submit_quote_request` returns a reference on staging | Not done |
| Admin can read and update a lead; anon cannot | Not done |
| Rate limit and duplicate hash observed | Not done |
| `VITE_ENABLE_LEAD_SUBMISSION` only after the above | Default false |
| Approved product rows (`public_approved`) and real photos | None shipped |
| `price_public` only for confirmed prices | Default false |
| WhatsApp/phone filled from the real business number | Empty |
| Privacy text reviewed | Draft only |
| Canonical domain, then replace sitemap host and open robots | Host unknown; robots disallow all |
| Direct checkout | Remains off |

A quote-only launch is allowed later, still without checkout, after the lead and privacy gates pass. Regulated merchandise stays out of that launch.
